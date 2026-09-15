import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { FeaturesManager } from "@/features/business/components/profile/features-manager";
import type { BusinessFeature } from "@/features/business/types/business-feature";

async function getFeatures(businessId: string, accessToken: string): Promise<BusinessFeature[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/features`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function FeaturesPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const features = accessToken ? await getFeatures(business.id, accessToken) : [];

  return (
    <ProfileEditShell title="امکانات">
      <FeaturesManager businessId={business.id} initialFeatures={features} />
    </ProfileEditShell>
  );
}