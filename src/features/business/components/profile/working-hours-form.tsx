"use client";
import { useProfileFlow, useProfileBusy } from "./onboarding-context";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/design/components/ui/button";
import { updateWorkingHoursAction } from "@/features/business/actions/working-hours.action";
import { closedWorkingHours, copySaturdayHoursToWeekdays, normalizeWorkingTime, type WorkingHoursMap } from "@/features/business/lib/working-hours";
import { WEEKDAYS, type WorkingHoursEntry, type Weekday } from "@/features/business/types/business-profile";

function buildInitialMap(existing: WorkingHoursEntry[]): WorkingHoursMap {
  const map = {} as WorkingHoursMap;
  for (const { value } of WEEKDAYS) {
    const found = existing.find((e) => e.weekday === value);
    map[value] = found
      ? {
          weekday: value,
          isTwoShift: Boolean(found.isTwoShift),
          openTime1: normalizeWorkingTime(found.openTime1),
          closeTime1: normalizeWorkingTime(found.closeTime1),
          openTime2: found.isTwoShift ? normalizeWorkingTime(found.openTime2) : null,
          closeTime2: found.isTwoShift ? normalizeWorkingTime(found.closeTime2) : null,
        }
      : closedWorkingHours(value);
  }
  return map;
}

function timeInputClass() {
  return "h-9 rounded-md border border-input px-2 text-sm w-full";
}

export function WorkingHoursForm({ businessId, initialEntries }: { businessId: string; initialEntries: WorkingHoursEntry[] }) {
  const [isPending, startTransition] = useTransition();
  const flow = useProfileFlow();
  useProfileBusy(isPending);
  const [hoursMap, setHoursMap] = useState<WorkingHoursMap>(buildInitialMap(initialEntries));

  function updateDay(day: Weekday, patch: Partial<WorkingHoursEntry>) {
    setHoursMap((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateWorkingHoursAction(businessId, Object.values(hoursMap));
      if (!result.success) toast.error(result.message);
      else { toast.success("ساعات کاری ذخیره شد"); await flow.advance(); }
    });
  }

  const saturdayHasHours = Boolean(hoursMap.SATURDAY.openTime1 && hoursMap.SATURDAY.closeTime1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="mb-3 text-sm text-neutral-700">
          ابتدا ساعت شنبه را تنظیم کنید؛ سپس می‌توانید همان برنامه را برای یکشنبه تا پنجشنبه اعمال کنید. جمعه تعطیل می‌ماند.
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white"
          disabled={isPending || !saturdayHasHours}
          onClick={() => setHoursMap((current) => copySaturdayHoursToWeekdays(current))}
        >
          اعمال ساعت شنبه برای همه روزها به‌جز جمعه
        </Button>
      </div>

      {WEEKDAYS.map(({ value, label }) => {
        const day = hoursMap[value];
        const isClosed = !day.openTime1 && !day.closeTime1;
        return (
          <div key={value} className="border-b border-neutral-100 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-neutral-800">{label}</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-neutral-600">
                  تعطیل
                  <input
                    type="checkbox"
                    checked={isClosed}
                    onChange={(e) => updateDay(value, e.target.checked
                      ? closedWorkingHours(value)
                      : { isTwoShift: false, openTime1: "09:00", closeTime1: "17:00", openTime2: null, closeTime2: null })}
                    disabled={isPending}
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-600">
                  دو شیفت
                  <input type="checkbox" checked={day.isTwoShift} onChange={(e) => updateDay(value, { isTwoShift: e.target.checked, ...(!e.target.checked ? { openTime2: null, closeTime2: null } : {}) })} disabled={isPending || isClosed} />
                </label>
              </div>
            </div>

            {isClosed ? (
              <p className="rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-500">این روز تعطیل است.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1 text-xs text-neutral-600">
                  پایان شیفت اول
                  <input aria-label={`${label}، پایان شیفت اول`} type="time" value={day.closeTime1 ?? ""} onChange={(e) => updateDay(value, { closeTime1: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
                </label>
                <label className="space-y-1 text-xs text-neutral-600">
                  شروع شیفت اول
                  <input aria-label={`${label}، شروع شیفت اول`} type="time" value={day.openTime1 ?? ""} onChange={(e) => updateDay(value, { openTime1: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
                </label>
              </div>
            )}

            {!isClosed && day.isTwoShift && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <label className="space-y-1 text-xs text-neutral-600">
                  پایان شیفت دوم
                  <input aria-label={`${label}، پایان شیفت دوم`} type="time" value={day.closeTime2 ?? ""} onChange={(e) => updateDay(value, { closeTime2: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
                </label>
                <label className="space-y-1 text-xs text-neutral-600">
                  شروع شیفت دوم
                  <input aria-label={`${label}، شروع شیفت دوم`} type="time" value={day.openTime2 ?? ""} onChange={(e) => updateDay(value, { openTime2: e.target.value || null })} className={timeInputClass()} disabled={isPending} />
                </label>
              </div>
            )}
          </div>
        );
      })}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : flow.active ? "ذخیره و ادامه" : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}
