import { pageFetch } from '@/lib/api/page-fetch';
import { ManualBusinessForm } from "@/features/admin/components/manual-business-form";
import type { PlanSummary } from "@/features/admin/types/plan";
import type { BusinessCategoryOption } from '@/features/business/lib/category-options';

async function getPlans(): Promise<PlanSummary[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/plans`, { cache: 'no-store', signal: AbortSignal.timeout(15000), redirect: 'error' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function AdminNewBusinessPage() {
  const [plans, categoriesResponse] = await Promise.all([getPlans(), pageFetch(`${process.env.BACKEND_INTERNAL_URL}/api/categories`, { cache: 'no-store' })]);
  if (!categoriesResponse.ok) throw new Error('دریافت دسته‌بندی‌ها انجام نشد؛ دوباره تلاش کنید.');
  const categories: BusinessCategoryOption[] = await categoriesResponse.json();

  return (
    <div dir="rtl" className="max-w-lg">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">ثبت کسب‌وکار حضوری/تلفنی</h1>
      <p className="text-sm text-neutral-500 mb-6">برای مراجعه‌کنندگانی که حضوراً یا تلفنی درخواست ثبت کسب‌وکار دارند.</p>

      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <ManualBusinessForm plans={plans} categories={categories} />
      </div>
    </div>
  );
}
