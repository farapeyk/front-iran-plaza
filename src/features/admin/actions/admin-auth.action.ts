"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import type { VerifyOtpResponse } from "@/types/auth";

const loginPasswordSchema = z.object({
  phone: z.string().min(1, "شماره موبایل الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export type AdminLoginResult = { success: true } | { success: false; message: string };

// ⚠️ فرض کردم پاسخ POST /api/auth/login-password دقیقاً هم‌شکل verify-otp
// است (accessToken/refreshToken/user). اگه ساختارش فرق داره بگید اصلاح کنم.
export async function adminLoginPasswordAction(input: unknown): Promise<AdminLoginResult> {
  const parsed = loginPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" };
  }

  let data: VerifyOtpResponse;

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/auth/login-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, message: body?.message ?? "شماره موبایل یا رمز عبور نادرست است" };
    }

    data = await res.json();
  } catch (err) {
    console.error("[adminLoginPasswordAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  if (!["ADMIN", "SUPER_ADMIN"].includes(data.user.userType)) {
    return { success: false, message: "این حساب کاربری به پنل ادمین دسترسی ندارد" };
  }

  await setAuthCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearAuthCookies();
  redirect("/admin/login");
}