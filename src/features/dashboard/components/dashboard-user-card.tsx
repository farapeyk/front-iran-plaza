import { Plus, User } from "lucide-react";
import Link from "next/link";

interface DashboardUserCardProps {
  fullName: string | null;
  phone: string;
  hasBusiness: boolean;
}

export function DashboardUserCard({ fullName, phone, hasBusiness }: DashboardUserCardProps) {
  return (
    <div className="px-5 pt-6">
      <div className="rounded-3xl p-6 bg-white shadow-sm border border-neutral-100">
        {/* لینک کردن بخش پروفایل به صفحه ویرایش */}
        <Link href="/dashboard/profile" className="flex items-center gap-4 mb-6 group">
          <div className="w-16 h-16 rounded-2xl bg-[#0F6B62] flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform">
            {fullName ? fullName.charAt(0) : <User size={28} />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-neutral-900">{fullName || "کاربر ایران پلازا"}</p>
            <p className="text-sm text-neutral-500 mt-1" dir="ltr">{phone}</p>
          </div>
          {/* آیکون ویرایش */}
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-[#0F6B62]/10">
            <User className="text-neutral-500 group-hover:text-[#0F6B62] transition-colors" size={16} />
          </div>
        </Link>

        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
          <span className="text-sm text-neutral-600">وضعیت کسب‌وکار</span>
          <span className={`text-sm font-bold ${hasBusiness ? "text-[#0F6B62]" : "text-amber-600"}`}>
            {hasBusiness ? "تایید شده" : "ثبت نشده"}
          </span>
        </div>

        {!hasBusiness && (
          <Link href="/dashboard/business/new" className="mt-4 w-full rounded-full bg-emerald-950 text-white py-3 flex items-center justify-center gap-2 font-bold hover:bg-emerald-900 transition-colors">
    ثبت رایگان کسب‌وکار
    <Plus size={18} />
         </Link>
        )}
      </div>
    </div>
  );
}