"use server";

import { redirect } from "next/navigation";
import { verifyOtpSchema } from "@/features/auth/schemas/otp.schema";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { VerifyOtpResponse } from "@/types/auth";

export type VerifyOtpResult =
  | { success: true }
  | { success: false; message: string };

/**
 * قدم دوم لاگین/ثبت‌نام (یکپارچه): کد تایید را با بک‌اند چک می‌کند. در صورت
 * موفقیت، بک‌اند accessToken/refreshToken/user/isNewUser را در بدنه‌ی JSON
 * برمی‌گرداند (نه کوکی) — این Server Action خودش مسئول ذخیره‌ی توکن‌ها در
 * کوکی‌های httpOnly است.
 *
 * تصمیم محصول: کاربر تازه (isNewUser: true، fullName هنوز null) به
 * /complete-profile می‌رود؛ کاربر قدیمی مستقیم به /dashboard.
 */
export async function verifyOtpAction(input: unknown): Promise<VerifyOtpResult> {
  const parsed = verifyOtpSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" };
  }

  let data: VerifyOtpResponse;

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, message: body?.message ?? "کد تایید نادرست است" };
    }

    data = await res.json();
  } catch {
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  await setAuthCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });

  // تصمیم محصول: کاربر تازه‌ثبت‌نام‌شده یا کاربری که هنوز fullName ندارد
  // (پروفایل ناقص) اول باید حساب کاربری‌اش را تکمیل کند؛ بقیه مستقیم به داشبورد.
  // redirect باید خارج از try/catch باشد چون خودش با throw کار می‌کند
  if (data.isNewUser || !data.user.fullName) {
    redirect("/complete-profile");
  }

  redirect("/dashboard");
}
