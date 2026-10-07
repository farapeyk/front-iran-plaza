"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { revalidatePath } from "next/cache";
import { getActionAccessToken } from '@/lib/auth/action-access-token';
import { extractErrorMessage } from "@/lib/api/error-message";
import type { WorkingHoursEntry } from "@/features/business/types/business-profile";

export type WorkingHoursResult = { success: true } | { success: false; message: string };

export async function updateWorkingHoursAction(
  businessId: string,
  entries: WorkingHoursEntry[],
): Promise<WorkingHoursResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/working-hours`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ hours: entries }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[updateWorkingHoursAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `ذخیره‌ی ساعات کاری با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[updateWorkingHoursAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath("/dashboard/business/profile/hours");
  return { success: true };
}