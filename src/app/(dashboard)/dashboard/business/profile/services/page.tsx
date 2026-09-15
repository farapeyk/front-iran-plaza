import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { ServicesManager } from "@/features/business/components/profile/services-manager";
import type { ServiceItem } from "@/features/business/types/business-extras";

async function getServices(businessId: string, accessToken: string): Promise<ServiceItem[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/services`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ServicesPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const services = accessToken ? await getServices(business.id, accessToken) : [];

  return (
    <ProfileEditShell title="خدمات">
      <ServicesManager businessId={business.id} initialServices={services} />
    </ProfileEditShell>
  );
}