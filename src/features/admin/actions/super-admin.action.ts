"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { authedFetch } from "@/features/business/actions/authed-fetch";

export type CreateSuperAdminResult = { success: true; user: { id: string; phone: string; fullName: string } } | { success: false; message: string };

export async function createSuperAdminAction(input: { phone: string; fullName: string; password: string }): Promise<CreateSuperAdminResult> {
  const currentUser = await getCurrentUser();
  if (currentUser?.userType !== "SUPER_ADMIN") return { success: false, message: "فقط مدیر ارشد می‌تواند مدیر ارشد جدید بسازد." };
  const payload = { phone: input.phone.trim(), fullName: input.fullName.trim(), password: input.password };
  if (!/^09\d{9}$/.test(payload.phone) || payload.fullName.length < 2 || payload.password.length < 12 || payload.password.length > 72 || new TextEncoder().encode(payload.password).length > 72) {
    return { success: false, message: "شماره موبایل یا نام معتبر نیست؛ رمز عبور باید حداقل ۱۲ نویسه و حداکثر ۷۲ بایت باشد." };
  }

  const result = await authedFetch<{ data: { id: string; phone: string; fullName: string } }>("/api/admin/users/super-admin", "POST", payload);
  if (!result.success) return result;
  const user = result.data?.data;
  if (!user?.id || !user?.phone || !user?.fullName) return { success: false, message: "پاسخ سرور برای حساب ایجادشده معتبر نیست." };
  revalidatePath("/admin/users");
  return { success: true, user: { id: user.id, phone: user.phone, fullName: user.fullName } };
}
