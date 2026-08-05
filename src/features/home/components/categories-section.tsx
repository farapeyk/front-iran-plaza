const categories = [
  { id: 1, title: "فن‌آوری و دیجیتال" },
  { id: 2, title: "املاک" },
  { id: 3, title: "پوشاک" },
  { id: 4, title: "پزشکی" },
  { id: 5, title: "زیبایی و سلامت" },
  { id: 6, title: "خدمات ساختمانی" },
  { id: 7, title: "رستوران و کافه" },
  { id: 8, title: "لوازم خانگی" },
  { id: 9, title: "خودرو" },
  { id: 10, title: "آموزش" },
];

export function CategoriesSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-[#0B3C26] mb-2">دسته‌بندی کسب و کارها</h2>
      <div className="w-12 h-1 bg-[#C39E67] mx-auto mb-10 rounded-full" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="flex flex-col items-center p-4 rounded-2xl border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer bg-white group"
          >
            {/* Circle Icon Placeholder */}
            <div className="w-16 h-16 rounded-full bg-[#FAF3E0] group-hover:bg-[#E8D4B0] flex items-center justify-center mb-3 transition-colors">
              <div className="w-8 h-8 bg-[#C39E67] rounded-md opacity-80" />
            </div>
            <span className="text-sm font-semibold text-gray-800">{cat.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}