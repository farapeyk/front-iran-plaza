import type { Metadata } from "next";
import { ArticlesLivePage } from "@/design/pages/articles-live";
import { backendGet } from "@/lib/api/backend-get";
import type { ContentCategory, PublicArticleListResponse } from "@/features/content/types";
import { buildArticleListStructuredData } from "@/features/seo/article-seo";
import { JsonLd } from "@/features/seo/json-ld";

type PageProps = { searchParams: Promise<{ q?: string; category?: string; page?: string }> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const filtered = Boolean(params.q?.trim() || params.category?.trim() || (Number.parseInt(params.page ?? "1", 10) || 1) > 1);
  const title = "مقالات ایران پلازا | راهنمای انتخاب کسب‌وکار";
  const description = "راهنماها و فهرست‌های کاربردی برای شناخت و انتخاب کسب‌وکارهای ثبت‌شده در ایران پلازا.";
  return {
    title,
    description,
    alternates: { canonical: "/articles/" },
    robots: { index: !filtered, follow: true },
    openGraph: { type: "website", locale: "fa_IR", siteName: "ایران پلازا", url: "/articles/", title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const query = new URLSearchParams({ page: String(page), limit: "12" });
  if (params.q?.trim()) query.set("search", params.q.trim());
  if (params.category?.trim()) query.set("category", params.category.trim());
  const [result, categories] = await Promise.all([
    backendGet<PublicArticleListResponse>(`/api/articles?${query.toString()}`),
    backendGet<ContentCategory[]>("/api/articles/categories"),
  ]);
  const publicQuery = new URLSearchParams();
  if (params.q?.trim()) publicQuery.set("q", params.q.trim());
  if (params.category?.trim()) publicQuery.set("category", params.category.trim());
  if (page > 1) publicQuery.set("page", String(page));
  const listPath = publicQuery.size ? `/articles/?${publicQuery.toString()}` : "/articles/";
  return <><JsonLd data={buildArticleListStructuredData(result.data, "مقالات ایران پلازا", listPath, (page - 1) * 12 + 1)} /><ArticlesLivePage result={result} categories={categories} query={params.q} category={params.category} /></>;
}
