"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateInstallmentPlanAction } from "@/features/business/actions/installment.action";
import { REPAYMENT_PERIOD_OPTIONS, type InstallmentPlanData } from "@/features/business/types/business-extras";

export function InstallmentForm({ businessId, initialPlan }: { businessId: string; initialPlan: InstallmentPlanData | null }) {
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(initialPlan?.isActive ?? false); // ✅ استیت برای فعال/غیرفعال
  const [minDownPayment, setMinDownPayment] = useState(String(initialPlan?.minDownPaymentPercent ?? ""));
  const [monthlyInterest, setMonthlyInterest] = useState(String(initialPlan?.monthlyInterestPercent ?? ""));
  const [periods, setPeriods] = useState<number[]>(initialPlan?.repaymentPeriodsMonths ?? []);
  const [guaranteeNote, setGuaranteeNote] = useState(initialPlan?.guaranteeNote ?? "");

  function togglePeriod(months: number) {
    setPeriods((prev) => (prev.includes(months) ? prev.filter((m) => m !== months) : [...prev, months].sort((a, b) => a - b)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // ✅ اگر غیرفعال است، فقط همان را ذخیره کن و نیازی به چک بقیه فیلدها نیست
    if (isActive && (!minDownPayment || !monthlyInterest || periods.length === 0)) {
      toast.error("درصد پیش‌پرداخت، سود ماهانه و حداقل یک بازه‌ی اقساط را مشخص کنید");
      return;
    }
    
    startTransition(async () => {
      const result = await updateInstallmentPlanAction(businessId, {
        isActive, // ✅ ارسال وضعیت فعال بودن
        minDownPaymentPercent: Number(minDownPayment) || 0,
        monthlyInterestPercent: Number(monthlyInterest) || 0,
        repaymentPeriodsMonths: periods,
        guaranteeNote: guaranteeNote || undefined,
      });
      if (!result.success) toast.error(result.message);
      else toast.success("شرایط اقساط ذخیره شد");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
      {/* ✅ کلید فعال/غیرفعال کردن امکان خرید قسطی */}
      <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-lg p-3">
        <span className="text-sm font-medium text-neutral-900">امکان خرید قسطی</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" disabled={isPending} />
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
        </label>
      </div>

      <div className={`space-y-5 ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="space-y-2">
          <label className="text-sm font-medium">حداقل درصد پیش‌پرداخت</label>
          <Input value={minDownPayment} onChange={(e) => setMinDownPayment(e.target.value)} inputMode="numeric" dir="ltr" className="text-left" disabled={isPending} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">درصد سود ماهانه</label>
          <Input value={monthlyInterest} onChange={(e) => setMonthlyInterest(e.target.value)} inputMode="decimal" dir="ltr" className="text-left" disabled={isPending} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">بازه‌های اقساط (ماه)</label>
          <div className="flex flex-wrap gap-2">
            {REPAYMENT_PERIOD_OPTIONS.map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => togglePeriod(months)}
                disabled={isPending}
                className={[
                  "px-3 py-1.5 rounded-full text-sm border",
                  periods.includes(months) ? "bg-emerald-950 text-white border-emerald-950" : "border-neutral-300 text-neutral-600",
                ].join(" ")}
              >
                {months} ماهه
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">توضیح ضمانت <span className="text-muted-foreground">(اختیاری)</span></label>
          <textarea
            value={guaranteeNote}
            onChange={(e) => setGuaranteeNote(e.target.value)}
            rows={3}
            disabled={isPending}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره شرایط اقساط"}
      </Button>
    </form>
  );
}