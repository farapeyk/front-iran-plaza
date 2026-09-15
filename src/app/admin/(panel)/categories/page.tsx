import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { CategoryManager, type AdminCategoryItem } from "@/features/admin/components/category-manager";

async function getCategories(accessToken: string): Promise<AdminCategoryItem[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/admin/categories`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminCategoriesPage() {
  const accessToken = await getAccessTokenCookie();
  const categories = accessToken ? await getCategories(accessToken) : [];

  return (
    <div dir="rtl">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">دسته‌بندی‌ها</h1>
      <p className="text-sm text-neutral-500 mb-6">{categories.length} دسته‌بندی</p>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}