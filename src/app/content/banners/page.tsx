import { redirect } from "next/navigation";
import { ArticleBannerManager } from "@/features/content/components/article-banner-manager";
import type { ArticleBanner, ArticleListResponse, ContentIdentity } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export default async function ContentBannersPage() {
  const token = await getAccessTokenCookie();
  const identity = await backendGet<ContentIdentity>("/api/content/me", token as string);
  if (!identity.canPublish) redirect("/content");
  const [banners, firstPage] = await Promise.all([
    backendGet<ArticleBanner[]>("/api/content/banners", token as string),
    backendGet<ArticleListResponse>("/api/content/articles?limit=50&page=1", token as string),
  ]);
  const pages = await Promise.all(Array.from({ length: Math.max(0, Math.ceil(firstPage.total / 50) - 1) }, (_, index) =>
    backendGet<ArticleListResponse>(`/api/content/articles?limit=50&page=${index + 2}`, token as string),
  ));
  const articles = [...firstPage.data, ...pages.flatMap(page => page.data)]
    .map(({ id, title, status }) => ({ id, title, status }));
  return <div className="space-y-6"><header><h1 className="text-2xl font-black">بنرهای مقاله</h1><p className="mt-1 text-sm text-neutral-500">بنرهای بالای تصویر اصلی و سایدبار مقاله‌ها را مدیریت کنید.</p></header><ArticleBannerManager banners={banners} articles={articles} /></div>;
}
