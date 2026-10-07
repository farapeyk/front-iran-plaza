import { pageFetch } from '@/lib/api/page-fetch';
import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { BasicInfoForm } from "@/features/business/components/profile/basic-info-form";

export default async function BasicInfoPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");
  const response = await pageFetch(`${process.env.BACKEND_INTERNAL_URL}/api/categories`, { cache: 'no-store' });
  const categories = response.ok ? await response.json() : [];

  return (
    <ProfileEditShell title="نام، بیوگرافی و لوگو">
      <BasicInfoForm businessId={business.id} initialName={business.name} initialBio={business.description ?? ""} initialLogoId={business.logoId} categories={categories} initialCategoryIds={business.categories?.map(category => category.categoryId) ?? []} />
    </ProfileEditShell>
  );
}
