import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { BackendError } from '@/lib/api/backend-get';
import { getAdminBusinessDetail } from '@/features/admin/lib/get-business-detail';
import { BusinessProfileOverview } from '@/features/admin/components/business-profile-overview';
// src/app/admin/(panel)/businesses/[id]/page.tsx
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { BusinessApprovalActions } from "@/features/admin/components/business-approval-actions";
import { PlanChangeControl } from "@/features/admin/components/plan-change-control";
import { DocumentReviewCard } from "@/features/admin/components/document-review-card";

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) redirect('/admin/login');
  const detail = await getAdminBusinessDetail(id, accessToken).catch(error => {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  });
  const { business, plans, unavailable } = detail;

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        {business.logoId && <Image unoptimized width={80} height={80} src={'/api/backend/files/' + encodeURIComponent(business.logoId)} alt={business.name} className="w-20 h-20 object-cover rounded-lg mb-3" />}
        <h1 className="text-lg font-bold text-neutral-900">{business.name}</h1>
        <p className="text-sm text-neutral-500 mt-1" dir="ltr">
          {business.phone}
        </p>
        {business.address && <p className="text-sm text-neutral-500 mt-0.5">{business.address}</p>}
        {business.description && <p className="text-sm text-neutral-700 mt-2">{business.description}</p>}
      </div>

      {/* ✅ اعمال تغییرات مورد نیاز شما */}
      <PlanChangeControl 
        businessId={business.id} 
        currentPlanType={business.planType ?? "FREE"}
        plansUnavailable={unavailable.includes("plans")}
        plans={plans} 
      />

      <BusinessApprovalActions businessId={business.id} status={business.status} />

      <BusinessProfileOverview business={business} unavailable={unavailable} />

      <div>
        <p className="text-sm font-bold text-neutral-900 mb-3">مدارک ارسالی</p>
        {unavailable.includes('documents') ? <p role="status" className="text-sm text-amber-800">دریافت مدارک انجام نشد؛ صفحه را دوباره بارگذاری کنید.</p> : !business.documents || business.documents.length === 0 ? (
          <p className="text-sm text-neutral-500">هنوز مدرکی ارسال نشده.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {business.documents.map((doc) => (
              <DocumentReviewCard key={doc.id} document={doc} businessId={business.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
