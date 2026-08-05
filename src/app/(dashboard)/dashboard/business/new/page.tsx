import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { BusinessWizard } from "@/features/business/components/business-wizard";
import type { Category } from "@/features/business/components/steps/business-info-step";
import type { CurrentUser } from "@/types/auth";

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}


async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function NewBusinessPage() {
  const accessToken = await getAccessTokenCookie();
  const [user, categories] = await Promise.all([
    accessToken ? getCurrentUser(accessToken) : Promise.resolve(null),
    getCategories(),
  ]);

  if (!user) return null; // proxy.ts از قبل این مسیر رو محافظت کرده

  return (
    <div className="min-h-screen bg-[#FBF1E8] px-4 py-8" dir="rtl">
      <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <BusinessWizard user={user} categories={categories} />
      </div>
    </div>
  );
}