"use client";

import { useRef } from "react";
import { useTrackEvent } from "@/hooks/use-track-event";
import type { GalleryImageData } from "@/features/business/types/business-profile";

function fileUrl(fileId: string) {
  return `/api/backend/files/${fileId}`;
}

export function GallerySection({ businessId, businessName, images }: { businessId: string; businessName: string; images: GalleryImageData[] }) {
  const track = useTrackEvent();
  const tracked = useRef(false);

  function handleFirstView() {
    if (tracked.current) return;
    tracked.current = true;
    track("VIEW_GALLERY", businessId);
  }

  if (images.length === 0) return null;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5">
      <p className="text-sm font-bold text-neutral-900 mb-3">گالری تصاویر</p>
      <div className="grid grid-cols-3 gap-2" onMouseEnter={handleFirstView} onClick={handleFirstView}>
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={img.id} src={fileUrl(img.fileId)} alt={img.title ?? businessName} className="aspect-square rounded-lg object-cover" />
        ))}
      </div>
    </div>
  );
}
