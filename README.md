# ایران پلازا — فرانت‌اند

دایرکتوری فارسی کسب‌وکارها با Next.js App Router، React، TypeScript و Tailwind.

راهنمای کامل در [docs/README.md](docs/README.md)، تغییرات اصلاحی در [گزارش تغییرات](docs/CHANGES-2026-10-07.md) و پیش‌نیازهای قرارداد در [سازگاری بک‌اند](docs/BACKEND-COMPATIBILITY.md) است.

## اجرای توسعه

Node 24 و pnpm 11.18.0 مرجع ثبت‌شده پروژه‌اند. متغیرهای خصوصی را مطابق [راهنمای راه‌اندازی](docs/SETUP.md) تنظیم کنید؛ secretها را در سورس یا مستندات قرار ندهید.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

سرور توسعه روی http://localhost:3001 اجرا می‌شود. بک‌اند سازگار برای داده‌ها، auth و onboarding لازم است.

## کنترل کیفیت

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

lint هیچ warning را نمی‌پذیرد. تست‌های محلی و fixture HTTP جای آزمون حساب واقعی، SMS یا دیتابیس را نمی‌گیرند. نتایج و محدودیت‌های تازه در گزارش تغییرات ثبت شده‌اند.

## اجرای production

```powershell
pnpm start -- -p 3001
```

HTTPS و تنظیم معتبر BACKEND_INTERNAL_URL و JWT_ACCESS_SECRET لازم است. SITE_URL دامنه واقعی canonical و sitemap را تعیین می‌کند. پیش از استقرار، اختلاف‌های onboarding با بک‌اند را برطرف کنید.
