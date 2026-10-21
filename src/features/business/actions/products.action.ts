"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import type { ProductCategoryItem, ProductItem } from "@/features/business/types/business-extras";

export interface ProductCategoryInput {
  name: string;
}

export interface ProductInput {
  name: string;
  productCategoryId: string;
  price: number;
  description?: string;
  discountPercent?: number;
  hasInstallment?: boolean;
  imageId?: string;
}

function validateProductInput(input: ProductInput): string | null {
  if (!input || typeof input.name !== "string" || !input.name.trim()) return "نام محصول الزامی است";
  if (typeof input.productCategoryId !== "string" || !input.productCategoryId.trim()) return "انتخاب زیر‌دسته محصول الزامی است";
  if (typeof input.price !== "number" || !Number.isFinite(input.price) || input.price < 0) return "قیمت محصول معتبر نیست";
  return null;
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
  const validationError = validateProductInput(input);
  if (validationError) return { success: false as const, message: validationError };
  const result = await authedFetch<ProductItem>(`/api/businesses/${businessId}/products`, "POST", input);
  if (result.success) revalidatePath("/dashboard/business/profile/products");
  return result;
}

export async function updateProductAction(businessId: string, productId: string, input: ProductInput) {
  const validationError = validateProductInput(input);
  if (validationError) return { success: false as const, message: validationError };
  const result = await authedFetch<ProductItem>(`/api/businesses/${businessId}/products/${productId}`, "PATCH", input);
  if (result.success) revalidatePath("/dashboard/business/profile/products");
  return result;
}

export async function removeProductAction(businessId: string, productId: string) {
  const result = await authedFetch<undefined>(`/api/businesses/${businessId}/products/${productId}`, "DELETE");
  if (result.success) revalidatePath("/dashboard/business/profile/products");
  return result;
}
