import type { Metadata } from "next";
import { ArticlesLivePage } from "@/design/pages/articles-live";
import { backendGet } from "@/lib/api/backend-get";
import type { ContentCategory, PublicArticleListResponse } from "@/features/content/types";

type PageProps = { searchParams: Promise<{ q?: string; category?: string; page?: string }> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const filtered = Boolean(params.q?.trim() || params.category?.trim() || (Number.parseInt(params.page ?? "1", 10) || 1) > 1);
  return {
    title: "مقالات ایران پلازا | راهنمای انتخاب کسب‌وکار",
    description: "راهنماها و فهرست‌های کاربردی برای شناخت و انتخاب کسب‌وکارهای ثبت‌شده در ایران پلازا.",
    alternates: { canonical: "/articles/" },
    robots: { index: !filtered, follow: true },
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
  return <ArticlesLivePage result={result} categories={categories} query={params.q} category={params.category} />;
}
