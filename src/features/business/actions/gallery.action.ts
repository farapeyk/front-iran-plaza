"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { revalidatePath } from "next/cache";
import { getActionAccessToken } from '@/lib/auth/action-access-token';
import { extractErrorMessage } from "@/lib/api/error-message";
import type { GalleryImageData } from '@/features/business/types/business-profile';

export type GalleryActionResult = { success: true } | { success: false; message: string };
export type AddGalleryResult = { success: true; image: GalleryImageData } | { success: false; message: string };

export async function addGalleryImageAction(
  businessId: string,
  fileId: string,
  title?: string,
): Promise<AddGalleryResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/gallery`, {
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
      console.error("[addGalleryImageAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `افزودن تصویر با خطا مواجه شد (کد ${res.status})`) };
    }
    const saved: GalleryImageData = await res.json();
    if (typeof saved?.id !== 'string' || !saved.id || saved.fileId !== fileId || saved.businessId !== businessId) {
      return { success: false, message: 'پاسخ ثبت تصویر معتبر نیست؛ گالری را دوباره بارگذاری کنید.' };
    }
    revalidatePath('/dashboard/business/profile/gallery');
    return { success: true, image: saved };
  } catch (err) {
    console.error("[addGalleryImageAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

}

export async function removeGalleryImageAction(businessId: string, imageId: string): Promise<GalleryActionResult> {
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/gallery/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[removeGalleryImageAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `حذف تصویر با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[removeGalleryImageAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  revalidatePath("/dashboard/business/profile/gallery");
  return { success: true };
}
