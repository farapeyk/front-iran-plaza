import { backendGet } from '@/lib/api/backend-get';
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { NotificationRow } from "@/features/notifications/components/notification-row";
import type { NotificationItem } from "@/features/notifications/types";
import { DashboardAccountLayout } from '@/design/components/dashboard-account-layout';

async function getNotifications(accessToken: string): Promise<NotificationItem[]> {
  const data = await backendGet<NotificationItem[] | { data: NotificationItem[] }>('/api/notifications?page=1&limit=50', accessToken);
  return Array.isArray(data) ? data : data.data;
}

export default async function NotificationsPage() {
  const accessToken = await getAccessTokenCookie();
  const notifications = accessToken ? await getNotifications(accessToken) : [];

  return (
    <DashboardAccountLayout title="اعلان‌ها">
      <div className="w-full">

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
    </DashboardAccountLayout>
  );
}
