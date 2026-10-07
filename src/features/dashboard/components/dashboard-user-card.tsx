import { Plus, User, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import type { BusinessProfile } from "@/features/business/types/business-profile";
import { PROFILE_STEPS, profileStepUrl } from "@/features/business/lib/onboarding-steps";

interface DashboardUserCardProps {
  fullName: string | null;
  phone: string;
  business: BusinessProfile | null;
  needsRegistration?: boolean;
}

export function DashboardUserCard({ fullName, phone, business, needsRegistration = false }: DashboardUserCardProps) {
  const savedStep = business?.onboardingStep;
  const isProfileIncomplete = savedStep !== undefined && savedStep >= 0 && savedStep < PROFILE_STEPS.length;
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
            {needsRegistration && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                <p className="font-bold text-sm">ثبت اولیه کسب‌وکار و مدارک شما هنوز کامل نشده است</p>
                <p className="text-xs leading-6">مشخصات کسب‌وکار، اطلاعات هویتی و سه مدرک را تکمیل و در پایان تأیید کنید.</p>
                <Link href="/dashboard/business/new" className="inline-flex w-full justify-center rounded-xl bg-emerald-950 p-3 text-sm font-bold text-white">ادامه ثبت و ارسال برای تأیید ادمین</Link>
              </div>
            )}
            {!needsRegistration && business.status !== 'APPROVED' && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">دسترسی به پروفایل پس از تأیید کسب‌وکار توسط ادمین فعال می‌شود.</p>}
            {isProfileIncomplete && !needsRegistration && business.status === 'APPROVED' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                <p className="font-bold text-sm text-emerald-950">پروفایل {business.name} هنوز کامل نشده است</p>
                <p className="text-sm text-emerald-900">
                  مرحله {savedStep + 1} از {PROFILE_STEPS.length}: {PROFILE_STEPS[savedStep].title}
                </p>
                <p className="text-xs leading-6 text-emerald-900">اطلاعات ذخیره‌شده شما محفوظ است؛ تکمیل پروفایل را از همین مرحله ادامه دهید.</p>
                <Link href={profileStepUrl(savedStep)} className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-950 px-3 py-3 text-sm font-bold text-white hover:bg-emerald-900">
                  این پروفایل را تکمیل کنید
                </Link>
              </div>
            )}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
              <span className="text-sm text-neutral-600">وضعیت کسب‌وکار</span>
              {business.status === "APPROVED" && (
                <span className="flex items-center gap-1 text-sm font-bold text-[#0F6B62]">
                  <CheckCircle2 size={16} /> تایید شده
                </span>
              )}
              {business.status === "PENDING" && (
                <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                  <Clock size={16} /> {needsRegistration ? 'ثبت اولیه ناقص' : 'در انتظار بررسی'}
                </span>
              )}
              {business.status === "REJECTED" && (
                <span className="flex items-center gap-1 text-sm font-bold text-red-600">
                  <AlertCircle size={16} /> رد شده
                </span>
              )}
              {business.status === "SUSPENDED" && <span className="text-sm font-bold text-red-600">معلق شده</span>}
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
