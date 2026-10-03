"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";

export async function toggleTrackingAction(enabled: boolean) {
  // استفاده از اندپوینت عمومی با کلید tracking-enabled
  const result = await authedFetch("/api/admin/settings/tracking-enabled", "PATCH", { value: enabled });
  if (result.success) {
    revalidatePath("/admin/settings");
  }
  return result;
}

// دریافت وضعیت فعلی برای نمایش در پنل ادمین
export async function getTrackingStatus(): Promise<boolean> {
  // بک‌اند آرایه‌ای از تنظیمات برمی‌گرداند، ما باید مورد tracking-enabled را پیدا کنیم
  const result = await authedFetch<Array<{ key: string; value: boolean }>>("/api/admin/settings", "GET");
  
  if (result.success && Array.isArray(result.data)) {
    const trackingSetting = result.data.find(s => s.key === "tracking-enabled");
    return trackingSetting ? trackingSetting.value : true;
  }
  
  return true; // پیش‌فرض فعال
}