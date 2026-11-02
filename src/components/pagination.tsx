import Link from 'next/link';

function pageHref(base: string, page: number, query: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
  params.set('page', String(page));
  return `${base}?${params}`;
}

export function Pagination({ base, page, total, take, query = {} }: { base: string; page: number; total: number; take: number; query?: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / take));
  return <nav aria-label="صفحه‌بندی" className="mt-6 flex items-center justify-center gap-4 text-sm">
    {page > 1 && <Link href={pageHref(base, page - 1, query)} className="text-emerald-800 underline">قبلی</Link>}
    <span>صفحه {page.toLocaleString('fa-IR')} از {pages.toLocaleString('fa-IR')}</span>
    {page < pages && <Link href={pageHref(base, page + 1, query)} className="text-emerald-800 underline">بعدی</Link>}
  </nav>;
}
