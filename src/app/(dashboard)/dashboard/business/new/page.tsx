import { redirect } from 'next/navigation';
import { pageFetch } from '@/lib/api/page-fetch';
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { BusinessWizard } from "@/features/business/components/business-wizard";
import type { Category } from "@/features/business/components/steps/business-info-step";
import type { CurrentUser } from "@/types/auth";
import { getMyBusiness } from '@/features/business/lib/get-my-business';
import { getRegistrationDocuments } from '@/features/business/lib/get-registration-documents';

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await pageFetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}


async function getCategories(): Promise<Category[]> {
  try {
    const res = await pageFetch(`${process.env.BACKEND_INTERNAL_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) { throw error; }
}

export default async function NewBusinessPage() {
  const accessToken = await getAccessTokenCookie();
  const [user, categories] = await Promise.all([
    accessToken ? getCurrentUser(accessToken) : Promise.resolve(null),
    getCategories(),
  ]);

  if (!user) redirect('/login');
  const business = await getMyBusiness();
  const documents = business && accessToken ? await getRegistrationDocuments(accessToken, business.id) : [];

  return (
    <div className="min-h-screen bg-[#FBF1E8] px-4 py-8" dir="rtl">
      <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <BusinessWizard user={user} categories={categories} business={business} documents={documents} />
      </div>
    </div>
  );
}
