"use client";

import { useMemo, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  completeProfileSchema,
  type CompleteProfileInput,
} from "@/features/profile/schemas/complete-profile.schema";
import { completeProfileAction } from "@/features/profile/actions/complete-profile.action";
import { JALALI_MONTHS, JALALI_YEAR_RANGE, jalaliMonthLength } from "@/lib/utils/jalali";
import { IRAN_PROVINCES } from "@/lib/constants/iran-locations";

interface CompleteProfileFormProps {
  /** شماره موبایل کاربر — قفل و فقط نمایشی (از GET /api/users/me گرفته می‌شود) */
  phone: string;
}

const GENDER_OPTIONS = [
  { value: "MALE", label: "آقا" },
  { value: "FEMALE", label: "خانم" },
] as const;

// سال‌ها از جدید به قدیم (برای تجربه‌ی کاربری بهتر در select)
const YEAR_OPTIONS = Array.from(
  { length: JALALI_YEAR_RANGE.max - JALALI_YEAR_RANGE.min + 1 },
  (_, i) => JALALI_YEAR_RANGE.max - i,
);

function fieldClass(hasError?: boolean) {
  return [
    "w-full h-10 rounded-md border bg-transparent px-3 text-sm",
    "focus:outline-none focus:ring-2 focus:ring-ring",
    hasError ? "border-destructive" : "border-input",
  ].join(" ");
}

export function CompleteProfileForm({ phone }: CompleteProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalCode: "",
      gender: undefined,
      birthDay: undefined,
      birthMonth: undefined,
      birthYear: undefined,
      email: "",
      provinceId: "",
      cityId: "",
    },
  });

  const selectedProvinceId = useWatch({ control: form.control, name: "provinceId" });
  const selectedYear = useWatch({ control: form.control, name: "birthYear" });
  const selectedMonth = useWatch({ control: form.control, name: "birthMonth" });

  const cities = useMemo(
    () => IRAN_PROVINCES.find((p) => p.id === selectedProvinceId)?.cities ?? [],
    [selectedProvinceId],
  );

  const dayCount = useMemo(() => {
    if (!selectedMonth) return 31;
    return jalaliMonthLength(selectedYear || JALALI_YEAR_RANGE.max, selectedMonth);
  }, [selectedYear, selectedMonth]);

  function onSubmit(values: CompleteProfileInput) {
    startTransition(async () => {
      const result = await completeProfileAction(values);
      if (!result.success) {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" dir="rtl" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                نام
              </label>
              <Input {...field} id={field.name} disabled={isPending} aria-invalid={fieldState.invalid} />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                نام خانوادگی
              </label>
              <Input {...field} id={field.name} disabled={isPending} aria-invalid={fieldState.invalid} />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="nationalCode"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              کد ملی
            </label>
            <Input
              {...field}
              id={field.name}
              inputMode="numeric"
              maxLength={10}
              dir="ltr"
              className="text-left"
              disabled={isPending}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )}
      />

      {/* تاریخ تولد — تقویم شمسی */}
      <div className="space-y-2">
        <span className="text-sm font-medium">تاریخ تولد</span>
        <div className="grid grid-cols-3 gap-2">
          <Controller
            control={form.control}
            name="birthDay"
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ""}
                className={fieldClass(!!form.formState.errors.birthDay)}
                disabled={isPending}
              >
                <option value="">روز</option>
                {Array.from({ length: dayCount }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}
          />

          <Controller
            control={form.control}
            name="birthMonth"
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ""}
                className={fieldClass(!!form.formState.errors.birthMonth)}
                disabled={isPending}
              >
                <option value="">ماه</option>
                {JALALI_MONTHS.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          />

          <Controller
            control={form.control}
            name="birthYear"
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ""}
                className={fieldClass(!!form.formState.errors.birthYear)}
                disabled={isPending}
              >
                <option value="">سال</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      <Controller
        control={form.control}
        name="gender"
        render={({ field }) => (
          <div className="space-y-2">
            <span className="text-sm font-medium">جنسیت</span>
            <div className="flex gap-4">
              {GENDER_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={field.value === opt.value}
                    onChange={() => field.onChange(opt.value)}
                    disabled={isPending}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {form.formState.errors.gender && (
              <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
            )}
          </div>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">شماره موبایل</label>
        <Input value={phone} disabled dir="ltr" className="text-left" />
      </div>

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              ایمیل <span className="text-muted-foreground">(اختیاری)</span>
            </label>
            <Input
              {...field}
              id={field.name}
              type="email"
              dir="ltr"
              className="text-left"
              disabled={isPending}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="provinceId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">استان</label>
              <select
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.setValue("cityId", ""); // با تغییر استان، شهر ریست می‌شود
                }}
                className={fieldClass(fieldState.invalid)}
                disabled={isPending}
              >
                <option value="">انتخاب استان</option>
                {IRAN_PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="cityId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">شهر</label>
              <select
                {...field}
                className={fieldClass(fieldState.invalid)}
                disabled={isPending || !selectedProvinceId}
              >
                <option value="">انتخاب شهر</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}
