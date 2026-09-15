"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CreateCategoryInput {
  name: string;
  parentId?: string;
  icon?: string;
}

export async function createCategoryAction(input: CreateCategoryInput) {
  const result = await authedFetch(`/api/admin/categories`, "POST", input);
  if (result.success) revalidatePath("/admin/categories");
  return result;
}

export async function updateCategoryAction(id: string, input: UpdateCategoryInput) {
  const result = await authedFetch(`/api/admin/categories/${id}`, "PATCH", input);
  if (result.success) revalidatePath("/admin/categories");
  return result;
}

export async function deleteCategoryAction(id: string) {
  const result = await authedFetch(`/api/admin/categories/${id}`, "DELETE");
  if (result.success) revalidatePath("/admin/categories");
  return result;
}