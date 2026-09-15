"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import type { BranchLocation } from "@/features/business/types/business-extras";

export interface BranchInput {
  title: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  isPrimary?: boolean;
}

export async function addBranchAction(businessId: string, input: BranchInput) {
  const result = await authedFetch<BranchLocation>(`/api/businesses/${businessId}/branches`, "POST", input);
  if (result.success) revalidatePath("/dashboard/business/profile/address");
  return result;
}

export async function removeBranchAction(businessId: string, branchId: string) {
  const result = await authedFetch<undefined>(`/api/businesses/${businessId}/branches/${branchId}`, "DELETE");
  if (result.success) revalidatePath("/dashboard/business/profile/address");
  return result;
}