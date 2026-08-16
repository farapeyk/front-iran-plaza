import Link from "next/link";
import { Check } from "lucide-react";

export function SuccessStep() {
  return (
    <div className="flex flex-col items-center text-center py-6" dir="rtl">
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
        <Check className="text-emerald-700" size={28} />
      </div>

      <h2 className="text-lg font-bold text-neutral-900">ثبت نام شما با موفقیت انجام شد</h2>
      <p className="text-sm text-neutral-500 mt-2 max-w-xs">
        اطلاعات شما به‌زودی بررسی خواهد شد و پس از تایید، پروفایل VIP یک‌ماهه برای شما فعال خواهد شد.
      </p>

      <div className="w-full space-y-2 mt-6">
        <Link
          href="/dashboard/business"
          className="w-full inline-flex items-center justify-center rounded-md bg-emerald-950 text-white h-10 px-4 font-medium hover:bg-emerald-900 transition-colors"
        >
          برو به پروفایل من
        </Link>
        <Link
          href="/dashboard"
          className="w-full inline-flex items-center justify-center rounded-md border border-input h-10 px-4 font-medium hover:bg-neutral-50 transition-colors"
        >
          بازگشت به صفحه خانه
        </Link>
      </div>
    </div>
  );
}