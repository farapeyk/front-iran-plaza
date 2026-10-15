import { ContentCategoryManager } from "@/features/content/components/content-category-manager";
import type { ContentCategory, ContentIdentity } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

export default async function ContentCategoriesPage() {
  const token = await getAccessTokenCookie();
  const identity = await backendGet<ContentIdentity>("/api/content/me", token as string);
  if (!identity.canPublish) redirect("/content");
  const categories = await backendGet<ContentCategory[]>("/api/content/categories", token as string);
  return <div className="space-y-6"><header><h1 className="text-2xl font-black">دسته‌بندی‌های محتوا</h1><p className="mt-1 text-sm text-neutral-500">دسته‌بندی‌های مستقل مقاله‌ها؛ با دسته‌بندی کسب‌وکار اشتباه نشود.</p></header><ContentCategoryManager categories={categories} /></div>;
}
