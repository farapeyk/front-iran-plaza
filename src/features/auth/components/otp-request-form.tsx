"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { requestOtpSchema, type RequestOtpInput } from "@/features/auth/schemas/otp.schema";
import { requestOtpAction } from "@/features/auth/actions/request-otp.action";

interface OtpRequestFormProps {
  /** بعد از ارسال موفق کد، شماره را به والد (صفحه‌ی لاگین) می‌دهد تا برود قدم دوم */
  onRequested: (phone: string) => void;
}

export function OtpRequestForm({ onRequested }: OtpRequestFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RequestOtpInput>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { phone: "" },
  });

  function onSubmit(values: RequestOtpInput) {
    startTransition(async () => {
      const result = await requestOtpAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("کد تایید برای شما پیامک شد");
      onRequested(values.phone);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" dir="rtl" noValidate>
      <Controller
        control={form.control}
        name="phone"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              شماره موبایل
            </label>

            <Input
              {...field}
              id={field.name}
              type="tel"
              inputMode="numeric"
              placeholder="09123456789"
              autoComplete="tel"
              dir="ltr"
              disabled={isPending}
              aria-invalid={fieldState.invalid}
              className="text-left tracking-wider"
            />

            {fieldState.error && (
              <p role="alert" className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ارسال..." : "دریافت کد تایید"}
      </Button>
    </form>
  );
}
