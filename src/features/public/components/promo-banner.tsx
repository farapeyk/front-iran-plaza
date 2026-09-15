import Link from "next/link";
import { Plus } from "lucide-react";

export function PromoBanner() {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl px-6 py-5 flex-wrap"
      style={{ background: "linear-gradient(135deg, #0F3D2E 0%, #173F2C 100%)" }}
      dir="rtl"
    >
      <p className="text-white text-sm">ثبت نام امروز = ۳۰ روز پروفایل VIP رایگان</p>
      <Link href="/dashboard/business/new" className="flex items-center gap-1.5 bg-amber-100 text-emerald-950 text-sm font-bold rounded-full px-4 py-2 hover:bg-amber-50">
        ثبت نام رایگان
        <Plus size={16} />
      </Link>
    </div>
  );
}