import { JALALI_MONTHS, JALALI_YEAR_RANGE, jalaliMonthLength } from "@/lib/utils/jalali";

const YEAR_OPTIONS = Array.from(
  { length: JALALI_YEAR_RANGE.max - JALALI_YEAR_RANGE.min + 1 },
  (_, i) => JALALI_YEAR_RANGE.max - i,
);

function fieldClass(hasError?: boolean) {
  return [
    "w-full h-10 rounded-md border bg-transparent px-3 text-sm",
    "focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:bg-neutral-100",
    hasError ? "border-destructive" : "border-input",
  ].join(" ");
}

interface JalaliDateSelectProps {
  day?: number;
  month?: number;
  year?: number;
  onDayChange: (v: number) => void;
  onMonthChange: (v: number) => void;
  onYearChange: (v: number) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function JalaliDateSelect({
  day, month, year, onDayChange, onMonthChange, onYearChange, disabled, hasError,
}: JalaliDateSelectProps) {
  const dayCount = month ? jalaliMonthLength(year || JALALI_YEAR_RANGE.max, month) : 31;

  return (
    <div className="grid grid-cols-3 gap-2">
      <select value={day ?? ""} onChange={(e) => onDayChange(Number(e.target.value))} className={fieldClass(hasError)} disabled={disabled}>
        <option value="">روز</option>
        {Array.from({ length: dayCount }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select value={month ?? ""} onChange={(e) => onMonthChange(Number(e.target.value))} className={fieldClass(hasError)} disabled={disabled}>
        <option value="">ماه</option>
        {JALALI_MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>{name}</option>
        ))}
      </select>

      <select value={year ?? ""} onChange={(e) => onYearChange(Number(e.target.value))} className={fieldClass(hasError)} disabled={disabled}>
        <option value="">سال</option>
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

export { fieldClass };