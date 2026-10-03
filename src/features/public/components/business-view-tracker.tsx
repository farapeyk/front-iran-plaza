"use client";

import { useEffect } from "react";
import { useTrackEvent } from "@/hooks/use-track-event";

/** کامپوننت نامرئی — فقط برای ثبت VIEW_BUSINESS یک‌بار در mount */
export function BusinessViewTracker({ businessId }: { businessId: string }) {
  const track = useTrackEvent();
  useEffect(() => {
    track("VIEW_BUSINESS", businessId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);
  return null;
}
