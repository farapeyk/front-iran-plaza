# نمایش و بهینه‌سازی تصاویر

تمام تصویرهای رابط کاربری با `next/image` رندر می‌شوند. رفتار پیش‌فرض lazy loading فعال است؛ تصاویر LCP فقط در صورت اندازه‌گیری و تصمیم صریح باید `preload` یا `loading="eager"` بگیرند. تصاویر responsive دارای `sizes` و ابعاد intrinsic هستند تا مرورگر فایل متناسب را دریافت کند و layout shift کاهش یابد.

`next.config.ts` خروجی Image Optimizer را روی WebP و کیفیت ۹۰ محدود می‌کند. فایل‌های raster داخل `public/design` و markerهای local نقشه نیز از PNG/JPEG به WebP تبدیل شده‌اند. SVGها برداری باقی می‌مانند و `next/image` آن‌ها را بدون rasterize کردن ارائه می‌کند. کاشی‌های خارجی OpenStreetMap تحت کنترل این مخزن نیستند و URL فرمت آن‌ها تغییر نکرده است.

تصاویر عمومی `FileAsset` از مسیر `/api/backend/files/:id` وارد Image Optimizer می‌شوند و variant متناسب با viewport می‌گیرند. تصویرهای خصوصی پنل، previewهای blob و منابع نیازمند cookie با `unoptimized` استفاده می‌شوند؛ این حالت همچنان از lazy loading و ابعاد پایدار `next/image` بهره می‌برد و فایل اصلی از بک‌اند از قبل WebP است. حذف `unoptimized` از منبع خصوصی باعث می‌شود fetch داخلی Image Optimizer بدون cookie با 401/403 شکست بخورد.

## قواعد توسعه

- تگ خام `<img>` اضافه نکنید؛ از `Image` در `next/image` استفاده کنید.
- برای تصویر محتوایی `width`/`height` و `sizes` واقعی یا `fill` داخل parent دارای `position: relative` تعیین کنید.
- برای SVG، blob و فایل خصوصی `unoptimized` فقط در صورت نیاز تنظیم شود.
- asset raster تازه را پیش از commit به `.webp` تبدیل و تمام ارجاع‌ها و fixtureهای تست را هم‌زمان اصلاح کنید.
- تصاویر ویرایش‌شده در کراپ client مستقیماً با WebP و کیفیت ۹۲ ساخته می‌شوند تا encode اتلافی دوباره رخ ندهد. سایر تصاویر آپلودی کاربر در بک‌اند به WebP تبدیل می‌شوند؛ اعتبارسنجی client-side جای اعتبارسنجی و decode سرور نیست.

## QA

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

علاوه بر فرمان‌ها، صفحات خانه، فهرست، پروفایل کسب‌وکار، مقاله، ثبت‌نام و previewهای خصوصی را در mobile/desktop بازبینی کنید. در Network باید تصاویر محتوایی پایین صفحه lazy باشند، پاسخ variantهای `/_next/image` دارای `Content-Type: image/webp` باشد و فایل خصوصی بدون خطای احراز هویت نمایش داده شود.
