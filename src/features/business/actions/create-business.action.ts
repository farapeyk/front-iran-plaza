"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { businessInfoSchema } from "@/features/business/schemas/business-info.schema";
import { extractErrorMessage } from "@/lib/api/error-message";
import { getActionAccessToken } from '@/lib/auth/action-access-token';

export type CreateBusinessResult =
  | { success: true; businessId: string }
  | { success: false; message: string };

export async function createBusinessAction(input: unknown): Promise<CreateBusinessResult> {
  const parsed = businessInfoSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" };
  }

  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  const { name, phone, bio, province, city, categoryId } = parsed.data;

  const payload = {
    name,
    phone,
    city,
    categoryIds: [categoryId],
    description: bio || undefined,
    address: `${province}، ${city}`,
    businessType: "SOLE_PROPRIETOR",
  };

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[createBusinessAction] backend rejected:", res.status);
      return {
        success: false,
        message: extractErrorMessage(body, `ثبت کسب‌وکار با خطا مواجه شد (کد ${res.status})`),
      };
    }

    const business = await res.json();
    if (typeof business?.id !== 'string' || !business.id) return { success: false, message: 'پاسخ ثبت کسب‌وکار معتبر نیست؛ پیش از تلاش دوباره داشبورد را بررسی کنید.' };
    return { success: true, businessId: business.id };
  } catch (err) {
    console.error("[createBusinessAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }
}
