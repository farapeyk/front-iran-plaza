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

## Production cache permissions (2026-11-20)

Both production Dockerfiles create `/app/.next/cache` and assign it to `node:node` before switching to `USER node`. Ownership of files extracted below `/app` alone does not make a newly created parent directory writable. A missing writable cache caused `EACCES` during image optimization and interrupted HTTP responses. The live directories were repaired on both regions. `tests/production-deployment.test.cjs` guards both image definitions; production HTTP image requests are checked separately from these source assertions.

Validation: `npm test` passed 166 tests; `npm run typecheck` and `npm run lint` passed. `npm run build` completed successfully on retry. The first build stopped after compiling to show Next.js's security upgrade reminder; the retry continued with that warning. The installed Next.js version still needs a security upgrade; no dependency change is included in this cache-permission repair. A Docker build of the actual offline Dockerfile with a minimal runtime probe passed, and `docker run --rm iranplaza/cache-permission-qa:20261120` confirmed `nonroot-image-cache-write=ok`. That probe checks permissions, not the complete app. Five real public optimizer requests passed HTTP/2 200 after the live cache and backend recovery repairs.
