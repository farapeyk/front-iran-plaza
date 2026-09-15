"use server";

import { authedFetch } from "@/features/business/actions/authed-fetch";

export interface CreateManualBusinessInput {
  ownerPhone: string;
  ownerFullName?: string;
  ownerNationalCode?: string;
  name: string;
  phone: string;
  description?: string;
  address?: string;
  businessType?: "SOLE_PROPRIETOR" | "COMPANY" | "BRANCH";
  registrationType: "IN_PERSON" | "TELEPHONE";
}

export type CreateManualBusinessResult =
  | { success: true; businessId: string; planWarning?: string }
  | { success: false; message: string };

export async function createManualBusinessAction(
  input: CreateManualBusinessInput,
  planId?: string,
): Promise<CreateManualBusinessResult> {
  const createResult = await authedFetch<{ id: string }>("/api/admin/businesses", "POST", input);
  if (!createResult.success) {
    return createResult;
  }

  const businessId = createResult.data.id;

  if (planId) {
    const planResult = await authedFetch(`/api/admin/businesses/${businessId}/plan`, "PATCH", { planId });
    if (!planResult.success) {
      return { success: true, businessId, planWarning: `کسب‌وکار ساخته شد ولی پلن اعطا نشد: ${planResult.message}` };
    }
  }

  return { success: true, businessId };
}