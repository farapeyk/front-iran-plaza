"use server";

import { extractErrorMessage } from "@/lib/api/error-message";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export type DocumentType = "NATIONAL_ID_FRONT" | "NATIONAL_ID_BACK" | "BUSINESS_LICENSE_PHOTO";

interface SubmitDocumentInput {
  businessId: string;
  type: DocumentType;
  fileId: string;
  companyName?: string;
  licenseNumber?: string;
  unionCode?: string;
  issueDate?: string;
}

export type SubmitDocumentResult = { success: true } | { success: false; message: string };

export async function submitBusinessDocumentAction(input: SubmitDocumentInput): Promise<SubmitDocumentResult> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  const { businessId, ...body } = input;

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error("[submitBusinessDocumentAction] backend rejected:", res.status, errBody);
      return { success: false, message: extractErrorMessage(errBody, `ثبت مدرک با خطا مواجه شد (کد ${res.status})`) };
    }
  } catch (err) {
    console.error("[submitBusinessDocumentAction] network error:", err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  return { success: true };
}