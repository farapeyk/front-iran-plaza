import { Clock } from "lucide-react";
import { SocialLinksRow } from "@/features/public/components/business-location-map";
import { FavoriteButton } from "@/features/public/components/favorite-button";
import { ReviewForm } from "@/features/public/components/review-form";
import { ReviewsList } from "@/features/public/components/reviews-list";
import { FeaturesChecklist } from "@/features/public/components/features-checklist";
import { BusinessViewTracker } from "@/features/public/components/business-view-tracker";
import { ContactActions } from "@/features/public/components/contact-actions";
import { AddressSection } from "@/features/public/components/address-section";
import { GallerySection } from "@/features/public/components/gallery-section";
import { WEEKDAYS } from "@/features/business/types/business-profile";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { BusinessProfile, GalleryImageData, WorkingHoursEntry } from "@/features/business/types/business-profile";
import type { BranchLocation, ServiceItem, ProductCategoryItem, ProductItem } from "@/features/business/types/business-extras";
import type { BusinessFeature } from "@/features/business/types/business-feature";
import type { ReviewData } from "@/features/public/types/review";

function fileUrl(fileId: string) {
  return `/api/backend/files/${fileId}`;
}

type FullBusinessProfile = BusinessProfile & {
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  gallery: GalleryImageData[];
  services: ServiceItem[];
  productCategories: ProductCategoryItem[];
  products: ProductItem[];
  workingHours: WorkingHoursEntry[];
  branches: BranchLocation[];
  website?: string | null;
};

