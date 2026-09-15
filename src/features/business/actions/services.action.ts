"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import type { ServiceItem } from "@/features/business/types/business-extras";

export interface ServiceInput {
  name: string;
  description?: string;
  priceFrom?: number;
  priceTo?: number;
  durationMinutes?: number;
}

export async function addServiceAction(businessId: string, input: ServiceInput) {
  const result = await authedFetch<ServiceItem>(`/api/businesses/${businessId}/services`, "POST", input);
  if (result.success) revalidatePath("/dashboard/business/profile/services");
  return result;
}

export async function removeServiceAction(businessId: string, serviceId: string) {
  const result = await authedFetch<undefined>(`/api/businesses/${businessId}/services/${serviceId}`, "DELETE");
  if (result.success) revalidatePath("/dashboard/business/profile/services");
  return result;
}