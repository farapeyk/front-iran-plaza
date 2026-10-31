"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";

export async function updateBusinessCipAction(businessId: string, isCip: boolean) {
  const result = await authedFetch<{ id: string; isCip: boolean }>(
    `/api/admin/businesses/${encodeURIComponent(businessId)}/cip`,
    "PATCH",
    { isCip },
  );
  if (result.success) {
    revalidatePath(`/admin/businesses/${businessId}`);
  }
  return result;
}
