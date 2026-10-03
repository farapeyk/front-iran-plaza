"use client";

import { useEffect } from "react";
import { useTrackEvent } from "@/hooks/use-track-event";

/** بعد از هر جستجوی موفق (نه هر keystroke) SEARCH را ثبت می‌کند */
export function SearchTracker({ query, resultsCount }: { query?: string; resultsCount: number }) {
  const track = useTrackEvent();
  useEffect(() => {
    if (!query) return;
    track("SEARCH", undefined, { query, resultsCount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, resultsCount]);
  return null;
}
