"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateWorkingHoursAction } from "@/features/business/actions/working-hours.action";
import { WEEKDAYS, type WorkingHoursEntry, type Weekday } from "@/features/business/types/business-profile";

function buildInitialMap(existing: WorkingHoursEntry[]): Record<Weekday, WorkingHoursEntry> {
  const map = {} as Record<Weekday, WorkingHoursEntry>;
  for (const { value } of WEEKDAYS) {
    const found = existing.find((e) => e.weekday === value);
    map[value] = found ?? { weekday: value, isTwoShift: false, openTime1: null, closeTime1: null, openTime2: null, closeTime2: null };
  }
  return map;
}

function timeInputClass() {
  return "h-9 rounded-md border border-input px-2 text-sm w-full";
}

export function WorkingHoursForm({ businessId, initialEntries }: { businessId: string; initialEntries: WorkingHoursEntry[] }) {
  const [isPending, startTransition] = useTransition();
  const [hoursMap, setHoursMap] = useState<Record<Weekday, WorkingHoursEntry>>(buildInitialMap(initialEntries));

  function updateDay(day: Weekday, patch: Partial<WorkingHoursEntry>) {
    setHoursMap((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateWorkingHoursAction(businessId, Object.values(hoursMap));
      if (!result.success) toast.error(result.message);
      else toast.success("ساعات کاری ذخیره شد");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {WEEKDAYS.map(({ value, label }) => {
        const day = hoursMap[value];
        return (
          <div key={value} className="border-b border-neutral-100 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-neutral-800">{label}</span>
              <label className="flex items-center gap-2 text-xs text-neutral-500">
                دو شیفت
                <input type="checkbox" checked={day.isTwoShift} onChange={(e) => updateDay(value, { isTwoShift: e.target.checked })} disabled={isPending} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input type="time" value={day.openTime1 ?? ""} onChange={(e) => updateDay(value, { openTime1: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
              <input type="time" value={day.closeTime1 ?? ""} onChange={(e) => updateDay(value, { closeTime1: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
            </div>

            {day.isTwoShift && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input type="time" value={day.openTime2 ?? ""} onChange={(e) => updateDay(value, { openTime2: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
                <input type="time" value={day.closeTime2 ?? ""} onChange={(e) => updateDay(value, { closeTime2: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
              </div>
            )}
          </div>
        );
      })}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}