import { Eye, Phone, Globe, Heart } from "lucide-react";

interface AnalyticsData {
  VIEW_BUSINESS?: number;
  CLICK_PHONE?: number;
  CLICK_WEBSITE?: number;
  ADD_FAVORITE?: number;
}

const STATS = [
  { key: "VIEW_BUSINESS" as const, label: "بازدید پروفایل", icon: Eye },
  { key: "CLICK_PHONE" as const, label: "کلیک تماس", icon: Phone },
  { key: "CLICK_WEBSITE" as const, label: "کلیک وب‌سایت", icon: Globe },
  { key: "ADD_FAVORITE" as const, label: "افزوده‌شده به علاقه‌مندی", icon: Heart },
];

export function AnalyticsCards({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-2 gap-3" dir="rtl">
      {STATS.map(({ key, label, icon: Icon }) => (
        <div key={key} className="bg-white border border-neutral-200 rounded-lg p-4">
          <Icon className="text-emerald-800 mb-2" size={20} />
          <p className="text-2xl font-bold text-neutral-900">{(data[key] ?? 0).toLocaleString("fa-IR")}</p>
          <p className="text-xs text-neutral-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
