"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";

export async function assignBusinessPlanAction(businessId: string, planId: string) {
  const result = await authedFetch(`/api/admin/businesses/${businessId}/plan`, "PATCH", { planId });
  if (result.success) {
    revalidatePath(`/admin/businesses/${businessId}`);
    revalidatePath("/admin/businesses/pending");
  }
  return result;
}

export async function downgradeBusinessPlanAction(businessId: string) {
  const result = await authedFetch(`/api/admin/businesses/${businessId}/plan/downgrade`, "PATCH");
  if (result.success) {
    revalidatePath(`/admin/businesses/${businessId}`);
    revalidatePath("/admin/businesses/pending");
  }
  return result;
}