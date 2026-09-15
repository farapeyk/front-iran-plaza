"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import type { ProductCategoryItem, ProductItem } from "@/features/business/types/business-extras";

export interface ProductCategoryInput {
  name: string;
}

export interface ProductInput {
  name: string;
  productCategoryId?: string;
  price: number;
  description?: string;
  discountPercent?: number;
  hasInstallment?: boolean;
  imageId?: string;
}

export async function addProductCategoryAction(businessId: string, input: ProductCategoryInput) {
  const result = await authedFetch<ProductCategoryItem>(`/api/businesses/${businessId}/product-categories`, "POST", input);
  if (result.success) revalidatePath("/dashboard/business/profile/products");
  return result;
}

export async function removeProductCategoryAction(businessId: string, categoryId: string) {
  const result = await authedFetch<undefined>(`/api/businesses/${businessId}/product-categories/${categoryId}`, "DELETE");
  if (result.success) revalidatePath("/dashboard/business/profile/products");
  return result;
}

export async function addProductAction(businessId: string, input: ProductInput) {
  const result = await authedFetch<ProductItem>(`/api/businesses/${businessId}/products`, "POST", input);
  if (result.success) revalidatePath("/dashboard/business/profile/products");
  return result;
}

export async function removeProductAction(businessId: string, productId: string) {
  const result = await authedFetch<undefined>(`/api/businesses/${businessId}/products/${productId}`, "DELETE");
  if (result.success) revalidatePath("/dashboard/business/profile/products");
  return result;
}