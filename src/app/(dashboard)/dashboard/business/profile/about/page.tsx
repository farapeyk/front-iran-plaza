import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { AboutForm } from "@/features/business/components/profile/about-form";

export default async function AboutPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  return (
    <ProfileEditShell title="درباره ما">
      <AboutForm businessId={business.id} initialAboutText={business.aboutText ?? ""} />
    </ProfileEditShell>
  );
}