import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <Button asChild className="w-full">
          <Link href="/dashboard/business">برو به پروفایل من</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard">بازگشت به صفحه خانه</Link>
        </Button>
      </div>
    </div>
  );
}