"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export function TooManyRequestsNotice({ onRetry }: { onRetry?: () => void }) {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-5 py-12 text-[#18352b]" dir="rtl">
      <section className="w-full max-w-lg rounded-3xl border border-[#e3e9e2] bg-white p-8 text-center shadow-sm sm:p-12">
        <div aria-hidden="true" className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#eef5ed] text-3xl">⏳</div>
        <p className="mb-3 text-sm font-semibold text-[#64816f]">ایران پلازا</p>
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">درخواست‌ها زیاد شده‌اند</h1>
        <p className="mb-8 leading-8 text-[#53665b]">
          به دلیل تعداد بالای درخواست‌ها، سرویس موقتاً در دسترس نیست. لطفاً چند دقیقهٔ دیگر دوباره بررسی کنید.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry ?? (() => router.refresh())}
            className="rounded-xl bg-[#18352b] px-6 py-3 font-semibold text-white transition hover:bg-[#285240] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18352b]"
          >
            تلاش دوباره
          </button>
          <Link href="/" className="rounded-xl border border-[#d8e1d8] px-6 py-3 font-semibold text-[#18352b] transition hover:bg-[#f7f8f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18352b]">
            بازگشت به صفحهٔ اصلی
          </Link>
        </div>
      </section>
    </main>
  );
}
