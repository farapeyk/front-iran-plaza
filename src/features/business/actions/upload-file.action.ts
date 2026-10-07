"use server";

import { getActionAccessToken } from "@/lib/auth/action-access-token";
import { validateUpload } from "@/lib/validate-upload";
import { extractErrorMessage } from "@/lib/api/error-message";

export type UploadFileResult = { success: true; fileId: string } | { success: false; message: string };

// Matches FileInterceptor('file') and the backend's 20 MB limit.
export async function uploadFileAction(formData: FormData): Promise<UploadFileResult> {
  if (!(formData instanceof FormData)) return { success: false, message: "فایل معتبر نیست." };
  const validationError = await validateUpload(formData);
  if (validationError) return { success: false, message: validationError };
  const accessToken = await getActionAccessToken();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/files/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      console.error("[uploadFileAction] backend rejected:", res.status);
      return { success: false, message: extractErrorMessage(body, `آپلود فایل با خطا مواجه شد (کد ${res.status})`) };
    }

    const file = await res.json();
    if (typeof file?.id !== 'string' || !file.id) return { success: false, message: "پاسخ آپلود معتبر نیست." };
    return { success: true, fileId: file.id };
  } catch (err) {
    console.error("[uploadFileAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }
}
