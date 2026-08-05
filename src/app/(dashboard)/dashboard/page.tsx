import { Briefcase, User as UserIcon, ShieldCheck, CreditCard, Headphones, Users } from "lucide-react";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { CurrentUser } from "@/types/auth";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardUserCard } from "@/features/dashboard/components/dashboard-user-card";
import { DashboardMenuItem } from "@/features/dashboard/components/dashboard-menu-item";
import { DashboardLogoutItem } from "@/features/dashboard/components/dashboard-logout-item";

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getHasBusiness(accessToken: string): Promise<boolean> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/mine`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return res.ok;
}

export default async function DashboardPage() {
  const accessToken = await getAccessTokenCookie();
  const [user, hasBusiness] = accessToken
    ? await Promise.all([getCurrentUser(accessToken), getHasBusiness(accessToken)])
    : [null, false];

  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      <div className="max-w-md mx-auto pb-10">
        <DashboardHeader />

        <DashboardUserCard fullName={user?.fullName ?? null} phone={user?.phone ?? ""} hasBusiness={hasBusiness} />

        <nav className="mt-6 px-5">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <DashboardMenuItem title="پروفایل من" subtitle="ویرایش پروفایل و اطلاعات" icon={Briefcase} href="/dashboard/profile" />
            <DashboardMenuItem title="اطلاعات حساب کاربری" subtitle="شماره موبایل و امنیت" icon={UserIcon} href="/dashboard/account" />
            <DashboardMenuItem title="خرید اشتراک VIP" subtitle="مزایای ویژه کاربران" icon={ShieldCheck} href="/dashboard/vip" />
            <DashboardMenuItem title="پرداخت‌ها" subtitle="تاریخچه تراکنش‌ها" icon={CreditCard} href="/dashboard/payments" />
            <DashboardMenuItem title="پشتیبانی" subtitle="سوالات متداول و تماس" icon={Headphones} href="/dashboard/support" />
            <DashboardMenuItem title="دعوت دوستان (به‌زودی)" subtitle="کد معرف و پورسانت‌ها" icon={Users} disabled />
            <DashboardLogoutItem />
          </div>
        </nav>
      </div>
    </div>
  );
}