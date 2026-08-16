"use server";

import { redirect } from "next/navigation";
import { completeProfileSchema } from "@/features/profile/schemas/complete-profile.schema";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { jalaliToGregorian } from "@/lib/utils/jalali";
import { IRAN_PROVINCES } from "@/lib/constants/iran-locations";
import { extractErrorMessage } from "@/lib/api/error-message";

export type CompleteProfileResult =
  | { success: true }
  | { success: false; message: string };

/**
 * ⚠️ فرضیات این فایل که با Swagger واقعی PATCH /api/users/me تایید شده‌اند:
 * fullName, email, gender (MALE/FEMALE/OTHER), nationalCode,
 * birthDate (ISO کامل با ساعت)، province، city — همه بر اساس نمونه‌ی
 * واقعی Swagger که فرستادید.
 */
export async function completeProfileAction(input: unknown): Promise<CompleteProfileResult> {
  const parsed = completeProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" };
  }

  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  const { firstName, lastName, nationalCode, gender, birthDay, birthMonth, birthYear, email, provinceId, cityId } =
    parsed.data;

  const province = IRAN_PROVINCES.find((p) => p.id === provinceId);
  const city = province?.cities.find((c) => c.id === cityId);

  const isoDate = jalaliToGregorian(birthYear, birthMonth, birthDay);

  const payload = {
    fullName: `${firstName} ${lastName}`.trim(),
    nationalCode,
    gender,
    birthDate: `${isoDate}T00:00:00.000Z`,
    email: email || undefined,
    province: province?.name,
    city: city?.name,
  };

  // لاگ موقت برای دیباگ — بعد از حل مشکل می‌توانید حذفش کنید
  console.log("[completeProfileAction] payload sent to backend:", payload);

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[completeProfileAction] backend rejected:", res.status, body);
      return {
        success: false,
        message: extractErrorMessage(body, `ذخیره‌ی اطلاعات با خطا مواجه شد (کد ${res.status})`),
      };
    }
  } catch (err) {
    console.error("[completeProfileAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  redirect("/dashboard");
}