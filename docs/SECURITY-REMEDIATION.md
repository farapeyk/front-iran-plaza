# رفع مشکلات پس از baseline P1

Next/eslint-config-next 16.4.0 و React/DOM 19.2.8 با pnpm frozen نصب و بررسی شدند. CLI کامل shadcn حذف شد؛ CSS مورد استفاده در src/styles/shadcn.css و مجوز آن در [MIT](../licenses/shadcn-MIT.txt) محفوظ است. کامپوننت‌های shadcn/Base UI به CLI runtime وابسته نیستند. fast-uri، brace-expansion و prosemirror-view با override محدود به نسخه اصلاح‌شده می‌رسند.

در ۲۰۲۶-۱۰-۱۳، `braces` از dependencies مستقیم حذف شد و dependency محدود `@next/eslint-plugin-next>fast-glob` به `tinyglobby@0.2.17` نگاشت شد. تنها مصرف این dependency در افزونه Next، `globSync` برای کشف دایرکتوری‌هاست؛ API سازگار حفظ می‌شود. کل زنجیره micromatch/braces و patch قبلی حذف شدند. audit اکنون صفر مورد و exit 0 دارد. [تست رگرسیون](../tests/glob-security.test.cjs) glob دارای brace، مسیر مطلق، حذف فایل از نتایج و fallback دایرکتوری را با خود افزونه بررسی می‌کند؛ lint واقعی نیز کنترل می‌شود. هیچ advisory نادیده گرفته یا نسخه package جعلی معرفی نشده است.

QA تاریخیِ اصلاح امنیتی اولیه شامل build/typecheck/lint، ۲۷ تست و production HTTP fixture بود؛ این نتیجه به‌تنهایی اثبات سورس جدید نیست. برای هماهنگی قرارداد فعلی، تست baseline نام‌ها/operationها و رفتار عدم دسترسی صفحات اضافه شده است. تست‌های fixture، تأیید backend/DB واقعی نیستند. audit فعلی بدون معافیت موفق است؛ فقط build داکر بک‌اند برای commit/push روی main طبق [گزارش QA](PUSH-QA.md) صریحاً معاف شده است.

`.gitattributes` با `text=auto` پایان‌خط assetهای متنی ویندوز را در Git عادی‌سازی می‌کند؛ معافیت whitespace حذف شده است و `git diff --cached --check` باید بدون خطا باشد.
