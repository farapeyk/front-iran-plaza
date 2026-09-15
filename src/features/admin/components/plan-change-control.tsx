"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { assignBusinessPlanAction, downgradeBusinessPlanAction } from "@/features/admin/actions/plan.action";
import type { PlanSummary } from "@/features/admin/types/plan";

export function PlanChangeControl({
  businessId,
  currentPlanType,
  plans,
}: {
  businessId: string;
  currentPlanType: string;
  plans: PlanSummary[];
}) {
  const [isPending, startTransition] = useTransition();
  const [planId, setPlanId] = useState("");

  function handleAssign() {
    if (!planId) {
      toast.error("یک پلن انتخاب کنید");
      return;
    }
    startTransition(async () => {
      const result = await assignBusinessPlanAction(businessId, planId);
      if (!result.success) toast.error(result.message);
      else toast.success("پلن با موفقیت اعطا شد");
    });
  }

  function handleDowngrade() {
    startTransition(async () => {
      const result = await downgradeBusinessPlanAction(businessId);
      if (!result.success) toast.error(result.message);
      else toast.success("کسب‌وکار به پلن رایگان بازگردانده شد");
    });
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-4" dir="rtl">
      <p className="text-sm font-bold text-neutral-900 mb-1">پلن فعلی: {currentPlanType === "VIP" ? "ویژه (VIP)" : "رایگان (FREE)"}</p>
      <p className="text-xs text-neutral-500 mb-3">اعطای پلن جدید یا بازگرداندن به رایگان</p>

      <div className="flex gap-2 items-center flex-wrap">
        <select value={planId} onChange={(e) => setPlanId(e.target.value)} disabled={isPending} className="h-9 rounded-md border border-input px-3 text-sm flex-1 min-w-[180px]">
          <option value="">انتخاب پلن برای اعطا...</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {Number(p.price).toLocaleString("fa-IR")} تومان / {p.durationDays} روز
            </option>
          ))}
        </select>

        <button onClick={handleAssign} disabled={isPending} className="h-9 px-4 rounded-md bg-emerald-950 text-white text-sm hover:bg-emerald-900 disabled:opacity-50">
          اعطای پلن
        </button>

        {currentPlanType === "VIP" && (
          <button onClick={handleDowngrade} disabled={isPending} className="h-9 px-4 rounded-md border border-red-300 text-red-600 text-sm hover:bg-red-50 disabled:opacity-50">
            بازگرداندن به رایگان
          </button>
        )}
      </div>
    </div>
  );
}