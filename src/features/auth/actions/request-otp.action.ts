"use server";

import { requestOtpSchema } from "@/features/auth/schemas/otp.schema";

export type RequestOtpResult =
  | { success: true }
  | { success: false; message: string };

/**
 * قدم اول لاگین: شماره موبایل را می‌گیرد و به بک‌اند اطلاع می‌دهد کد ارسال کند.
 * چون این endpoint نیازی به Authorization ندارد، مستقیم به بک‌اند زده می‌شود
 * (نه از طریق پروکسی /api/backend که مخصوص درخواست‌های نیازمند توکن است).
 */
export async function requestOtpAction(input: unknown): Promise<RequestOtpResult> {
  const parsed = requestOtpSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: parsed.data.phone }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { success: false, message: body?.message ?? "ارسال کد با خطا مواجه شد" };
    }

    return { success: true };
  } catch {
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }
}
