import { redirect } from "next/navigation";
import { ArticleBannerManager } from "@/features/content/components/article-banner-manager";
import type { ArticleBanner, ContentIdentity } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export default async function ContentBannersPage() {
  const token = await getAccessTokenCookie();
  const identity = await backendGet<ContentIdentity>("/api/content/me", token as string);
  if (!identity.canPublish) redirect("/content");
  const banners = await backendGet<ArticleBanner[]>("/api/content/banners", token as string);
  return <div className="space-y-6"><header><h1 className="text-2xl font-black">بنرهای مقاله</h1><p className="mt-1 text-sm text-neutral-500">بنرهای بالای تصویر اصلی و سایدبار مقاله‌ها را از اینجا مدیریت کنید.</p></header><ArticleBannerManager banners={banners} /></div>;
}
