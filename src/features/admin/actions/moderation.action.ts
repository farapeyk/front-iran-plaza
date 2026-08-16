"use server";

import { revalidatePath } from "next/cache";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export type ModerationResult = { success: true } | { success: false; message: string };

async function postAdmin(path: string, body?: unknown): Promise<ModerationResult> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error(`[admin action] ${path} rejected:`, res.status, errBody);
      if (res.status === 403) {
        return { success: false, message: "شما مجوز لازم برای این عملیات را ندارید" };
      }
      return { success: false, message: errBody?.message ?? `عملیات با خطا مواجه شد (کد ${res.status})` };
    }
  } catch (err) {
    console.error(`[admin action] ${path} network error:`, err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  return { success: true };
}

export async function approveBusinessAction(businessId: string): Promise<ModerationResult> {
  const result = await postAdmin(`/api/businesses/${businessId}/approve`);
  if (result.success) revalidatePath("/admin/businesses/pending");
  return result;
}

export async function rejectBusinessAction(businessId: string, reason: string): Promise<ModerationResult> {
  const result = await postAdmin(`/api/businesses/${businessId}/reject`, { reason });
  if (result.success) revalidatePath("/admin/businesses/pending");
  return result;
}

export async function suspendBusinessAction(businessId: string, reason: string): Promise<ModerationResult> {
  return postAdmin(`/api/businesses/${businessId}/suspend`, { reason });
}

export async function approveDocumentAction(documentId: string, businessId: string): Promise<ModerationResult> {
  const result = await postAdmin(`/api/admin/documents/${documentId}/approve`);
  if (result.success) revalidatePath(`/admin/businesses/${businessId}`);
  return result;
}

export async function rejectDocumentAction(
  documentId: string,
  businessId: string,
  reason: string,
): Promise<ModerationResult> {
  const result = await postAdmin(`/api/admin/documents/${documentId}/reject`, { reason });
  if (result.success) revalidatePath(`/admin/businesses/${businessId}`);
  return result;
}
