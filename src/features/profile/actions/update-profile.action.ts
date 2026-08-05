"use server";

import { revalidatePath } from "next/cache";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { editProfileSchema } from "../schemas/edit-profile.schema";

export type UpdateProfileResult =
  | { success: true }
  | { success: false; message: string };

export async function updateProfileAction(input: unknown): Promise<UpdateProfileResult> {
  const parsed = editProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" };
  }

  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  const { fullName, email } = parsed.data;

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fullName,
        email: email || undefined,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        success: false,
        message: body?.message ?? `بروزرسانی اطلاعات با خطا مواجه شد (کد ${res.status})`,
      };
    }
  } catch (err) {
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }

  // بروزرسانی کش صفحه داشبورد تا نام جدید کاربر نمایش داده شود
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/profile", "page");

  return { success: true };
}