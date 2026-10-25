"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deactivatePlanAction, savePlanAction, type PlanInput } from "@/features/admin/actions/plans.action";
import type { PlanFeatures, PlanSummary } from "@/features/admin/types/plan";

const FEATURE_LABELS: Array<[keyof PlanFeatures, string]> = [
  ["map", "نقشه و مسیریابی"],
  ["introVideo", "ویدیوی معرفی"],
  ["branches", "شعب کسب‌وکار"],
  ["workingHours", "ساعات کاری"],
  ["installments", "شرایط اقساط"],
  ["socialMedia", "شبکه‌های اجتماعی"],
  ["customFeatures", "ویژگی‌های سفارشی"],
  ["analytics", "آمار بازدید"],
];

const emptyFeatures = (): PlanFeatures => ({ map: false, introVideo: false, branches: false, workingHours: false, installments: false, socialMedia: false, customFeatures: false, analytics: false });
const emptyPlan = (): PlanInput => ({
  name: "",
  price: 0,
  durationDays: 30,
  galleryLimit: 0,
  productLimit: 0,
  serviceLimit: 0,
  discountLimit: 0,
  priority: 0,
  features: emptyFeatures(),
});

const numberFormat = new Intl.NumberFormat("fa-IR");
const fieldClass = "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-emerald-700";

export function PlanManager({ plans }: { plans: PlanSummary[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PlanInput>(emptyPlan);
  const vipPlans = useMemo(() => plans.filter(plan => plan.tier === "VIP"), [plans]);
  const activePlans = useMemo(() => vipPlans.filter(plan => plan.isActive !== false), [vipPlans]);

  const edit = (plan: PlanSummary) => {
    setEditingId(plan.id);
    setDraft({
      name: plan.name,
      price: Number(plan.price),
      durationDays: plan.durationDays,
      galleryLimit: plan.galleryLimit,
      productLimit: plan.productLimit,
      serviceLimit: plan.serviceLimit,
      discountLimit: plan.discountLimit,
      priority: plan.priority,
      features: { ...emptyFeatures(), ...plan.features },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setDraft(emptyPlan());
  };

  const setNumber = (key: keyof Omit<PlanInput, "name" | "features">, value: string) => {
    setDraft(current => ({ ...current, [key]: Number(value) }));
  };

  const submit = () => startTransition(async () => {
    const result = await savePlanAction(editingId, draft);
    if (!result.success) { toast.error(result.message); return; }
    toast.success(editingId ? "پلن به‌روزرسانی شد." : "پلن VIP ساخته شد.");
    reset();
    router.refresh();
  });

  const deactivate = (plan: PlanSummary) => startTransition(async () => {
    if (!window.confirm(`پلن «${plan.name}» غیرفعال شود؟ اشتراک‌های فعلی تا پایان اعتبار باقی می‌مانند.`)) return;
    const result = await deactivatePlanAction(plan.id);
    if (!result.success) { toast.error(result.message); return; }
    toast.success("پلن غیرفعال شد.");
    if (editingId === plan.id) reset();
    router.refresh();
  });

  return <div className="space-y-8" dir="rtl">
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="font-bold text-neutral-950">{editingId ? "ویرایش پلن VIP" : "ساخت پلن VIP"}</h2><p className="mt-1 text-sm text-neutral-500">مدت پیش‌فرض ۳۰ روز است؛ قیمت فعلاً فقط برای ثبت و نمایش نگهداری می‌شود.</p></div>
        {editingId && <button type="button" onClick={reset} className="text-sm text-neutral-600 underline">لغو ویرایش</button>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1 text-sm font-medium sm:col-span-2"><span>نام پلن</span><input className={fieldClass} value={draft.name} maxLength={120} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} placeholder="مثلاً VIP طلایی" /></label>
        <label className="space-y-1 text-sm font-medium"><span>قیمت (تومان)</span><input className={fieldClass} type="number" min={0} value={draft.price} onChange={event => setNumber("price", event.target.value)} /></label>
        {([
          ["durationDays", "مدت اعتبار (روز)"],
          ["galleryLimit", "حداکثر عکس گالری"],
          ["productLimit", "حداکثر محصول"],
          ["serviceLimit", "حداکثر خدمت"],
          ["discountLimit", "حداکثر تخفیف محصول (درصد)"],
          ["priority", "اولویت پلن"],
        ] as const).map(([key, label]) => <label key={key} className="space-y-1 text-sm font-medium"><span>{label}</span><input className={fieldClass} type="number" min={key === "durationDays" ? 1 : 0} value={draft[key]} onChange={event => setNumber(key, event.target.value)} /></label>)}
      </div>

      <fieldset className="mt-6"><legend className="mb-3 text-sm font-bold text-neutral-900">امکانات قابل انتخاب</legend><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_LABELS.map(([key, label]) => <label key={key} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2 text-sm"><input type="checkbox" className="size-4 accent-emerald-800" checked={draft.features[key]} onChange={event => setDraft(current => ({ ...current, features: { ...current.features, [key]: event.target.checked } }))} /><span>{label}</span></label>)}
      </div></fieldset>

      <button type="button" disabled={pending} onClick={submit} className="mt-6 h-11 rounded-md bg-emerald-950 px-6 text-sm font-bold text-white disabled:opacity-50">{pending ? "در حال ذخیره…" : editingId ? "ذخیره تغییرات" : "ایجاد پلن ۳۰ روزه"}</button>
    </section>

    <section>
      <div className="mb-4 flex items-end justify-between"><div><h2 className="font-bold text-neutral-950">پلن‌های موجود</h2><p className="mt-1 text-sm text-neutral-500">{numberFormat.format(activePlans.length)} پلن فعال</p></div></div>
      <div className="grid gap-4 md:grid-cols-2">
        {vipPlans.map(plan => <article key={plan.id} className={`rounded-xl border bg-white p-5 ${plan.isActive === false ? "opacity-60" : "border-neutral-200"}`}>
          <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-neutral-950">{plan.name}</h3><p className="mt-1 text-sm text-neutral-500">{numberFormat.format(plan.durationDays)} روز · {numberFormat.format(Number(plan.price))} تومان</p></div><span className="rounded-full bg-emerald-950 px-2.5 py-1 text-xs font-bold text-amber-300">VIP</span></div>
          <p className="mt-4 text-sm text-neutral-700">{numberFormat.format(plan.galleryLimit)} عکس، {numberFormat.format(plan.productLimit)} محصول، {numberFormat.format(plan.serviceLimit)} خدمت</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{FEATURE_LABELS.filter(([key]) => plan.features?.[key]).map(([, label]) => <span key={label} className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-900">{label}</span>)}</div>
          <div className="mt-5 flex gap-2"><button type="button" disabled={pending || plan.isActive === false} onClick={() => edit(plan)} className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:opacity-50">ویرایش</button><button type="button" disabled={pending || plan.isActive === false} onClick={() => deactivate(plan)} className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 disabled:opacity-50">غیرفعال‌سازی</button></div>
        </article>)}
        {vipPlans.length === 0 && <p className="rounded-lg border border-dashed p-8 text-center text-sm text-neutral-500 md:col-span-2">هنوز پلنی ساخته نشده است.</p>}
      </div>
    </section>
  </div>;
}
