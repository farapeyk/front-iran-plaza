"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  verifyOtpSchema,
  type VerifyOtpInput,
} from "@/features/auth/schemas/otp.schema";
import { verifyOtpAction } from "@/features/auth/actions/verify-otp.action";

interface OtpVerifyFormProps {
  phone: string;
  /** برای بازگشت به مرحله قبل (ویرایش شماره موبایل) */
  onBack: () => void;
}

export function OtpVerifyForm({
  phone,
  onBack,
}: OtpVerifyFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      phone,
      code: "",
    },
  });

  function onSubmit(values: VerifyOtpInput) {
    startTransition(async () => {
      // در صورت موفقیت، verifyOtpAction خودش Redirect انجام می‌دهد.
      const result = await verifyOtpAction(values);

      if (!result.success) {
        toast.error(result.message);
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      dir="rtl"
      noValidate
    >
      <p className="text-sm text-muted-foreground">
        کد تایید ۵ رقمی برای شماره{" "}
        <span dir="ltr" className="font-semibold">
          {phone}
        </span>{" "}
        ارسال شد.
      </p>

      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="text-sm font-medium"
            >
              کد تایید
            </label>

            <Input
              {...field}
              id={field.name}
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="-----"
              dir="ltr"
              disabled={isPending}
              aria-invalid={fieldState.invalid}
              className="text-center text-lg tracking-[0.5em]"
            />

            {fieldState.error && (
              <p
                role="alert"
                className="text-sm text-destructive"
              >
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "در حال بررسی..." : "ورود"}
      </Button>

      <button
        type="button"
        onClick={onBack}
        disabled={isPending}
        className="w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ویرایش شماره موبایل
      </button>
    </form>
  );
}
