import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { GalleryManager } from "@/features/business/components/profile/gallery-manager";
import type { GalleryImageData } from "@/features/business/types/business-profile";

async function getGallery(businessId: string, accessToken: string): Promise<GalleryImageData[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/gallery`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function GalleryPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const images = accessToken ? await getGallery(business.id, accessToken) : [];

  return (
    <ProfileEditShell title="گالری تصاویر و ویدیو">
      <GalleryManager businessId={business.id} initialImages={images} initialIntroVideoId={business.introVideoId} />
    </ProfileEditShell>
  );
}