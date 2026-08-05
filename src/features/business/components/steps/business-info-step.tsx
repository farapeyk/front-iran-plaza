"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fieldClass } from "@/features/business/components/jalali-date-select";

import { businessInfoSchema, type BusinessInfoInput } from "@/features/business/schemas/business-info.schema";
import { createBusinessAction } from "@/features/business/actions/create-business.action";

export interface Category {
  id: string;
  name: string;
}

interface BusinessInfoStepProps {
  categories: Category[];
  onNext: (businessId: string) => void;
}

export function BusinessInfoStep({ categories, onNext }: BusinessInfoStepProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BusinessInfoInput>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: { name: "", phone: "", bio: "", categoryId: "", province: "", city: "" },
  });

  const bioValue = form.watch("bio") ?? "";

  function onSubmit(values: BusinessInfoInput) {
    startTransition(async () => {
      const result = await createBusinessAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      onNext(result.businessId);
    });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-neutral-900 mb-1">ثبت رایگان کسب و کار</h2>
      <p className="text-sm text-neutral-500 mb-6">
        چند مورد از اطلاعات اصلی کسب و کار خود را وارد کنید تا پروفایل کسب‌وکار شما ایجاد شود.
      </p>

      <p className="text-sm font-bold text-neutral-800 mb-4">اطلاعات کسب و کار</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" dir="rtl" noValidate>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">نام کسب و کار</label>
              <Input {...field} id={field.name} disabled={isPending} aria-invalid={fieldState.invalid} />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">شماره تماس کسب‌وکار</label>
              <Input {...field} id={field.name} inputMode="tel" dir="ltr" className="text-left" disabled={isPending} aria-invalid={fieldState.invalid} />
              <p className="text-xs text-neutral-400">
                این شماره برای عموم قابل نمایش است — نیازی نیست با شماره حساب کاربری‌تان یکی باشد.
              </p>
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="bio"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">بیوگرافی</label>
              <textarea
                {...field}
                id={field.name}
                rows={3}
                maxLength={100}
                placeholder="یک بیوگرافی کوتاه و مفید از کسب و کار خود بنویسید"
                disabled={isPending}
                className={fieldClass(fieldState.invalid)}
              />
              <p className="text-xs text-neutral-400">حداکثر ۱۰۰ کاراکتر ({bioValue.length}/۱۰۰)</p>
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">زمینه فعالیت</label>
              <select {...field} className={fieldClass(fieldState.invalid)} disabled={isPending}>
                <option value="">انتخاب کنید</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-amber-600">دسته‌بندی‌ها هنوز از سرور در دسترس نیست.</p>
              )}
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="province"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">استان</label>
              <Input {...field} id={field.name} placeholder="نام استان خود را وارد کنید" disabled={isPending} aria-invalid={fieldState.invalid} />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="city"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">شهر</label>
              <Input {...field} id={field.name} placeholder="نام شهر خود را وارد کنید" disabled={isPending} aria-invalid={fieldState.invalid} />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "در حال ثبت..." : "تایید اطلاعات و احراز هویت"}
        </Button>
      </form>
    </div>
  );
}