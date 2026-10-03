import Link from "next/link";
import { Lock } from "lucide-react";
import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { AnalyticsCards } from "@/features/business/components/profile/analytics-card";

type AnalyticsResult = { ok: true; data: Record<string, number> } | { ok: false; locked: boolean };

async function getAnalytics(businessId: string, accessToken: string): Promise<AnalyticsResult> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/analytics`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (res.status === 403) return { ok: false, locked: true };
  if (!res.ok) return { ok: false, locked: false };
  return { ok: true, data: await res.json() };
}

export default async function AnalyticsPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const result = accessToken ? await getAnalytics(business.id, accessToken) : { ok: false as const, locked: false };

  return (
    <ProfileEditShell title="آمار بازدید">
      {result.ok ? (
        <AnalyticsCards data={result.data} />
      ) : result.locked ? (
        <div className="text-center py-8" dir="rtl">
          <Lock className="mx-auto text-neutral-300 mb-3" size={28} />
          <p className="text-sm text-neutral-700 font-medium mb-1">آمار بازدید مخصوص اشتراک VIP است.</p>
          <p className="text-xs text-neutral-500 mb-4">با ارتقا به VIP، آمار بازدید، تماس و علاقه‌مندی‌های پروفایلتان را ببینید.</p>
          <Link href="/dashboard/business/profile" className="inline-block text-sm bg-emerald-950 text-white rounded-full px-5 py-2">
            ارتقا به VIP
          </Link>
        </div>
      ) : (
        <p className="text-sm text-neutral-500 text-center py-8" dir="rtl">
          دریافت آمار با خطا مواجه شد.
        </p>
      )}
    </ProfileEditShell>
  );
}
