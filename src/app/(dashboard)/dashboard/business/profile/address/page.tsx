import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { PrimaryAddressForm } from "@/features/business/components/profile/primary-address-form";
import { BranchesManager } from "@/features/business/components/profile/branches-manager";
import type { BranchLocation } from "@/features/business/types/business-extras";

interface BusinessWithLocation {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

async function getBusinessLocation(businessId: string, accessToken: string): Promise<BusinessWithLocation | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getBranches(businessId: string, accessToken: string): Promise<BranchLocation[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/branches`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AddressPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const [location, branches] = accessToken
    ? await Promise.all([getBusinessLocation(business.id, accessToken), getBranches(business.id, accessToken)])
    : [null, []];

  return (
    <ProfileEditShell title="آدرس و لوکیشن">
      <div className="space-y-8">
        <PrimaryAddressForm
          businessId={business.id}
          initialAddress={location?.address ?? ""}
          initialLatitude={location?.latitude ?? null}
          initialLongitude={location?.longitude ?? null}
        />
        <div>
          <p className="text-sm font-bold text-neutral-900 mb-3">شعبه‌های دیگر</p>
          <BranchesManager businessId={business.id} initialBranches={branches} />
        </div>
      </div>
    </ProfileEditShell>
  );
}