import { Plus, User, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import type { BusinessProfile } from "@/features/business/types/business-profile";

interface DashboardUserCardProps {
  fullName: string | null;
  phone: string;
  business: BusinessProfile | null;
}

export function DashboardUserCard({ fullName, phone, business }: DashboardUserCardProps) {
  return (
    <div className="px-5 pt-6">
      <div className="rounded-3xl p-6 bg-white shadow-sm border border-neutral-100">
        <Link href="/dashboard/profile" className="flex items-center gap-4 mb-6 group">
          <div className="w-16 h-16 rounded-2xl bg-[#0F6B62] flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform">
            {fullName ? fullName.charAt(0) : <User size={28} />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-neutral-900">{fullName || "کاربر ایران پلازا"}</p>
            <p className="text-sm text-neutral-500 mt-1" dir="ltr">{phone}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-[#0F6B62]/10">
            <User className="text-neutral-500 group-hover:text-[#0F6B62] transition-colors" size={16} />
          </div>
        </Link>

        {business ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
              <span className="text-sm text-neutral-600">وضعیت کسب‌وکار</span>
              {business.status === "APPROVED" && (
                <span className="flex items-center gap-1 text-sm font-bold text-[#0F6B62]">
                  <CheckCircle2 size={16} /> تایید شده
                </span>
              )}
              {business.status === "PENDING" && (
                <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                  <Clock size={16} /> در انتظار بررسی
                </span>
              )}
              {business.status === "REJECTED" && (
                <span className="flex items-center gap-1 text-sm font-bold text-red-600">
                  <AlertCircle size={16} /> رد شده
                </span>
              )}
            </div>

            {business.status === "REJECTED" && (
              <div className="p-3 border border-red-200 bg-red-50 rounded-xl space-y-2">
                <p className="text-xs font-bold text-red-700">دلیل رد شدن:</p>
                <p className="text-xs text-red-600">{business.rejectionReason || "مدارک ارسالی نامعتبر هستند."}</p>
                <Link 
                  href="/dashboard/business/documents" 
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <AlertCircle size={16} />
                  بارگذاری مجدد مدارک
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
              <span className="text-sm text-neutral-600">وضعیت کسب‌وکار</span>
              <span className="text-sm font-bold text-amber-600">ثبت نشده</span>
            </div>
            <Link href="/dashboard/business/new" className="w-full rounded-full bg-emerald-950 text-white py-3 flex items-center justify-center gap-2 font-bold hover:bg-emerald-900 transition-colors">
              ثبت رایگان کسب‌وکار
              <Plus size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}