"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import type { InstallmentPlanData } from "@/features/business/types/business-extras";

export interface InstallmentPlanInput {
  minDownPaymentPercent: number;
  monthlyInterestPercent: number;
  repaymentPeriodsMonths: number[];
  guaranteeNote?: string;
    isActive: boolean; // ✅ اضافه شود
}

export async function updateInstallmentPlanAction(businessId: string, input: InstallmentPlanInput) {
  const result = await authedFetch<InstallmentPlanData>(`/api/businesses/${businessId}/installment-plan`, "PATCH", input);
  if (result.success) revalidatePath("/dashboard/business/profile/installment");
  return result;
}