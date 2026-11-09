import { redirect } from "next/navigation";
import type { ContentIdentity } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { EditorialRedirectManager } from "@/features/content/components/editorial-redirect-manager";

export type EditorialRedirect = { id: string; source: string; target: string; isActive: boolean; updatedAt: string };

export default async function EditorialRedirectsPage() {
  const token = await getAccessTokenCookie();
  const identity = await backendGet<ContentIdentity>("/api/content/me", token as string);
  if (!identity.canPublish) redirect("/content");
  const redirects = await backendGet<EditorialRedirect[]>("/api/content/redirects", token as string);
  return <div className="space-y-6"><header><h1 className="text-2xl font-black">ریدایرکت آدرس‌های مقاله</h1><p className="mt-1 text-sm text-neutral-500">آدرس قدیمی را به مسیر جدید داخل سایت وصل کنید. این ریدایرکت‌ها دائمی (301) هستند.</p></header><EditorialRedirectManager initial={redirects} /></div>;
}
