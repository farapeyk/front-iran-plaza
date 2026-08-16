"use server";

import { revalidatePath } from "next/cache";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export type UserActionResult = { success: true } | { success: false; message: string };

async function patchAdmin(path: string, body?: unknown): Promise<UserActionResult> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error(`[admin users action] ${path} rejected:`, res.status, errBody);
      if (res.status === 403) {
        return { success: false, message: errBody?.message ?? "شما مجوز لازم برای این عملیات را ندارید" };
      }
      return {
        success: false,
        message: Array.isArray(errBody?.message) ? errBody.message[0] : (errBody?.message ?? `عملیات با خطا مواجه شد (کد ${res.status})`),
      };
    }
  } catch (err) {
    console.error(`[admin users action] ${path} network error:`, err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  return { success: true };
}

export async function suspendUserAction(userId: string, reason: string): Promise<UserActionResult> {
  const result = await patchAdmin(`/api/admin/users/${userId}/suspend`, { reason });
  if (result.success) {
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
  }
  return result;
}

export async function reinstateUserAction(userId: string): Promise<UserActionResult> {
  const result = await patchAdmin(`/api/admin/users/${userId}/reinstate`);
  if (result.success) {
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
  }
  return result;
}