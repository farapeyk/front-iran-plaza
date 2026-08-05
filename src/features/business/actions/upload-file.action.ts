"use server";

import { getAccessTokenCookie } from "@/lib/auth/cookies";

export type UploadFileResult = { success: true; fileId: string } | { success: false; message: string };

// ⚠️ فرض کردم نام فیلد فایل توی FormData باید "file" باشه (رایج‌ترین قرارداد
// NestJS با FileInterceptor('file')) — اگه بک‌اند اسم دیگه‌ای می‌خواد بگید.
export async function uploadFileAction(formData: FormData): Promise<UploadFileResult> {
  const accessToken = await getAccessTokenCookie();
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
      console.error("[uploadFileAction] backend rejected:", res.status, body);
      return { success: false, message: body?.message ?? `آپلود فایل با خطا مواجه شد (کد ${res.status})` };
    }

    const file = await res.json();
    return { success: true, fileId: file.id };
  } catch (err) {
    console.error("[uploadFileAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }
}