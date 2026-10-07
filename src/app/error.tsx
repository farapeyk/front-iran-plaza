"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" dir="rtl">
    <h1 className="text-xl font-bold">دریافت اطلاعات انجام نشد</h1>
    <p className="text-sm text-neutral-600">لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید.</p>
    <button onClick={reset} className="px-4 py-2 bg-emerald-950 text-white rounded-md">تلاش مجدد</button>
  </main>;
}
