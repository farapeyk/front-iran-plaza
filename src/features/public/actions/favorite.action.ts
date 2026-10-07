"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { revalidatePath } from "next/cache";
import { getActionAccessToken } from '@/lib/auth/action-access-token';
import { extractErrorMessage } from "@/lib/api/error-message";

export type FavoriteResult = { success: true; favorited: boolean } | { success: false; message: string };

export async function toggleFavoriteAction(businessId: string): Promise<FavoriteResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "برای افزودن به علاقه‌مندی‌ها باید وارد حساب کاربری شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/favorite`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[toggleFavoriteAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `عملیات با خطا مواجه شد (کد ${res.status})`) };
    }

    const data = await res.json();
    revalidatePath("/dashboard/favorites");
    return { success: true, favorited: data.favorited };
  } catch (err) {
    console.error("[toggleFavoriteAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }
}