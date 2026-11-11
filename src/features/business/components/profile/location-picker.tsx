"use client";

import { useState } from "react";
import RasterMap from "@/components/maps/raster-map";

const DEFAULT_CENTER: [number, number] = [35.6892, 51.389];

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    latitude != null && longitude != null ? [latitude, longitude] : null,
  );

  function handleChange(lat: number, lng: number) {
    setPosition([lat, lng]);
    onChange(lat, lng);
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg overflow-hidden border border-neutral-200" style={{ height: 260 }}>
        <RasterMap
          center={{ latitude: position?.[0] ?? DEFAULT_CENTER[0], longitude: position?.[1] ?? DEFAULT_CENTER[1] }}
          zoom={position ? 14 : 5}
          marker={position ? { latitude: position[0], longitude: position[1] } : null}
          onLocationChange={handleChange}
          className="h-full w-full"
        />
      </div>
      <p className="text-xs text-neutral-500">روی نقشه کلیک کنید تا موقعیت مشخص شود</p>
    </div>
  );
}
