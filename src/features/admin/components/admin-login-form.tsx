"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminLoginPasswordAction } from "@/features/admin/actions/admin-auth.action";

interface AdminLoginInput {
  phone: string;
  password: string;
}

export function AdminLoginForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<AdminLoginInput>({ defaultValues: { phone: "", password: "" } });

  function onSubmit(values: AdminLoginInput) {
    startTransition(async () => {
      const result = await adminLoginPasswordAction(values);
      if (!result.success) toast.error(result.message);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" dir="rtl" noValidate>
      <Controller
        control={form.control}
        name="phone"
        rules={{ required: "شماره موبایل الزامی است" }}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">شماره موبایل</label>
            <Input {...field} type="tel" inputMode="numeric" dir="ltr" className="text-left tracking-wider" disabled={isPending} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="password"
        rules={{ required: "رمز عبور الزامی است" }}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">رمز عبور</label>
            <Input {...field} type="password" dir="ltr" className="text-left" disabled={isPending} aria-invalid={fieldState.invalid} />
            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
          </div>
        )}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ورود..." : "ورود به پنل ادمین"}
      </Button>
    </form>
  );
}