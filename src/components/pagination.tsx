import Link from 'next/link';

export function Pagination({ base, page, total, take }: { base: string; page: number; total: number; take: number }) {
  const pages = Math.max(1, Math.ceil(total / take));
  return <nav aria-label="صفحه‌بندی" className="mt-6 flex items-center justify-center gap-4 text-sm">
    {page > 1 && <Link href={`${base}?page=${page-1}`} className="text-emerald-800 underline">قبلی</Link>}
    <span>صفحه {page.toLocaleString('fa-IR')} از {pages.toLocaleString('fa-IR')}</span>
    {page < pages && <Link href={`${base}?page=${page+1}`} className="text-emerald-800 underline">بعدی</Link>}
  </nav>;
}
