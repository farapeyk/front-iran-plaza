import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { ArticlePublicPage } from "@/features/content/components/article-public-page";
import { canEditPublicArticle, editorArticleToPreview } from "@/features/content/lib/article-preview";
import { articlePath, articlePreviewPath, categoryPath } from "@/features/content/lib/public-paths";
import type { ContentCategory, ContentIdentity, EditorArticle, PublicArticle, PublicArticleListItem } from "@/features/content/types";
import { buildArticleMetadata } from "@/features/seo/article-seo";
import { backendGet, BackendError } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

type RedirectResult = { redirectTo: string };
const getArticle = cache((slug: string) => backendGet<PublicArticle | RedirectResult>(`/api/articles/${encodeURIComponent(slug)}`));
const getEditorArticle = cache((id: string, token: string) => backendGet<EditorArticle>(`/api/content/articles/${encodeURIComponent(id)}`, token));
const getCategories = cache(() => backendGet<ContentCategory[]>("/api/articles/categories"));

function previewIdFrom(searchParams: { preview?: string | string[] }): string | null {
  return typeof searchParams.preview === "string" && searchParams.preview ? searchParams.preview : null;
}

function previewSessionRefreshPath(slug: string, previewId: string): string {
  return `/api/auth/silent-refresh?redirect=${encodeURIComponent(articlePreviewPath(slug, previewId))}`;
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string | string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const previewId = previewIdFrom(await searchParams);
  if (previewId) return { title: "پیش‌نمایش مقاله", robots: { index: false, follow: false } };
  try {
    const result = await getArticle(slug);
    if ("redirectTo" in result) return { robots: { index: false, follow: true } };
    return buildArticleMetadata(result);
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) return { title: "مقاله یافت نشد", robots: { index: false, follow: false } };
    throw error;
  }
}

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string | string[] }> }) {
  const { slug } = await params;
  const previewId = previewIdFrom(await searchParams);
  if (previewId) {
    const token = await getAccessTokenCookie();
    if (!token) redirect(previewSessionRefreshPath(slug, previewId));
    let editorArticle: EditorArticle;
    try {
      editorArticle = await getEditorArticle(previewId, token);
    } catch (error) {
      if (error instanceof BackendError && error.status === 401) redirect(previewSessionRefreshPath(slug, previewId));
      if (error instanceof BackendError && (error.status === 403 || error.status === 404)) notFound();
      throw error;
    }
    if (editorArticle.slug !== slug) permanentRedirect(articlePreviewPath(editorArticle.slug, editorArticle.id));
    const categories = await getCategories().catch(() => []);
    const currentCategory = editorArticle.category ? categories.find(item => item.id === editorArticle.category?.id) : undefined;
    const currentCategoryPath = currentCategory ? categoryPath(currentCategory, categories) ?? undefined : undefined;
    return <ArticlePublicPage article={editorArticleToPreview(editorArticle)} categoryPath={currentCategoryPath} preview editHref={`/content/articles/${encodeURIComponent(editorArticle.id)}`} />;
  }
  let result: PublicArticle | RedirectResult;
  try {
    result = await getArticle(slug);
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  }
  if ("redirectTo" in result) permanentRedirect(articlePath(result.redirectTo));

  const relatedQuery = new URLSearchParams({ limit: "3", excludeId: result.id });
  const token = await getAccessTokenCookie();
  const [relatedArticles, categories, identity] = await Promise.all([
    backendGet<PublicArticleListItem[]>(`/api/articles/random?${relatedQuery}`).catch(() => []),
    getCategories().catch(() => []),
    token ? backendGet<ContentIdentity>("/api/content/me", token).catch(() => null) : Promise.resolve(null),
  ]);
  const currentCategory = result.category ? categories.find(item => item.id === result.category?.id) : undefined;
  const currentCategoryPath = currentCategory ? categoryPath(currentCategory, categories) ?? undefined : undefined;

  const editHref = canEditPublicArticle(identity, result.author.id) ? `/content/articles/${encodeURIComponent(result.id)}` : undefined;
  return <ArticlePublicPage article={result} relatedArticles={relatedArticles} categoryPath={currentCategoryPath} editHref={editHref} />;
}
