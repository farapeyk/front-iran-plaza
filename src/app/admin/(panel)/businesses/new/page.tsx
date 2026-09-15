import { ManualBusinessForm } from "@/features/admin/components/manual-business-form";
import type { PlanSummary } from "@/features/admin/types/plan";

async function getPlans(): Promise<PlanSummary[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/plans`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminNewBusinessPage() {
  const plans = await getPlans();

  return (
    <div dir="rtl" className="max-w-lg">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">ثبت کسب‌وکار حضوری/تلفنی</h1>
      <p className="text-sm text-neutral-500 mb-6">برای مراجعه‌کنندگانی که حضوراً یا تلفنی درخواست ثبت کسب‌وکار دارند.</p>

      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <ManualBusinessForm plans={plans} />
      </div>
    </div>
  );
}