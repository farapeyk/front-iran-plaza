"use client";

import { useCallback } from "react";
import { getOrCreateSessionId } from "@/lib/tracking/session";

type ActivityType =
  | "VIEW_BUSINESS" | "VIEW_PRODUCT" | "VIEW_GALLERY"
  | "CLICK_PHONE" | "CLICK_WEBSITE" | "CLICK_LOCATION"
  | "ADD_FAVORITE" | "REMOVE_FAVORITE" | "SUBMIT_REVIEW"
  | "REPORT_BUSINESS" | "VIEW_PLAN" | "SEARCH" | "FILTER" | "SORT";

export function useTrackEvent() {
  return useCallback((type: ActivityType, businessId?: string, metadata?: Record<string, unknown>) => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    // ⚠️ Fire-and-forget — هرگز await نکنید، هرگز خطاش رو به کاربر نشون ندید.
    // مسیر بدون "api" اضافه است (پروکسی خودش /api/ رو جلوی مسیر می‌ذاره).
    fetch("/api/backend/tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        type,
        businessId,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        metadata,
      }),
    }).catch(() => {
      // عمداً بی‌صدا
    });
  }, []);
}
