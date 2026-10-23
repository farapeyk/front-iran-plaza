"use client";

import { useState } from "react";
import { MapPin, Store, Phone, BadgePercent, CreditCard } from "lucide-react";
import { BusinessLocationMap } from "@/features/public/components/business-location-map";
import type { BusinessControllerGetFullBySlug200 } from "@/design/api/generated/models/businessControllerGetFullBySlug200";
import type { BusinessProfileControllerGetFeatures200Item } from "@/design/api/generated/models/businessProfileControllerGetFeatures200Item";

type BusinessLocationsProps = {
  business: BusinessControllerGetFullBySlug200;
  features: BusinessProfileControllerGetFeatures200Item[];
};

export function BusinessProfileTags({ business, features }: BusinessLocationsProps) {
  const hasDiscount = business.products.some((product) => product.isActive && product.discountPercent > 0);
  const hasInstallments = business.installmentPlan?.isActive === true;
  const activeFeatures = features.filter((feature) => feature.isActive !== false);

  if (!activeFeatures.length && !hasDiscount && !hasInstallments) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="ویژگی‌های کسب‌وکار">
      {hasDiscount && <li className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm"><BadgePercent size={16} />تخفیف</li>}
      {hasInstallments && <li className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm"><CreditCard size={16} />اقساط</li>}
      {activeFeatures.map((feature) => <li key={feature.id} className="rounded-full bg-primary-50 px-3 py-1 text-sm">{feature.label}</li>)}
    </ul>
  );
}

export function BusinessLocations({ business, features }: BusinessLocationsProps) {
  const primary = business.branches.find((branch) => branch.isPrimary);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(primary?.id ?? null);
  const selectedBranch = business.branches.find((branch) => branch.id === selectedBranchId) ?? null;
  const latitude = selectedBranch ? selectedBranch.latitude : business.latitude;
  const longitude = selectedBranch ? selectedBranch.longitude : business.longitude;
  return (
    <div className="space-y-4 rounded border border-[var(--border-subtle)]">
      {latitude != null && longitude != null && <BusinessLocationMap latitude={latitude} longitude={longitude} />}
      <div className="space-y-3 px-5 pb-5">
        <p className="flex items-start gap-2"><MapPin size={20} className="mt-1 shrink-0 text-primary-700" />{selectedBranch?.address ?? business.address}</p>
        <BusinessProfileTags business={business} features={features} />
        {business.branches.length > 0 && (
          <ul className="divide-y" aria-label="شعب کسب‌وکار">
            {business.branches.map((branch) => (
              <li key={branch.id} className="flex flex-wrap items-center gap-3 py-3">
                <button type="button" aria-pressed={selectedBranchId === branch.id} onClick={() => setSelectedBranchId(branch.id)} className="flex min-w-0 flex-1 items-start gap-2 text-start">
                  <Store size={18} className="mt-1 shrink-0 text-primary-700" />
                  <span><strong>{branch.title}</strong>{branch.isPrimary && <span className="ms-2 rounded-full bg-primary-50 px-2 py-0.5 text-xs">شعبه اصلی</span>}<span className="mt-1 block text-sm">{branch.address}</span></span>
                </button>
                {branch.phone && <a className="inline-flex items-center gap-1 text-sm text-primary-700" href={`tel:${branch.phone}`}><Phone size={16} />{branch.phone}</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
