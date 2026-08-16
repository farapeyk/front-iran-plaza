import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { UserSuspensionActions } from "@/features/admin/components/user-suspension-actions";
import type { AdminUserDetail } from "@/features/admin/types/user";

const USER_TYPE_LABEL: Record<string, string> = {
  CUSTOMER: "مشتری",
  BUSINESS_OWNER: "صاحب کسب‌وکار",
  ADMIN: "ادمین",
  SUPER_ADMIN: "مدیر ارشد",
};

async function getUserDetail(id: string, accessToken: string): Promise<AdminUserDetail | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessTokenCookie();
  const user = accessToken ? await getUserDetail(id, accessToken) : null;

  if (!user) {
    return <p className="text-sm text-neutral-500" dir="rtl">کاربر پیدا نشد.</p>;
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">{user.fullName ?? "بدون نام"}</h1>
          <p className="text-sm text-neutral-500 mt-1" dir="ltr">
            {user.phone}
          </p>
          <p className="text-sm text-neutral-500 mt-0.5">{USER_TYPE_LABEL[user.userType] ?? user.userType}</p>
          {user.isSuspended && user.suspendedReason && (
            <p className="text-sm text-red-600 mt-1">دلیل تعلیق فعلی: {user.suspendedReason}</p>
          )}
        </div>
        <UserSuspensionActions userId={user.id} isSuspended={user.isSuspended} />
      </div>

      <div className="border border-neutral-200 rounded-lg p-4">
        <p className="text-sm font-bold text-neutral-900 mb-3">کسب‌وکارهای متعلق به این کاربر</p>
        {user.businesses.length === 0 ? (
          <p className="text-sm text-neutral-500">کسب‌وکاری ندارد.</p>
        ) : (
          <ul className="space-y-2">
            {user.businesses.map((b) => (
              <li key={b.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-800">{b.name}</span>
                <span className="text-xs text-neutral-500">{b.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border border-neutral-200 rounded-lg p-4">
        <p className="text-sm font-bold text-neutral-900 mb-3">تاریخچه تعلیق</p>
        {user.suspensionsReceived.length === 0 ? (
          <p className="text-sm text-neutral-500">موردی ثبت نشده.</p>
        ) : (
          <ul className="space-y-3">
            {user.suspensionsReceived.map((s) => (
              <li key={s.id} className="text-sm border-b border-neutral-100 pb-2 last:border-0 last:pb-0">
                <p className="font-medium text-neutral-800">
                  {s.action === "SUSPENDED" ? "تعلیق شد" : "رفع تعلیق شد"} — توسط {s.performer.fullName ?? s.performer.phone}
                </p>
                {s.reason && <p className="text-neutral-500 mt-0.5">دلیل: {s.reason}</p>}
                <p className="text-xs text-neutral-400 mt-0.5">{new Date(s.createdAt).toLocaleDateString("fa-IR")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}