"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";

export async function updateReviewStatusAction(reviewId: string, status: "APPROVED" | "REJECTED") {
  const result = await authedFetch(`/api/admin/reviews/${reviewId}`, "PATCH", { status });
  if (result.success) revalidatePath("/admin/reviews");
  return result;
}

export async function deleteReviewAction(reviewId: string) {
  const result = await authedFetch(`/api/admin/reviews/${reviewId}`, "DELETE");
  if (result.success) revalidatePath("/admin/reviews");
  return result;
}