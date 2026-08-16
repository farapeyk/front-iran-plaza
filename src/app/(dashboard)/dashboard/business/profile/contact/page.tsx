import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { ContactForm } from "@/features/business/components/profile/contact-form";

export default async function ContactPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  return (
    <ProfileEditShell title="تماس و واتساپ">
      <ContactForm businessId={business.id} initialPhone={business.phone} initialPhone2={business.phone2 ?? ""} initialWhatsapp={business.whatsapp ?? ""} />
    </ProfileEditShell>
  );
}