async function safeGet<T>(path: string, fallback: T, accessToken?: string): Promise<T> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}${path}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[public business page] GET ${path} → ${res.status}`);
      return fallback;
    }
    return res.json();
  } catch (err) {
    console.error(`[public business page] GET ${path} network error:`, err);
    return fallback;
  }
}

export default async function PublicBusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const accessToken = await getAccessTokenCookie();
  const isLoggedIn = !!accessToken;

  const business = await safeGet<FullBusinessProfile | null>(`/api/businesses/slug/${slug}`, null);
  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500" dir="rtl">
        کسب‌وکار پیدا نشد.
      </div>
    );
  }

  const [reviews, myFavorites, features] = await Promise.all([
    safeGet<ReviewData[]>(`/api/businesses/${business.id}/reviews`, []),
    isLoggedIn ? safeGet<{ id: string }[]>(`/api/users/me/favorites`, [], accessToken) : Promise.resolve([] as { id: string }[]),
    safeGet<BusinessFeature[]>(`/api/businesses/${business.id}/features`, []),
  ]);

  const isFavorited = myFavorites.some((f) => f.id === business.id);

  const { gallery, services, productCategories: categories, products, workingHours: hours, branches } = business;

  return (
    <div dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        
        {/* ✅ ثبت بازدید صفحه (Fire-and-forget) */}
        <BusinessViewTracker businessId={business.id} />

        {/* کارت هدر */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                {business.logoId && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fileUrl(business.logoId)} alt={business.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-900">{business.name}</h1>
                {business.description && <p className="text-sm text-neutral-500 mt-0.5">{business.description}</p>}
              </div>
            </div>
            <FavoriteButton businessId={business.id} initialFavorited={isFavorited} />
          </div>

          {/* ✅ استفاده از کامپوننت ترک‌شونده برای تماس/واتساپ/وب‌سایت */}
          <ContactActions 
            businessId={business.id} 
            phone={business.phone} 
            whatsapp={business.whatsapp} 
            website={business.website} 
          />

          <div className="mt-3">
            <SocialLinksRow socialMedia={business.socialMedia} />
          </div>
        </div>

        {/* بخش امکانات (چک‌لیست) */}
        {features && features.length > 0 && (
          <FeaturesChecklist features={features} />
        )}

        {/* بخش درباره ما */}
        {business.aboutText && (
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <p className="text-sm font-bold text-neutral-900 mb-2">درباره ما</p>
            <p className="text-sm text-neutral-700 whitespace-pre-line">{business.aboutText}</p>
          </div>
        )}

        {/* ✅ استفاده از کامپوننت ترک‌شونده برای آدرس و نقشه */}
        {business.address && (
          <AddressSection 
            businessId={business.id}
            address={business.address}
            latitude={business.latitude ?? null}
            longitude={business.longitude ?? null}
            branches={branches}
          />
        )}

        {/* ✅ استفاده از کامپوننت ترک‌شونده برای گالری */}
        <GallerySection 
          businessId={business.id} 
          businessName={business.name} 
          images={gallery} 
        />

        {/* بخش خدمات */}
        {services && services.length > 0 && (
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <p className="text-sm font-bold text-neutral-900 mb-3">خدمات</p>
            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2 last:border-0">
                  <span className="text-neutral-800">{s.name}</span>
                  {(s.priceFrom || s.priceTo) && (
                    <span className="text-neutral-500">
                      {s.priceFrom ? Number(s.priceFrom).toLocaleString("fa-IR") : "۰"} تا {s.priceTo ? Number(s.priceTo).toLocaleString("fa-IR") : "۰"} تومان
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* بخش محصولات (طراحی سفارشی شما با قابلیت تخفیف و توضیحات) */}
        {categories && categories.length > 0 && (
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <p className="text-sm font-bold text-neutral-900 mb-4">محصولات</p>
            <div className="space-y-6">
              {categories.map((cat) => {
                const catProducts = products.filter((p) => p.productCategoryId === cat.id);
                if (catProducts.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <p className="text-sm font-bold text-neutral-800 mb-3 border-r-2 border-emerald-600 pr-2">{cat.name}</p>
                    <div className="space-y-4">
                      {catProducts.map((p) => (
                        <div key={p.id} className="flex items-start gap-3">
                          {/* تصویر محصول */}
                          <div className="w-16 h-16 rounded-lg bg-neutral-50 overflow-hidden shrink-0 flex items-center justify-center border border-neutral-100">
                            {p.imageId ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={fileUrl(p.imageId)} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-neutral-400">بدون عکس</span>
                            )}
                          </div>

                          {/* نام، توضیحات و تگ‌ها */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                              {p.hasInstallment && (
                                <span className="inline-block text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">اقساطی</span>
                              )}
                            </div>
                            {/* ✅ توضیحات محصول (تا ۲ خط) */}
                            {p.description && (
                              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{p.description}</p>
                            )}
                          </div>

                          {/* قیمت محصول */}
                          <div className="text-left shrink-0">
                            {/* ✅ بررسی تخفیف */}
                            {p.discountPercent > 0 ? (
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] text-red-500 line-through">
                                  {Number(p.price).toLocaleString("fa-IR")}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-neutral-900 font-bold">
                                    {Number(p.price * (1 - p.discountPercent / 100)).toLocaleString("fa-IR")}
                                  </span>
                                  <span className="text-[10px] text-neutral-400">تومان</span>
                                </div>
                                <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded mt-0.5">
                                  {p.discountPercent}% تخفیف
                                </span>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm text-neutral-900 font-medium">{Number(p.price).toLocaleString("fa-IR")}</p>
                                <p className="text-xs text-neutral-400">تومان</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* بخش ساعات کاری */}
        {hours && hours.length > 0 && (
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <p className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Clock size={16} />
              ساعات کاری
            </p>
            <div className="space-y-1.5">
              {WEEKDAYS.map(({ value, label }) => {
                const day = hours.find((h) => h.weekday === value);
                return (
                  <div key={value} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{label}</span>
                    <span className="text-neutral-500" dir="ltr">
                      {day?.openTime1 ? `${day.openTime1} - ${day.closeTime1}` : "تعطیل"}
                      {day?.isTwoShift && day.openTime2 ? ` | ${day.openTime2} - ${day.closeTime2}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* بخش نظرات */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <p className="text-sm font-bold text-neutral-900 mb-3">نظرات</p>
          <div className="mb-4">
            <ReviewForm businessId={business.id} isLoggedIn={isLoggedIn} />
          </div>
          <ReviewsList reviews={reviews} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}