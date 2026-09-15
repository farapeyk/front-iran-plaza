"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateBusinessProfileAction } from "@/features/business/actions/update-business-profile.action";

const LocationPicker = dynamic(() => import("./location-picker"), {
  ssr: false,
  loading: () => <div className="h-[260px] rounded-lg bg-neutral-100 animate-pulse" />,
});

export function PrimaryAddressForm({
  businessId,
  initialAddress,
  initialLatitude,
  initialLongitude,
}: {
  businessId: string;
  initialAddress: string;
  initialLatitude: number | null;
  initialLongitude: number | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [address, setAddress] = useState(initialAddress);
  const [lat, setLat] = useState<number | undefined>(initialLatitude ?? undefined);
  const [lng, setLng] = useState<number | undefined>(initialLongitude ?? undefined);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateBusinessProfileAction(businessId, { address, latitude: lat, longitude: lng });
      if (!result.success) toast.error(result.message);
      else toast.success("آدرس ذخیره شد");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium">آدرس کامل</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          disabled={isPending}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">موقعیت روی نقشه</label>
        <LocationPicker latitude={lat} longitude={lng} onChange={(la, lo) => { setLat(la); setLng(lo); }} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره آدرس اصلی"}
      </Button>
    </form>
  );
}