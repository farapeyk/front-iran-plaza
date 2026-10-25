"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { revalidatePath } from "next/cache";
import { getActionAccessToken } from '@/lib/auth/action-access-token';

export type UserActionResult = { success: true } | { success: false; message: string };

export interface UpdateAdminUserInput {
  phone: string;
  fullName: string;
  email: string;
  nationalCode: string;
  userType: "CUSTOMER" | "BUSINESS_OWNER" | "ADMIN" | "SUPER_ADMIN";
}

async function mutateAdmin(path: string, method: 'PATCH' | 'DELETE', body?: unknown): Promise<UserActionResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error(`[admin users action] ${path} rejected:`, res.status);
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
  const result = await mutateAdmin(`/api/admin/users/${userId}/suspend`, 'PATCH', { reason });
  if (result.success) {
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
  }
  return result;
}

export async function reinstateUserAction(userId: string): Promise<UserActionResult> {
  const result = await mutateAdmin(`/api/admin/users/${userId}/reinstate`, 'PATCH');
  if (result.success) {
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
  }
  return result;
}

export async function updateUserAction(userId: string, input: UpdateAdminUserInput): Promise<UserActionResult> {
  const email = input.email.trim();
  const nationalCode = input.nationalCode.trim();
  const payload = {
    phone: input.phone.trim(),
    fullName: input.fullName.trim(),
    userType: input.userType,
    ...(email ? { email } : {}),
    ...(nationalCode ? { nationalCode } : {}),
  };
  const validUserTypes = new Set(["CUSTOMER", "BUSINESS_OWNER", "ADMIN", "SUPER_ADMIN"]);
  if (
    !/^[A-Za-z0-9_-]{1,100}$/.test(userId)
    || !/^09\d{9}$/.test(payload.phone)
    || payload.fullName.length < 2
    || payload.fullName.length > 120
    || (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
    || (nationalCode && !/^\d{10}$/.test(nationalCode))
    || !validUserTypes.has(payload.userType)
  ) {
    return { success: false, message: "اطلاعات واردشده معتبر نیست." };
  }

  const result = await mutateAdmin(`/api/admin/users/${userId}`, "PATCH", payload);
  if (result.success) {
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
  }
  return result;
}

export async function deleteUserAction(userId: string, reason: string): Promise<UserActionResult> {
  const normalizedReason = reason.trim();
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(userId) || normalizedReason.length < 5 || normalizedReason.length > 500) {
    return { success: false, message: 'شناسه کاربر یا دلیل حذف معتبر نیست.' };
  }
  const result = await mutateAdmin(`/api/admin/users/${userId}`, 'DELETE', { reason: normalizedReason });
  if (result.success) revalidatePath('/admin/users');
  return result;
}
