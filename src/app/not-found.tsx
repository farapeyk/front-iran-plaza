import Link from 'next/link';
export default function NotFoundPage() {
  return <main dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-xl font-bold">صفحه پیدا نشد</h1>
    <Link href="/businesses" className="text-emerald-800 underline">مرور کسب‌وکارها</Link>
  </main>;
}
