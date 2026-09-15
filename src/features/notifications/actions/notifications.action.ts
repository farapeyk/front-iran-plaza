"use server";

import { revalidatePath } from "next/cache";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { extractErrorMessage } from "@/lib/api/error-message";

export type NotificationActionResult = { success: true } | { success: false; message: string };

export async function markNotificationReadAction(notificationId: string): Promise<NotificationActionResult> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[markNotificationReadAction] backend rejected:", res.status, body);
      return { success: false, message: extractErrorMessage(body, `عملیات با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[markNotificationReadAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath("/dashboard/notifications");
  return { success: true };
}