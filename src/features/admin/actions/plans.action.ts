"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import type { PlanFeatures, PlanSummary } from "@/features/admin/types/plan";

export interface PlanInput {
  name: string;
  price: number;
  durationDays: number;
  galleryLimit: number;
  productLimit: number;
  serviceLimit: number;
  discountLimit: number;
  priority: number;
  features: PlanFeatures;
}

function validInteger(value: number) {
  return Number.isSafeInteger(value) && value >= 0;
}

export async function savePlanAction(planId: string | null, input: PlanInput) {
  const currentUser = await getCurrentUser();
  if (currentUser?.userType !== "SUPER_ADMIN") return { success: false as const, message: "فقط مدیر ارشد می‌تواند پلن‌ها را مدیریت کند." };

  const payload = {
    ...input,
    name: input.name.trim(),
    tier: "VIP" as const,
    isTrial: false,
  };
  const limits = [payload.durationDays, payload.galleryLimit, payload.productLimit, payload.serviceLimit, payload.discountLimit, payload.priority];
  if (payload.name.length < 2 || payload.name.length > 120 || !Number.isFinite(payload.price) || payload.price < 0 || !limits.every(validInteger) || payload.durationDays < 1) {
    return { success: false as const, message: "نام، قیمت، مدت و محدودیت‌های پلن را درست وارد کنید." };
  }

  const result = await authedFetch<PlanSummary>(
    planId ? `/api/admin/plans/${encodeURIComponent(planId)}` : "/api/admin/plans",
    planId ? "PATCH" : "POST",
    payload,
  );
  if (result.success) revalidatePath("/admin/plans");
  return result;
}

export async function deactivatePlanAction(planId: string) {
  const currentUser = await getCurrentUser();
  if (currentUser?.userType !== "SUPER_ADMIN") return { success: false as const, message: "فقط مدیر ارشد می‌تواند پلن‌ها را مدیریت کند." };
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(planId)) return { success: false as const, message: "شناسه پلن معتبر نیست." };
  const result = await authedFetch<PlanSummary>(`/api/admin/plans/${encodeURIComponent(planId)}/deactivate`, "PATCH");
  if (result.success) revalidatePath("/admin/plans");
  return result;
}
