import { pageFetch } from '@/lib/api/page-fetch';
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { CompleteProfileForm } from "@/features/profile/components/complete-profile-form";
import type { CurrentUser } from "@/types/auth";
import { DesignProvider } from '@/design/provider';
import { WizardFrame } from '@/design/pages/registration-live';

async function getCurrentUser(): Promise<CurrentUser | null> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return null;

  const res = await pageFetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function CompleteProfilePage() {
  const user = await getCurrentUser();

  return (
    <DesignProvider user={user}><WizardFrame step="identity">
      <div className="w-full rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] bg-[var(--surface)] p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-neutral-900">تکمیل اطلاعات حساب کاربری</h1>
          <p className="mt-1 text-sm text-neutral-500">
            برای استفاده از امکانات ایران پلازا، لطفاً اطلاعات زیر را تکمیل کنید
          </p>
        </div>

        <CompleteProfileForm phone={user?.phone ?? ""} />
      </div>
    </WizardFrame></DesignProvider>
  );
}
