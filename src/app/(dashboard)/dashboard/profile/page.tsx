// src/app/(dashboard)/dashboard/profile/page.tsx
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { CurrentUser } from "@/types/auth";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/features/dashboard/components/edit-profile-form";

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProfilePage() {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) redirect("/login");

  const user = await getCurrentUser(accessToken);
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-50" dir="rtl">
      <div className="max-w-md mx-auto pb-10">
        <DashboardHeader />

        <div className="px-5 pt-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900">ویرایش پروفایل</h2>
              <p className="text-sm text-neutral-500 mt-1">اطلاعات حساب کاربری خود را به‌روز کنید.</p>
            </div>

            <EditProfileForm 
              defaultFullName={user.fullName || ""} 
              defaultEmail={user.email || ""} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}