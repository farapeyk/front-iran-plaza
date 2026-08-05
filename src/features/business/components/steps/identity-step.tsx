"use client";

import { Lock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JalaliDateSelect } from "@/features/business/components/jalali-date-select";
import { identitySchema, type IdentityInput } from "@/features/business/schemas/identity.schema";
import { gregorianToJalali } from "@/lib/utils/jalali";
import type { CurrentUser } from "@/types/auth";

interface IdentityStepProps {
  user: CurrentUser;
  onSubmit: (values: IdentityInput) => void;
  onBack: () => void;
}

export function IdentityStep({ user, onSubmit, onBack }: IdentityStepProps) {
  const [firstName = "", lastName = ""] = (user.fullName ?? "").split(" ", 2);
  const knownBirth = user.birthDate ? gregorianToJalali(user.birthDate) : null;

  const form = useForm<IdentityInput>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      companyName: "",
      licenseNumber: "",
      unionCode: "",
      firstName,
      lastName,
      fatherName: user.fatherName ?? "",
      nationalCode: user.nationalCode ?? "",
      birthDay: knownBirth?.jd,
      birthMonth: knownBirth?.jm,
      birthYear: knownBirth?.jy,
      email: user.email ?? "",
    },
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-neutral-900 mb-1">احراز هویت با کارت ملی و مجوز کسب و کار</h2>
      <p className="text-sm text-neutral-500 mb-6">برای تایید کسب‌وکار، هم عکس کارت ملی و هم عکس پروانه کسب لازم است.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" dir="rtl" noValidate>
        <p className="text-sm font-bold text-neutral-800 pt-2">اطلاعات شرکت / پروانه کسب</p>

        <Controller control={form.control} name="companyName" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">نام شرکت</label>
            <Input {...field} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <Controller control={form.control} name="licenseNumber" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">شماره پروانه کسب</label>
            <Input {...field} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <Controller control={form.control} name="unionCode" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">کد آپسیک</label>
            <Input {...field} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <div className="space-y-2">
          <label className="text-sm font-medium">تاریخ صدور</label>
          <JalaliDateSelect
            day={form.watch("issueDay")}
            month={form.watch("issueMonth")}
            year={form.watch("issueYear")}
            onDayChange={(v) => form.setValue("issueDay", v)}
            onMonthChange={(v) => form.setValue("issueMonth", v)}
            onYearChange={(v) => form.setValue("issueYear", v)}
          />
        </div>

        <p className="text-sm font-bold text-neutral-800 pt-2">اطلاعات هویتی (کارت ملی)</p>

        <Controller control={form.control} name="firstName" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">نام</label>
            <Input {...field} disabled={!!firstName} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <Controller control={form.control} name="lastName" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">نام خانوادگی</label>
            <Input {...field} disabled={!!lastName} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <Controller control={form.control} name="fatherName" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">نام پدر</label>
            <Input {...field} disabled={!!user.fatherName} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <Controller control={form.control} name="nationalCode" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">کد ملی</label>
            <Input {...field} dir="ltr" className="text-left" disabled={!!user.nationalCode} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <div className="space-y-2">
          <label className="text-sm font-medium">تاریخ تولد</label>
          <JalaliDateSelect
            day={form.watch("birthDay")}
            month={form.watch("birthMonth")}
            year={form.watch("birthYear")}
            onDayChange={(v) => form.setValue("birthDay", v)}
            onMonthChange={(v) => form.setValue("birthMonth", v)}
            onYearChange={(v) => form.setValue("birthYear", v)}
            disabled={!!knownBirth}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">شماره موبایل حساب کاربری</label>
          <div className="relative">
            <Input value={user.phone} disabled dir="ltr" className="text-left pl-9" />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          </div>
        </div>

        <Controller control={form.control} name="email" render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">ایمیل <span className="text-muted-foreground">(اختیاری)</span></label>
            <Input {...field} dir="ltr" className="text-left" disabled={!!user.email} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />

        <div className="flex gap-2">
          <button type="button" onClick={onBack} className="text-sm text-muted-foreground px-4">بازگشت</button>
          <Button type="submit" className="flex-1">تایید و بارگذاری تصویر مدارک</Button>
        </div>
      </form>
    </div>
  );
}