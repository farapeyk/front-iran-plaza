"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { revalidatePath } from "next/cache";
import { getActionAccessToken } from '@/lib/auth/action-access-token';
import { extractErrorMessage } from "@/lib/api/error-message";

export type BusinessProfileResult = { success: true } | { success: false; message: string };

export async function updateBusinessProfileAction(
  businessId: string,
  payload: Record<string, unknown>,
): Promise<BusinessProfileResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}`, {
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
      console.error("[updateBusinessProfileAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `ذخیره‌ی اطلاعات با خطا مواجه شد (کد ${res.status})`) };
    }
    if (payload.categoryIds) {
      const saved = await res.json();
      const expected = payload.categoryIds as string[];
      const actual = Array.isArray(saved?.categories) ? saved.categories.map((entry: { categoryId?: string }) => entry.categoryId) : [];
      if (expected.some(id => !actual.includes(id))) return { success: false, message: 'بک‌اند تغییر دسته‌بندی را تأیید نکرد. سایر اطلاعات ممکن است ذخیره شده باشد؛ دوباره کسب‌وکار جدید نسازید.' };
    }
  } catch (err) {
    console.error("[updateBusinessProfileAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath(`/dashboard/business/profile`);
  return { success: true };
}
