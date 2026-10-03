"use client";

import { MapPin } from "lucide-react";
import { useTrackEvent } from "@/hooks/use-track-event";
import { BusinessLocationMap } from "@/features/public/components/business-location-map";
import type { BranchLocation } from "@/features/business/types/business-extras";

export function AddressSection({
  businessId,
  address,
  latitude,
  longitude,
  branches,
}: {
  businessId: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  branches: BranchLocation[];
}) {
  const track = useTrackEvent();

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-neutral-900">آدرس</p>
        {latitude && longitude && (
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("CLICK_LOCATION", businessId)}
            className="flex items-center gap-1 text-xs text-emerald-800"
          >
            <MapPin size={12} />
            نمایش در نقشه
          </a>
        )}
      </div>
      <p className="text-sm text-neutral-700 mb-3">{address}</p>
      {latitude && longitude && <BusinessLocationMap latitude={latitude} longitude={longitude} />}
      {branches.length > 0 && (
        <div className="mt-3 space-y-2">
          {branches.map((b) => (
            <div key={b.id} className="text-sm border-t border-neutral-100 pt-2">
              <span className="font-medium text-neutral-800">{b.title}</span>
              <span className="text-neutral-500"> — {b.address}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
