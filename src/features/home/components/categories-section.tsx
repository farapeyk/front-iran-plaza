import Link from 'next/link';
import { backendGet } from '@/lib/api/backend-get';
import type { CategorySummary } from '@/features/public/types/public-business';

export async function CategoriesSection() {
  let categories: CategorySummary[] = [];
  let unavailable = false;
  try { categories = await backendGet<CategorySummary[]>('/api/categories'); }
  catch { unavailable = true; }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-[#0B3C26] mb-2">دسته‌بندی کسب و کارها</h2>
      <div className="w-12 h-1 bg-[#C39E67] mx-auto mb-10 rounded-full" />

      {unavailable && <p role="status" className="text-sm text-amber-800 mb-4">دریافت دسته‌بندی‌ها انجام نشد. <Link href="/businesses" className="underline">مرور کسب‌وکارها</Link></p>}
      {!unavailable && categories.length === 0 && <p className="text-sm text-neutral-500">هنوز دسته‌بندی ثبت نشده است.</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <Link href={"/businesses?categoryId=" + encodeURIComponent(cat.id)}
            key={cat.id} 
            className="flex flex-col items-center p-4 rounded-2xl border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer bg-white group"
          >
            {/* Circle Icon Placeholder */}
            <div className="w-16 h-16 rounded-full bg-[#FAF3E0] group-hover:bg-[#E8D4B0] flex items-center justify-center mb-3 transition-colors">
              <div className="w-8 h-8 bg-[#C39E67] rounded-md opacity-80" />
            </div>
            <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}