"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import { articlePath } from "@/features/content/lib/public-paths";

export async function submitArticleFeedbackAction(slug: string, input: { rating: number; comment?: string }) {
  const result = await authedFetch(`/api/articles/${encodeURIComponent(slug)}/feedback`, "POST", input);
  if (result.success) revalidatePath(articlePath(slug));
  return result;
}
