import { redirect } from "next/navigation";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { PlanManager } from "@/features/admin/components/plan-manager";
import type { PlanSummary } from "@/features/admin/types/plan";

export default async function AdminPlansPage() {
  const [currentUser, accessToken] = await Promise.all([getCurrentUser(), getAccessTokenCookie()]);
  if (currentUser?.userType !== "SUPER_ADMIN" || !accessToken) redirect("/admin");
  const plans = await backendGet<PlanSummary[]>("/api/admin/plans", accessToken);

  return <div className="space-y-6">
    <header><h1 className="text-xl font-black text-neutral-950">مدیریت پلن‌های VIP</h1><p className="mt-2 text-sm leading-7 text-neutral-600">پلن‌ها را با قیمت، مدت، سقف محتوا و امکانات اختصاصی بسازید. فعال‌سازی هر پلن فقط از صفحه کسب‌وکار و توسط ادمین انجام می‌شود.</p></header>
    <PlanManager plans={plans} />
  </div>;
}
