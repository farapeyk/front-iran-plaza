"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { revalidatePath } from "next/cache";
import { getActionAccessToken } from '@/lib/auth/action-access-token';
import { extractErrorMessage } from "@/lib/api/error-message";

export type ReviewActionResult = { success: true } | { success: false; message: string };

export async function submitReviewAction(
  businessId: string,
  input: { rating: number; comment?: string },
): Promise<ReviewActionResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "برای ثبت نظر باید وارد حساب کاربری شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[submitReviewAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `ثبت نظر با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[submitReviewAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath("/businesses");
  return { success: true };
}

export async function submitReviewReplyAction(reviewId: string, comment: string): Promise<ReviewActionResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "برای پاسخ دادن باید وارد حساب کاربری شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/reviews/${reviewId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ comment }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[submitReviewReplyAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `ثبت پاسخ با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[submitReviewReplyAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath("/businesses");
  return { success: true };
}