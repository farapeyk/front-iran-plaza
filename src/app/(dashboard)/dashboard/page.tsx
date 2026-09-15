// src/app/(dashboard)/dashboard/page.tsx
import { Briefcase, User as UserIcon, ShieldCheck, CreditCard, Headphones, Users, Heart, Bell } from "lucide-react";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { CurrentUser } from "@/types/auth";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardUserCard } from "@/features/dashboard/components/dashboard-user-card";
import { DashboardMenuItem } from "@/features/dashboard/components/dashboard-menu-item";
import { DashboardLogoutItem } from "@/features/dashboard/components/dashboard-logout-item";
import type { BusinessProfile } from "@/features/business/types/business-profile";

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getMyBusiness(accessToken: string): Promise<BusinessProfile | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/mine`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  
  const businesses: BusinessProfile[] = await res.json();
  return businesses[0] ?? null;
}

export default async function DashboardPage() {
  const accessToken = await getAccessTokenCookie();
  const [user, business] = accessToken
    ? await Promise.all([getCurrentUser(accessToken), getMyBusiness(accessToken)])
    : [null, null];

  // ✅ بررسی اینکه آیا کسب‌وکار تایید شده است یا خیر
  const isBusinessApproved = business?.status === "APPROVED";

  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      <div className="max-w-md mx-auto pb-10">
        <DashboardHeader />

        <DashboardUserCard 
          fullName={user?.fullName ?? null} 
          phone={user?.phone ?? ""} 
          business={business} 
        />

        <nav className="mt-6 px-5">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            {/* ✅ آیتم پروفایل من conditionally rendered */}
            <DashboardMenuItem 
              title="پروفایل من" 
              subtitle={isBusinessApproved ? "ویرایش پروفایل و اطلاعات" : "پس از تایید کسب‌وکار باز می‌شود"} 
              icon={Briefcase} 
              href="/dashboard/business/profile" 
              disabled={!isBusinessApproved} 
            />
            <DashboardMenuItem title="اطلاعات حساب کاربری" subtitle="شماره موبایل و امنیت" icon={UserIcon} href="/dashboard/profile" />
            <DashboardMenuItem title="خرید اشتراک VIP" subtitle="مزایای ویژه کاربران" icon={ShieldCheck} href="/dashboard/vip" />
            <DashboardMenuItem title="پرداخت‌ها" subtitle="تاریخچه تراکنش‌ها" icon={CreditCard} href="/dashboard/payments" />
            <DashboardMenuItem title="پشتیبانی" subtitle="سوالات متداول و تماس" icon={Headphones} href="/dashboard/support" />
            <DashboardMenuItem title="علاقه‌مندی‌ها" subtitle="کسب‌وکارهایی که ذخیره کرده‌اید" icon={Heart} href="/dashboard/favorites" />
            <DashboardMenuItem title="اعلان‌ها" subtitle="آخرین اطلاعیه‌ها" icon={Bell} href="/dashboard/notifications" />
            <DashboardMenuItem title="دعوت دوستان (به‌زودی)" subtitle="کد معرف و پورسانت‌ها" icon={Users} disabled />
            <DashboardLogoutItem />
          </div>
        </nav>
      </div>
    </div>
  );
}