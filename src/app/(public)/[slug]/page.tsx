import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticlePublicPage } from "@/features/content/components/article-public-page";
import { articlePath, categoryPath } from "@/features/content/lib/public-paths";
import type { ContentCategory, PublicArticle, PublicArticleListItem } from "@/features/content/types";
import { backendGet, BackendError } from "@/lib/api/backend-get";

type RedirectResult = { redirectTo: string };
const getArticle = cache((slug: string) => backendGet<PublicArticle | RedirectResult>(`/api/articles/${encodeURIComponent(slug)}`));
const getCategories = cache(() => backendGet<ContentCategory[]>("/api/articles/categories"));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await getArticle(slug);
    if ("redirectTo" in result) return { robots: { index: false, follow: true } };
    return {
      title: result.seoTitle || result.title,
      description: result.seoDescription || result.excerpt,
      alternates: { canonical: result.canonicalUrl || articlePath(result.slug) },
      robots: { index: result.robotsIndex, follow: result.robotsFollow },
      openGraph: {
        type: "article",
        title: result.seoTitle || result.title,
        description: result.seoDescription || result.excerpt,
        publishedTime: result.publishedAt ?? undefined,
        modifiedTime: result.updatedAt,
        images: result.coverImageId ? [{ url: `/api/backend/files/${encodeURIComponent(result.coverImageId)}`, alt: result.coverImageAlt || result.title }] : undefined,
      },
    };
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) return { title: "مقاله یافت نشد", robots: { index: false, follow: false } };
    throw error;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let result: PublicArticle | RedirectResult;
  try {
    result = await getArticle(slug);
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  }
  if ("redirectTo" in result) permanentRedirect(articlePath(result.redirectTo));

  const relatedQuery = new URLSearchParams({ limit: "3", excludeId: result.id });
  const [relatedArticles, categories] = await Promise.all([
    backendGet<PublicArticleListItem[]>(`/api/articles/random?${relatedQuery}`).catch(() => []),
    getCategories().catch(() => []),
  ]);
  const currentCategory = result.category ? categories.find(item => item.id === result.category?.id) : undefined;
  const currentCategoryPath = currentCategory ? categoryPath(currentCategory, categories) ?? undefined : undefined;

  return <ArticlePublicPage article={result} relatedArticles={relatedArticles} categoryPath={currentCategoryPath} />;
}
