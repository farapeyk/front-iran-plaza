import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ArticlesLivePage } from "@/design/pages/articles-live";
import { categoryPath, findCategoryBySegments } from "@/features/content/lib/public-paths";
import type { ContentCategory, PublicArticleListResponse } from "@/features/content/types";
import { absoluteSiteUrl, buildArticleListStructuredData } from "@/features/seo/article-seo";
import { JsonLd } from "@/features/seo/json-ld";
import { backendGet } from "@/lib/api/backend-get";

type PageProps = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

const getCategories = cache(() => backendGet<ContentCategory[]>("/api/articles/categories"));

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [{ segments }, query] = await Promise.all([params, searchParams]);
  const categories = await getCategories();
  const category = findCategoryBySegments(categories, segments);
  if (!category) return { title: "دسته‌بندی یافت نشد", robots: { index: false, follow: false } };
  const canonicalPath = categoryPath(category, categories);
  const canonical = canonicalPath ? absoluteSiteUrl(canonicalPath) : null;
  const filtered = Boolean(query.q?.trim() || (Number.parseInt(query.page ?? "1", 10) || 1) > 1);
  const title = `${category.name} | ایران پلازا`;
  const description = category.description || `مقاله‌ها و راهنماهای ایران پلازا در دسته ${category.name}`;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: { index: !filtered, follow: true },
    openGraph: canonical ? { type: "website", locale: "fa_IR", siteName: "ایران پلازا", url: canonical, title, description } : undefined,
    twitter: { card: "summary", title, description },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ segments }, input, categories] = await Promise.all([params, searchParams, getCategories()]);
  const category = findCategoryBySegments(categories, segments);
  if (!category) notFound();

  const page = Math.max(1, Number.parseInt(input.page ?? "1", 10) || 1);
  const query = new URLSearchParams({ page: String(page), limit: "12", category: category.slug });
  if (input.q?.trim()) query.set("search", input.q.trim());
  const result = await backendGet<PublicArticleListResponse>(`/api/articles?${query.toString()}`);
  const canonicalPath = categoryPath(category, categories) as string;
  const publicQuery = new URLSearchParams();
  if (input.q?.trim()) publicQuery.set("q", input.q.trim());
  if (page > 1) publicQuery.set("page", String(page));
  const listPath = publicQuery.size ? `${canonicalPath}?${publicQuery.toString()}` : canonicalPath;
  return <><JsonLd data={buildArticleListStructuredData(result.data, category.name, listPath, (page - 1) * 12 + 1)} /><ArticlesLivePage result={result} categories={categories} query={input.q} category={category.slug} /></>;
}
