import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#082D1C] text-white pt-16 pb-8 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-[#E8D4B0]">Iran Plaza</h3>
          <p className="text-xs text-emerald-100/70 leading-relaxed">
            مرجع معرفی بهترین کسب و کارهای ایران. با ما کسب و کار خود را به میلیون‌ها مخاطب معرفی کنید.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#E8D4B0] mb-4">دسترسی سریع</h4>
          <ul className="space-y-2 text-xs text-emerald-100/80">
            <li><Link href="/">صفحه اصلی</Link></li>
            <li><Link href="/categories">دسته‌بندی‌ها</Link></li>
            <li><Link href="/articles">مقالات</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#E8D4B0] mb-4">راهنمای کاربران</h4>
          <ul className="space-y-2 text-xs text-emerald-100/80">
            <li><Link href="/faq">سوالات متداول</Link></li>
            <li><Link href="/terms">قوانین و مقررات</Link></li>
            <li><Link href="/about">درباره ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#E8D4B0] mb-4">نمادهای اعتماد</h4>
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-[10px] text-emerald-200">
              اینماد
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-[10px] text-emerald-200">
              ساماندهی
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 text-center text-xs text-emerald-200/50">
        تمامی حقوق مادی و معنوی متعلق به ایران پلازا می‌باشد.
      </div>
    </footer>
  );
}