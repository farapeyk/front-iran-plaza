"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import type { BusinessFeature } from "@/features/business/types/business-feature";

export async function addFeatureAction(businessId: string, label: string) {
  const result = await authedFetch<BusinessFeature>(`/api/businesses/${businessId}/features`, "POST", { label });
  if (result.success) revalidatePath("/dashboard/business/profile/features");
  return result;
}

export async function removeFeatureAction(businessId: string, featureId: string) {
  const result = await authedFetch<undefined>(`/api/businesses/${businessId}/features/${featureId}`, "DELETE");
  if (result.success) revalidatePath("/dashboard/business/profile/features");
  return result;
}