import { Share2 } from "lucide-react";
import { Breadcrumb } from "@/features/public/components/breadcrumb";
import { BusinessCard } from "@/features/public/components/business-card";
import { PromoBanner } from "@/features/public/components/promo-banner";
import type { PublicBusinessListResponse, CategorySummary } from "@/features/public/types/public-business";
import Link from "next/link";

const LIMIT = 20;

async function getCategories(): Promise<CategorySummary[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getBusinesses(params: URLSearchParams): Promise<PublicBusinessListResponse> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) return { data: [], total: 0, page: 1, limit: LIMIT };
    return res.json();
  } catch {
    return { data: [], total: 0, page: 1, limit: LIMIT };
  }
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    city?: string;
    neighborhood?: string;
    vipOnly?: string;
    hasMedia?: string;
    page?: string;
  }>;
}

export default async function BusinessesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  if (sp.categoryId) query.set("categoryId", sp.categoryId);
  if (sp.city) query.set("city", sp.city);
  if (sp.neighborhood) query.set("neighborhood", sp.neighborhood);
  if (sp.vipOnly) query.set("vipOnly", sp.vipOnly);
  if (sp.hasMedia) query.set("hasMedia", sp.hasMedia);
  query.set("page", String(page));
  query.set("limit", String(LIMIT));

  const [categories, result] = await Promise.all([getCategories(), getBusinesses(query)]);
  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));
  const selectedCategory = categories.find((c) => c.id === sp.categoryId);
  const pageTitle = selectedCategory?.name ?? "مرور کسب‌وکارها";

  function pageHref(p: number) {
    const q = new URLSearchParams(query);
    q.set("page", String(p));
    return `/businesses?${q.toString()}`;
  }

  const firstHalf = result.data.slice(0, 4);
  const secondHalf = result.data.slice(4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb categories={categories} selectedCategoryId={sp.categoryId} currentLabel={pageTitle} />
        <button aria-label="اشتراک‌گذاری" className="text-neutral-400">
          <Share2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{pageTitle}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {result.total} کسب‌وکار {sp.city && `| ${sp.city}`}
          </p>
        </div>
      </div>

      <form method="get" className="space-y-3 mb-6">
        {selectedCategory && <input type="hidden" name="categoryId" value={selectedCategory.id} />}

        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-4 h-11">
            <input type="text" name="search" defaultValue={sp.search} placeholder="جستجوی کسب‌وکار" className="flex-1 bg-transparent text-sm focus:outline-none" />
          </div>
          <input type="text" name="city" defaultValue={sp.city} placeholder="شهر" className="w-28 bg-white border border-neutral-200 rounded-full px-4 h-11 text-sm focus:outline-none" />
          <button type="submit" className="h-11 px-5 rounded-full bg-emerald-950 text-white text-sm shrink-0">
            جستجو
          </button>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="vipOnly" value="true" defaultChecked={sp.vipOnly === "true"} />
            فقط VIP ها
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="hasMedia" value="true" defaultChecked={sp.hasMedia === "true"} />
            گالری تصاویر/ویدیو
          </label>

          <div className="flex items-center gap-2 mr-auto flex-wrap">
            <select name="neighborhood" defaultValue={sp.neighborhood ?? ""} className="h-9 rounded-full border border-neutral-200 bg-white px-3 text-sm">
              <option value="">انتخاب محله</option>
            </select>
            <select name="__city_dropdown_noop" disabled className="h-9 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-400">
              <option>انتخاب شهر</option>
            </select>
            <select name="categoryId" defaultValue={sp.categoryId ?? ""} className="h-9 rounded-full border border-neutral-200 bg-white px-3 text-sm">
              <option value="">دسته‌بندی‌ها</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {result.data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">کسب‌وکاری یافت نشد.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {firstHalf.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>

          {secondHalf.length > 0 && (
            <>
              <PromoBanner />
              <div className="grid sm:grid-cols-2 gap-4">
                {secondHalf.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={
                p === page
                  ? "w-8 h-8 flex items-center justify-center rounded-md text-sm bg-emerald-950 text-white"
                  : "w-8 h-8 flex items-center justify-center rounded-md text-sm border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}