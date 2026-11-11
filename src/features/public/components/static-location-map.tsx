"use client";

import RasterMap from "@/components/maps/raster-map";

export default function StaticLocationMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200" style={{ height: 220 }}>
      <RasterMap
        center={{ latitude, longitude }}
        zoom={15}
        marker={{ latitude, longitude }}
        interactive={false}
        className="h-full w-full"
      />
    </div>
  );
}
