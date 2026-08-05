import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { CompleteProfileForm } from "@/features/profile/components/complete-profile-form";
import type { CurrentUser } from "@/types/auth";

async function getCurrentUser(): Promise<CurrentUser | null> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return null;

  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function CompleteProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-10" dir="rtl">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-neutral-900">تکمیل اطلاعات حساب کاربری</h1>
          <p className="mt-1 text-sm text-neutral-500">
            برای استفاده از امکانات ایران پلازا، لطفاً اطلاعات زیر را تکمیل کنید
          </p>
        </div>

        <CompleteProfileForm phone={user?.phone ?? ""} />
      </div>
    </div>
  );
}
