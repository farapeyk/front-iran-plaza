// src/app/admin/(panel)/businesses/[id]/page.tsx
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { BusinessApprovalActions } from "@/features/admin/components/business-approval-actions";
import { PlanChangeControl } from "@/features/admin/components/plan-change-control";
import { DocumentReviewCard, type BusinessDocumentData } from "@/features/admin/components/document-review-card";
import type { PlanSummary } from "@/features/admin/types/plan";

interface BusinessDetail {
  id: string;
  name: string;
  phone: string;
  description: string | null;
  address: string | null;
  status: string;
  planType: string;
  createdAt: string;
  documents?: BusinessDocumentData[];
}

async function getBusinessDetail(id: string, accessToken: string): Promise<BusinessDetail | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getPlans(): Promise<PlanSummary[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/plans`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accessToken = await getAccessTokenCookie();
  
  // دریافت همزمان اطلاعات کسب‌وکار و لیست پلن‌ها
  const [business, plans] = accessToken
    ? await Promise.all([
        getBusinessDetail(id, accessToken),
        getPlans()
      ])
    : [null, []];

  if (!business) {
    return <p className="text-sm text-neutral-500" dir="rtl">کسب‌وکار پیدا نشد.</p>;
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div>
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
        currentPlanType={business.planType} 
        plans={plans} 
      />

      <BusinessApprovalActions businessId={business.id} status={business.status} />

      <div>
        <p className="text-sm font-bold text-neutral-900 mb-3">مدارک ارسالی</p>
        {!business.documents || business.documents.length === 0 ? (
          <p className="text-sm text-neutral-500">هنوز مدرکی ارسال نشده.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {business.documents.map((doc) => (
              <DocumentReviewCard key={doc.id} document={doc} businessId={business.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}