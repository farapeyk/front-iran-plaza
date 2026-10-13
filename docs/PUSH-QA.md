# بررسی پیش از push — ۲۰۲۶-۱۰-۱۳

درخواست کاربر commit/push هر دو مخزن روی `main` است. موانع امنیتی و قرارداد رفع شدند. در ۲۰۲۶-۱۰-۱۳ کاربر صریحاً گفت: «بله؛ فقط Docker معاف شود و هر دو روی main push شوند». این معافیت فقط build داکر بک‌اند برای همین commit/push را پوشش می‌دهد؛ هیچ بررسی دیگری معاف نشده است. build کانتینر همچنان مسدود و اجرا‌نشده است و موفق گزارش نمی‌شود.

## اصلاحات

- حذف زنجیره آسیب‌پذیر braces و patch قدیمی؛ جایگزینی dependency محدود Next lint با tinyglobby سازگار. تست glob و lint واقعی حفظ شدند؛ advisory مخفی نشده است.
- قرارداد کامل از بک‌اند فعلی، بدون endpointهای حذف‌شده مقالات/تیکت/سوابق پرداخت؛ بازتولید Orval و baseline ثابت نام‌ها/۱۱۴ operation. جزئیات [هماهنگی](DESIGN-TRANSFER.md).
- صفحات فاقد API، عدم دسترسی را نشان می‌دهند؛ فرم تیکت و فیلتر VIP/رسانه غیرفعال‌اند. مقاله ناموجود ۴۰۴ است و بخش موقت مقالات noindex و خارج از sitemap است.
- مولد قرارداد بک‌اند فیلدهای synthetic Prisma را حفظ می‌کند. گزارش‌ها و لاگ‌های مدیریتی فقط فیلدهای نمایشی کاربران مرتبط را می‌خوانند؛ رمز و سهمیه BigInt دریافت نمی‌شوند. migration یا API جدید اضافه نشده است.

## بررسی همین نسخه

| فرمان/بررسی | نتیجه |
| --- | --- |
| فرانت: `pnpm install --frozen-lockfile` و `pnpm run build` | موفق، روی کپی ایزوله بدون env خصوصی |
| فرانت: `pnpm run typecheck`، `pnpm run lint` و `pnpm test` | موفق؛ ۳۴ تست |
| فرانت: `pnpm run api:check` | موفق؛ بازتولید دقیق کلاینت |
| فرانت: `pnpm audit --json` | موفق؛ صفر آسیب‌پذیری |
| فرانت: `pnpm run test:production` | موفق؛ HTTP واقعی با سرویس fixture، شامل حالت عدم دسترسی بدون درخواست به API حذف‌شده |
| مرورگر: `pnpm exec playwright test --config playwright.reference.config.ts` | هر ۸ تست موفق روی سه صفحه مرجع در چهار عرض؛ پس از آخرین اصلاح متن راهنما نیز build/production/browser دوباره موفق بودند |
| بک‌اند: Prisma generate، build، typecheck، lint و Jest | موفق؛ ۷۷ تست در ۱۲ suite روی کپی ایزوله با dependencyهای lockfile |
| قرارداد بک‌اند: `scripts/qa-api.cjs` | هر ۲۶ کنترل موفق؛ strict spec، baseline نام/operation، reference، DTO، multipart binary، پارامتر مسیر، خطاهای تجاری و HTTP upload/download/payment URL |
| بک‌اند: `npm audit --json` | موفق؛ صفر آسیب‌پذیری |
| Git staged diff و whitespace | بررسی‌شده؛ env خصوصی، node_modules، build و خروجی تست خارج از index |
| Docker registry | tag پایه Node موجود است؛ پاسخ HTTP ۲۰۰ |
| `docker build` | مسدود؛ موتور Linux در دسترس نیست و مجازی‌سازی BIOS خاموش است |

تست‌های مرورگر/production و قرارداد از fixture استفاده می‌کنند؛ تأیید دیتابیس، Redis، پیامک، درگاه واقعی یا release نیستند. suite گسترده انتقال که نیازمند محیط کامل تست است به‌عنوان موفق گزارش نشده است. بررسی سه صفحه مرجع در چهار عرض و رگرسیون‌های همین اصلاح اجرا شد؛ تصاویر فهرست دسکتاپ و پروفایل موبایل نیز بازبینی شدند.

نصب اولیه dependencyهای محلی بک‌اند قدیمی بود؛ نتایج ناموفق آن برای QA موفق استفاده نشده‌اند. نصب محلی بازیابی شد؛ فایل DLL Prisma قفل بود، بنابراین سایر فایل‌های generated client از نسخه ایزوله همسان بازیابی شدند و hash موتور یکسان بود. Prisma بدون درخواست به دیتابیس بارگذاری شد؛ lockfile تغییر نکرد.

تنظیم TypeScript بک‌اند از بررسی کپی قدیمی داخل `artifacts` و فایل‌های موقت جلوگیری می‌کند. typecheck محلی و هر ۱۳ تست JWT/رمز پس از بازیابی نصب پاس شدند. build/typecheck/lint و suite کامل ۷۷ تست بک‌اند با همین تنظیم نهایی در کپی ایزوله دوباره موفق شدند.

پس از آماده‌شدن Docker، همان revision باید در محیط ایزوله build و smoke شود. معافیت صریح فعلی تأیید runtime لینوکس/Alpine، Prisma/bcrypt کانتینر یا زیرساخت واقعی نیست. سورس پیش از commit با hash نسخه تست‌شده مقایسه شد و تغییر runtime تازه‌ای نداشت؛ main هر دو مخزن ancestor شاخه dev بود و انتقال بدون تعارض یا بازنویسی تاریخچه انجام می‌شود.
