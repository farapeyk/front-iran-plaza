# CI/CD فرانت production

فایل `.github/workflows/production.yml` با هر push دارای تغییر runtime روی شاخه
`main` اجرا می‌شود. تغییرهای صرفاً Markdown و `docs/` workflow را فعال نمی‌کنند.
برای مصرف کمتر GitHub Actions، کل مسیر QA و deploy در یک job انجام می‌شود و
اجرای هم‌زمان نسخه‌ها با `concurrency` صف‌بندی می‌شود.

ترتیب QA عبارت است از نصب قفل‌شده pnpm، typecheck، lint بدون warning، تست‌های
Node، کنترل بازتولید client API، build production و HTTP fixture production.
پس از QA، runner همان `GITHUB_SHA` را داخل image رسمی `node:24.18.0-alpine` دوباره با pnpm قفل‌شده
build می‌کند و خروجی standalone، static و public را در یک archive runtime قرار می‌دهد. بستهٔ deploy از
`git archive` همان SHA ساخته می‌شود و `deploy/ci/Dockerfile.offline` را همراه این runtime حمل می‌کند؛
بنابراین سرورهای production هیچ Corepack، pnpm install یا Next build اجرا نمی‌کنند و به npm registry
وابسته نیستند. `.env`، cache و dependencyهای build داخل بستهٔ نهایی نیستند و اندازهٔ archive پیش از ارسال
با سقف ۵۱۲ MiB کنترل می‌شود.

انتشار ابتدا روی سرور ایران و بعد روی سرور خارج انجام می‌شود. هر سرور image
مستقل با tag شامل SHA کامل می‌سازد، کانتینر frontend را جایگزین می‌کند، منتظر
health check می‌ماند و صفحه اصلی را روی loopback درخواست می‌کند. در شکست rollout
همان ناحیه به image قبلی برمی‌گردد و ناحیه بعدی اجرا نمی‌شود.

workflow از کلید SSH محدودشده استفاده می‌کند، نه root password. secretهای لازم
`PROD_SSH_PRIVATE_KEY`، `PROD_SSH_KNOWN_HOSTS`، مقصد و پورت هر دو ناحیه‌اند.
جزئیات bootstrap، backup، rollback و فرمان status در سند
`docs/PRODUCTION-CI-CD.md` مخزن بک‌اند ثبت شده‌اند؛ اسکریپت‌های مرجع در
`deploy/ci/` همان مخزن هستند.

اجرای دستی از تب Actions برای recovery یا آزمون secretها ممکن است. اجرای موفق
pipeline تأیید build و smoke داخلی هر دو ناحیه است، نه آزمون SMS، پرداخت یا DNS
از همه شبکه‌های کاربران.

در رخداد ۲۵ اکتبر ۲۰۲۶، QA فرانت موفق بود اما rollout ایران هنگام دانلود
`pnpm-11.18.0.tgz` توسط Corepack با `UND_ERR_HEADERS_TIMEOUT` شکست خورد. بستهٔ standalone آفلاین
بالا دانلود package manager و dependency را از سرور حذف می‌کند؛ نصب و build سازگار با Alpine روی
GitHub Runner انجام می‌شود.
