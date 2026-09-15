import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { ProductsManager } from "@/features/business/components/profile/products-manager";
import type { ProductCategoryItem, ProductItem } from "@/features/business/types/business-extras";

async function getCategories(businessId: string, accessToken: string): Promise<ProductCategoryItem[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/product-categories`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getProducts(businessId: string, accessToken: string): Promise<ProductItem[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/products`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const [categories, products] = accessToken
    ? await Promise.all([getCategories(business.id, accessToken), getProducts(business.id, accessToken)])
    : [[], []];

  return (
    <ProfileEditShell title="محصولات">
      <ProductsManager businessId={business.id} initialCategories={categories} initialProducts={products} />
    </ProfileEditShell>
  );
}