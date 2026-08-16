import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { SocialMediaForm } from "@/features/business/components/profile/social-media-form";

export default async function SocialMediaPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  return (
    <ProfileEditShell title="شبکه‌های اجتماعی">
      <SocialMediaForm businessId={business.id} initialSocial={business.socialMedia} />
    </ProfileEditShell>
  );
}