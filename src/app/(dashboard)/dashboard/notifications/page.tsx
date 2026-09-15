import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { NotificationRow } from "@/features/notifications/components/notification-row";
import type { NotificationItem } from "@/features/notifications/types";

async function getNotifications(accessToken: string): Promise<NotificationItem[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/notifications?page=1&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

export default async function NotificationsPage() {
  const accessToken = await getAccessTokenCookie();
  const notifications = accessToken ? await getNotifications(accessToken) : [];

  return (
    <div className="min-h-screen bg-[#FBF1E8] px-4 py-8" dir="rtl">
      <div className="max-w-md mx-auto">
        <h1 className="text-lg font-bold text-neutral-900 mb-6">اعلان‌ها</h1>

        {notifications.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-16">اعلانی وجود ندارد.</p>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            {notifications.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}