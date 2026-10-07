# راه‌اندازی و استقرار

تمام فرمان‌ها از ریشه `front-iran-plaza` اجرا می‌شوند. پروژه برای اجرا به بک‌اند سازگار و متغیرهای محیطی نیاز دارد.

## نصب و اجرای توسعه

مرجع نصب فقط `pnpm-lock.yaml` با `pnpm@11.18.0` است. Node دقیق `24.18.0` در `.node-version` و بازه `>=24.18.0 <25` در manifest ثبت شده است. lockfile قدیمی npm در artifacts محلی آرشیو و از سورس فرانت حذف شد.

```powershell
pnpm install --frozen-lockfile
# فقط در صورت نداشتن فایل خصوصی موجود:
Copy-Item .env.example .env.local
pnpm dev
```

نمونه env فاقد کلید واقعی است؛ placeholder را در فایل خصوصی جایگزین کنید و فایل موجود را overwrite نکنید. توسعه با `next dev --turbopack -p 3001` روی `http://localhost:3001` اجرا می‌شود. `turbopack.root` در next.config.ts به ریشه همین برنامه محدود شده تا resolution در workspace و کپی ایزوله قابل تکرار باشد. نصب clean، build، typecheck، lint و تست‌ها در کپی ایزوله P1 موفق شدند؛ اتصال عملیاتی دیتابیس و بک‌اند هنوز پذیرفته نشده است.

## متغیرهای محیطی

نام‌ها از مصرف مستقیم `process.env` در سورس استخراج شده‌اند. مقادیر زیر فقط نمونه‌اند؛ تنظیمات محیطی برای کنترل HTTP توسط Node بارگذاری شدند، ولی هیچ مقدار محرمانه‌ای وارد مستندات یا خروجی نشده است.

```dotenv
BACKEND_INTERNAL_URL=http://localhost:3000
JWT_ACCESS_SECRET=replace-with-the-backend-access-secret
# Optional: real production origin for canonical URLs and sitemap
SITE_URL=https://example.com
```

| نام | کاربرد و الزام |
| --- | --- |
| `BACKEND_INTERNAL_URL` | URL پایه قابل دسترس از سرور Next؛ مسیرهای actionها معمولاً خودشان `/api` را اضافه می‌کنند. پایه را بدون `/api` و ترجیحاً بدون `/` انتهایی تنظیم کنید. |
| `JWT_ACCESS_SECRET` | کلید بررسی امضای access token؛ باید با بک‌اند تطابق داشته باشد و فقط سمت سرور بماند. |
| `SITE_URL` | اختیاری؛ origin واقعی سایت برای metadataBase و sitemap، فقط سمت سرور. پیش از build تنظیم شود؛ robots و sitemap فعلاً ایستا تولید می‌شوند. |
| `NODE_ENV` | در production باعث `secure: true` در کوکی‌ها می‌شود؛ محیط production باید HTTPS داشته باشد. |

هیچ‌کدام از دو مقدار اختصاصی بالا نباید با پیشوند `NEXT_PUBLIC_` منتشر شوند. `.gitignore` فایل‌های خصوصی `.env*` را نادیده می‌گیرد؛ `.env.example` قابل versioning است. برای راه‌اندازی، این نمونه را در فایل محیطی خصوصی خود وارد کنید و مقدار placeholder را با تنظیم معتبر جایگزین کنید.

## فرمان‌های پروژه

| فرمان | کاربرد |
| --- | --- |
| `npm run dev` | توسعه با Turbopack روی پورت ۳۰۰۱ |
| `npm run lint` | اجرای ESLint روی پروژه |
| `npx --no-install tsc --noEmit --incremental false` | بررسی TypeScript بدون تولید خروجی و cache افزایشی |
| `node --test tests/onboarding.test.cjs` | تست‌های اولیه onboarding؛ suite کامل با npm test اجرا می‌شود |
| `npm run build` | تولید build با Next.js |
| `npm run start -- -p 3001` | اجرای build روی پورت تعیین‌شده |

scriptهای `test` و `typecheck` اضافه شده‌اند: `npm test` و `npm run typecheck`. lint با `--max-warnings=0` اجرا می‌شود. `npm run start` به‌تنهایی پورت ۳۰۰۱ را در script مشخص نمی‌کند؛ پورت استقرار را صریح تعیین کنید.

`npm run test:production` پس از build، صفحه جزئیات مدیر را با Next production و بک‌اند fixture مستقل بررسی می‌کند؛ سرویس و حساب واقعی را تغییر نمی‌دهد.

## ملاحظات استقرار

۱. بک‌اند باید endpointها و فیلدهای مورد انتظار، به‌ویژه `onboardingStep` و endpoint پیشرفت، را فراهم کند.
۲. dependencyها را با lockfile انتخاب‌شده نصب و QA تغییرات runtime را اجرا کنید.
۳. متغیرهای محیطی خصوصی را در محیط build/runtime لازم در دسترس قرار دهید.
۴. `npm run build` و سپس `npm run start -- -p 3001` را با مدیر سرویس زیرساخت اجرا کنید.
۵. دسترسی داخلی به بک‌اند، HTTPS، refresh نشست، فایل‌ها و نقشه را با حساب آزمایشی بررسی کنید.

تنظیم `serverActions.bodySizeLimit` در `next.config.ts` برابر `25mb` است. برخی آپلودها در UI سقف ۲۰ مگابایت دارند؛ سقف reverse proxy، بک‌اند و storage نیز باید هماهنگ باشد. `allowedDevOrigins` شامل یک IP ثابت توسعه است؛ آن را برای محیط واقعی بررسی کنید. در `pnpm-workspace.yaml` تنظیمات build dependencyها وجود دارد و تعارض فهرست ignored با مجوز build برطرف شده است.

## عیب‌یابی

| علامت | بررسی پیشنهادی |
| --- | --- |
| رفتن مکرر به login | تطابق کلید JWT، انقضای توکن، HTTPS و مهاجرت refresh cookie قدیمی به Path جدید `/` |
| دسته‌بندی خالی | پاسخ `/api/categories`؛ UI بعضی خطاها را به فهرست خالی تبدیل می‌کند |
| خطای پیشرفت مرحله | POST silent-refresh، سپس POST onboarding و بازه صحیح `onboardingStep` |
| تصاویر یا مدارک نمایش داده نمی‌شوند | پاسخ واقعی `/api/backend/files/{id}` و مجوز فایل در بک‌اند |
| اعلان‌ها خالی‌اند | مسیر یکدست `/api/notifications`؛ هر دو شکل در controller محلی پشتیبانی می‌شوند |
| route پیدا نمی‌شود | [جدول مسیرها](ROUTES.md)؛ لینک منو لزوماً صفحه پیاده‌سازی‌شده ندارد |
