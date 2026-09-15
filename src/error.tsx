// src/app/error.tsx
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" dir="rtl">
      <h2 className="text-xl font-bold text-neutral-800">مشکلی پیش آمده است</h2>
      <p className="text-sm text-neutral-500">{error.message || "خطای غیرمنتظره"}</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-emerald-950 text-white rounded-md">
        تلاش مجدد
      </button>
    </div>
  );
}