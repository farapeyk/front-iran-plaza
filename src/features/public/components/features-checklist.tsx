"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { BusinessFeature } from "@/features/business/types/business-feature";

const THRESHOLD = 6; // آستانه نمایش دکمه "مشاهده همه"

export function FeaturesChecklist({ features }: { features: BusinessFeature[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!features || features.length === 0) return null;

  const visible = expanded ? features : features.slice(0, THRESHOLD);
  const hasMore = features.length > THRESHOLD;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5" dir="rtl">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {visible.map((f) => (
          <div key={f.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-neutral-700">{f.label}</span>
            <Check size={16} className="text-emerald-700 shrink-0" />
          </div>
        ))}
      </div>

      {hasMore && !expanded && (
        <button 
          onClick={() => setExpanded(true)} 
          className="flex items-center gap-1 text-sm text-emerald-800 font-medium mt-4 hover:text-emerald-900 transition-colors"
        >
          مشاهده همه امکانات
          <span className="text-lg leading-none">+</span>
        </button>
      )}
      
      {hasMore && expanded && (
        <button 
          onClick={() => setExpanded(false)} 
          className="flex items-center gap-1 text-sm text-neutral-500 font-medium mt-4 hover:text-neutral-700 transition-colors"
        >
          بستن
          <span className="text-lg leading-none">-</span>
        </button>
      )}
    </div>
  );
}