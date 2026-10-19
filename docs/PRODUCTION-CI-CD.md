# CI/CD فرانت production

فایل `.github/workflows/production.yml` با هر push دارای تغییر runtime روی شاخه
`main` اجرا می‌شود. تغییرهای صرفاً Markdown و `docs/` workflow را فعال نمی‌کنند.
برای مصرف کمتر GitHub Actions، کل مسیر QA و deploy در یک job انجام می‌شود و
اجرای هم‌زمان نسخه‌ها با `concurrency` صف‌بندی می‌شود.

ترتیب QA عبارت است از نصب قفل‌شده pnpm، typecheck، lint بدون warning، تست‌های
Node، کنترل بازتولید client API، build production و HTTP fixture production.
فقط archive همان `GITHUB_SHA` که این کنترل‌ها را گذرانده به سرورها ارسال می‌شود؛
`.env`، dependency، cache و خروجی build داخل archive نیستند.

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
