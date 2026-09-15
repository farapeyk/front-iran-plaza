// src/app/(dashboard)/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="w-8 h-8 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}