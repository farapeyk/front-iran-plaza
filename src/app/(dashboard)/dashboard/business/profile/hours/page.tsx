import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { WorkingHoursForm } from "@/features/business/components/profile/working-hours-form";
import type { WorkingHoursEntry } from "@/features/business/types/business-profile";

async function getWorkingHours(businessId: string, accessToken: string): Promise<WorkingHoursEntry[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/working-hours`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function WorkingHoursPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const entries = accessToken ? await getWorkingHours(business.id, accessToken) : [];

  return (
    <ProfileEditShell title="ساعات کاری">
      <WorkingHoursForm businessId={business.id} initialEntries={entries} />
    </ProfileEditShell>
  );
}