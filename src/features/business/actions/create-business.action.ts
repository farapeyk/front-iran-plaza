"use server";

import { businessInfoSchema } from "@/features/business/schemas/business-info.schema";
import { extractErrorMessage } from "@/lib/api/error-message";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export type CreateBusinessResult =
  | { success: true; businessId: string }
  | { success: false; message: string };

export async function createBusinessAction(input: unknown): Promise<CreateBusinessResult> {
  const parsed = businessInfoSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" };
  }

  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  const { name, phone, bio, province, city } = parsed.data;

  const payload = {
    name,
    phone,
    description: bio || undefined,
    address: `${province}، ${city}`,
    businessType: "SOLE_PROPRIETOR",
  };

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses`, {
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
      console.error("[createBusinessAction] backend rejected:", res.status, body);
      return {
        success: false,
        message: extractErrorMessage(body, `ثبت کسب‌وکار با خطا مواجه شد (کد ${res.status})`),
      };
    }

    const business = await res.json();
    return { success: true, businessId: business.id };
  } catch (err) {
    console.error("[createBusinessAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }
}