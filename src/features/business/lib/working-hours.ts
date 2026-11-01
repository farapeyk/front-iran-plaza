import type { Weekday, WorkingHoursEntry } from "@/features/business/types/business-profile";

export type WorkingHoursMap = Record<Weekday, WorkingHoursEntry>;

const CLOSED_HOURS = {
  isTwoShift: false,
  openTime1: null,
  closeTime1: null,
  openTime2: null,
  closeTime2: null,
} satisfies Omit<WorkingHoursEntry, "weekday" | "id" | "businessId">;

export function closedWorkingHours(weekday: Weekday): WorkingHoursEntry {
  return { weekday, ...CLOSED_HOURS };
}

export function normalizeWorkingTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  const match = /^(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(trimmed);
  if (!match) return trimmed;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour <= 23 && minute <= 59 ? `${match[1]}:${match[2]}` : trimmed;
}

export function toWorkingHoursPayload(entries: WorkingHoursEntry[]): WorkingHoursEntry[] {
  return entries.map((entry) => ({
    weekday: entry.weekday,
    isTwoShift: Boolean(entry.isTwoShift),
    openTime1: normalizeWorkingTime(entry.openTime1),
    closeTime1: normalizeWorkingTime(entry.closeTime1),
    openTime2: entry.isTwoShift ? normalizeWorkingTime(entry.openTime2) : null,
    closeTime2: entry.isTwoShift ? normalizeWorkingTime(entry.closeTime2) : null,
  }));
}

export function copySaturdayHoursToWeekdays(hoursMap: WorkingHoursMap): WorkingHoursMap {
  const saturday = toWorkingHoursPayload([hoursMap.SATURDAY])[0];
  const next = { ...hoursMap };

  for (const weekday of Object.keys(hoursMap) as Weekday[]) {
    if (weekday === "FRIDAY") {
      next[weekday] = closedWorkingHours(weekday);
    } else {
      next[weekday] = { ...saturday, weekday };
    }
  }

  return next;
}
