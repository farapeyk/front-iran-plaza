import { FeedbackQueue } from "@/features/content/components/feedback-queue";
import type { ArticleFeedbackQueueItem, ContentIdentity } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

export default async function ContentFeedbackPage() {
  const token = await getAccessTokenCookie();
  const identity = await backendGet<ContentIdentity>("/api/content/me", token as string);
  if (!identity.canPublish) redirect("/content");
  const items = await backendGet<ArticleFeedbackQueueItem[]>("/api/content/feedback?status=PENDING", token as string);
  return <div className="space-y-6"><header><h1 className="text-2xl font-black">نظرات مقاله‌ها</h1><p className="mt-1 text-sm text-neutral-500">فقط نظرهای تاییدشده در صفحه عمومی نمایش داده می‌شوند.</p></header><FeedbackQueue items={items} /></div>;
}
