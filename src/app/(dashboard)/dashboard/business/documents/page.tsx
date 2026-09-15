// src/app/(dashboard)/dashboard/business/documents/page.tsx
import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { ReuploadDocumentsForm } from "@/features/business/components/reupload-documents-form";

export default async function ReuploadDocumentsPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  return (
    <ProfileEditShell title="بارگذاری مجدد مدارک">
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        مدارک قبلی شما رد شده است. لطفاً مدارک جدید و واضح را بارگذاری کنید.
      </div>
      <ReuploadDocumentsForm businessId={business.id} />
    </ProfileEditShell>
  );
}