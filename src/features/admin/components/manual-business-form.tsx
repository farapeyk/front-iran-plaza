"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createManualBusinessAction } from "@/features/admin/actions/manual-business.action";
import type { PlanSummary } from "@/features/admin/types/plan";
import { categoryOptions, type BusinessCategoryOption } from '@/features/business/lib/category-options';

function fieldClass() {
  return "w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
}

export function ManualBusinessForm({ plans, categories }: { plans: PlanSummary[]; categories: BusinessCategoryOption[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [registrationType, setRegistrationType] = useState<"IN_PERSON" | "TELEPHONE">("IN_PERSON");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerNationalCode, setOwnerNationalCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState('شیراز');
  const [categoryId, setCategoryId] = useState('');
  const [planId, setPlanId] = useState("");
  const [businessType, setBusinessType] = useState<'SOLE_PROPRIETOR' | 'COMPANY' | 'BRANCH'>('SOLE_PROPRIETOR');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ownerPhone.trim() || !name.trim() || !phone.trim() || !city.trim() || !categoryId) {
      toast.error("شماره مالک، نام، تماس، شهر و دسته‌بندی کسب‌وکار الزامی است");
      return;
    }
    startTransition(async () => {
      const result = await createManualBusinessAction(
        {
          ownerPhone,
          ownerFullName: ownerFullName || undefined,
          ownerNationalCode: ownerNationalCode || undefined,
          name,
          phone,
          city: city.trim(),
          categoryIds: [categoryId],
          description: description || undefined,
          address: address || undefined,
          businessType,
          registrationType,
        },
        planId || undefined,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (result.planWarning) {
        toast.error(result.planWarning);
      } else {
        toast.success("کسب‌وکار با موفقیت ثبت شد");
      }
      router.push(`/admin/businesses/${result.businessId}/edit`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium">نوع ثبت</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-sm">
            <input type="radio" checked={registrationType === "IN_PERSON"} onChange={() => setRegistrationType("IN_PERSON")} />
            حضوری
          </label>
          <label className="flex items-center gap-1.5 text-sm">
            <input type="radio" checked={registrationType === "TELEPHONE"} onChange={() => setRegistrationType("TELEPHONE")} />
            تلفنی
          </label>
        </div>
      </div>

      <p className="text-sm font-bold text-neutral-800 pt-2">اطلاعات مراجعه‌کننده</p>

      <div className="space-y-2">
        <label className="text-sm font-medium">شماره موبایل</label>
        <Input value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} dir="ltr" className="text-left" disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">نام و نام خانوادگی <span className="text-muted-foreground">(اختیاری)</span></label>
        <Input value={ownerFullName} onChange={(e) => setOwnerFullName(e.target.value)} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">کد ملی <span className="text-muted-foreground">(اختیاری)</span></label>
        <Input value={ownerNationalCode} onChange={(e) => setOwnerNationalCode(e.target.value)} dir="ltr" className="text-left" disabled={isPending} />
      </div>

      <p className="text-sm font-bold text-neutral-800 pt-2">اطلاعات کسب‌وکار</p>

      <div className="space-y-2">
        <label htmlFor="manual-business-type" className="text-sm font-medium">نوع کسب‌وکار</label>
        <select id="manual-business-type" value={businessType} onChange={event => setBusinessType(event.target.value as typeof businessType)} disabled={isPending} className={fieldClass()}>
          <option value="SOLE_PROPRIETOR">شخص حقیقی</option>
          <option value="COMPANY">شرکت</option>
          <option value="BRANCH">شعبه</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">نام کسب‌وکار</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">شماره تماس کسب‌وکار</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="text-left" disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label htmlFor="manual-city" className="text-sm font-medium">شهر</label>
        <Input id="manual-city" value={city} onChange={e => setCity(e.target.value)} required maxLength={150} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label htmlFor="manual-category" className="text-sm font-medium">دسته‌بندی کسب‌وکار</label>
        <select id="manual-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required disabled={isPending} className={fieldClass()}>
          <option value="">انتخاب دسته‌بندی</option>
          {categoryOptions(categories).map(category => <option key={category.id} value={category.id}>{category.label}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">توضیحات <span className="text-muted-foreground">(اختیاری)</span></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={100} rows={2} disabled={isPending} className={fieldClass()} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">آدرس <span className="text-muted-foreground">(اختیاری)</span></label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} disabled={isPending} className={fieldClass()} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">پلن</label>
        <select value={planId} onChange={(e) => setPlanId(e.target.value)} disabled={isPending} className={fieldClass()}>
          <option value="">رایگان (پیش‌فرض، بدون اعطای پلن)</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {Number(p.price).toLocaleString("fa-IR")} تومان / {p.durationDays} روز
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ثبت..." : "ثبت و تکمیل پروفایل کسب‌وکار"}
      </Button>
    </form>
  );
}
