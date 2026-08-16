"use server";

import { revalidatePath } from "next/cache";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { extractErrorMessage } from "@/lib/api/error-message";

export type GalleryActionResult = { success: true } | { success: false; message: string };

export async function addGalleryImageAction(
  businessId: string,
  fileId: string,
  title?: string,
): Promise<GalleryActionResult> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fileId, title }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[addGalleryImageAction] backend rejected:", res.status, body);
      return { success: false, message: extractErrorMessage(body, `افزودن تصویر با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[addGalleryImageAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath("/dashboard/business/profile/gallery");
  return { success: true };
}

export async function removeGalleryImageAction(businessId: string, imageId: string): Promise<GalleryActionResult> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/gallery/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[removeGalleryImageAction] backend rejected:", res.status, body);
      return { success: false, message: extractErrorMessage(body, `حذف تصویر با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[removeGalleryImageAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath("/dashboard/business/profile/gallery");
  return { success: true };
}