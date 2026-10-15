import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContentSidebar } from "@/features/content/components/content-sidebar";
import type { ContentIdentity } from "@/features/content/types";
import { BackendError, backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export const metadata: Metadata = { title: "تحریریه ایران پلازا", robots: { index: false, follow: false } };

export default async function ContentLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessTokenCookie();
  if (!token) redirect("/login");
  let identity: ContentIdentity;
  try {
    identity = await backendGet<ContentIdentity>("/api/content/me", token);
  } catch (error) {
    if (error instanceof BackendError && (error.status === 401 || error.status === 403)) redirect("/dashboard");
    throw error;
  }
  return <div className="min-h-screen bg-neutral-50 md:flex" dir="rtl"><ContentSidebar canPublish={identity.canPublish} /><main className="min-w-0 flex-1 px-4 py-8 md:px-8"><div className="mx-auto max-w-6xl">{children}</div></main></div>;
}
