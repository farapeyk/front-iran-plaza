# اتصال Git و ادغام نسخه محلی — ۲۰۲۶-۱۰-۰۷

## دامنه و روش

طبق درخواست کاربر، پوشه فرانت به مخزن `git@github.com:farapeyk/front-iran-plaza.git` متصل شد. تاریخچه موجود از GitHub دریافت شد؛ شاخه‌های remote `main` و `dev` در شروع روی `f8fbf8a6d672b9efb62960e09c095720348027ff` بودند. نسخه محلی بدون جایگزینی فایل‌های سورس، روی این تاریخچه در شاخه `integration/local-front-20261007` قرار گرفت و پس از QA در `dev` با merge بدون fast-forward ادغام می‌شود.

این کار ثبت نسخه محلی موجود در Git است؛ انتقال طراحی فیگما، ایجاد Orval یا اجرای فازهای محصول آغاز نشده است. تغییرات و حذف‌های نسخه محلی، از جمله حذف tracking، analytics و تنظیمات tracking قدیمی، در diff نسبت به remote قابل بازبینی‌اند؛ آن‌ها با فایل‌های قدیمی بازگردانی نشده‌اند. commit تاریخچه remote را حفظ می‌کند و `main` تغییر نمی‌کند. push در این درخواست انجام نمی‌شود.

فایل `.env`، `node_modules`، `.next`، `next-env.d.ts` و cache/build در staging نیستند. هر دو lockfile موجود حفظ شدند؛ pnpm manager اعلام‌شده پروژه و مرجع نصب این QA است. مخزن بک‌اند و طراحی تغییر داده نشدند؛ تست قرارداد بک‌اند فقط artifacts موقت QA را بازتولید کرد.

## اتصال و محدودیت SSH

مقدار خام `remote.origin.url` همان URL درخواستی SSH است. تأیید میزبان ابتدا شکست خورد؛ کلید Ed25519 از [مرجع رسمی GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints) در فایل محلی `.git/github-known-hosts` قرار گرفت و fingerprint آن با مرجع تطبیق داده شد. strict host checking خاموش نشده است.

پس از رفع تأیید میزبان، SSH با `Permission denied (publickey)` رد شد؛ کلید فعلی برای این اتصال مجوز ندارد. به‌جای تغییر کلید خصوصی یا تنظیمات سراسری، rewrite مخصوص همین مخزن در Git config محلی ثبت شد تا URL مذکور فعلاً از HTTPS استفاده کند. `git ls-remote origin` با این fallback موفق است؛ موفقیت read/fetch، مجوز push را اثبات نمی‌کند.

برای استفاده واقعی از SSH، کلید عمومی مناسب باید در حساب مجاز GitHub ثبت شود؛ پس از تأیید دسترسی، rewrite محلی زیر قابل حذف است:

```powershell
git config --unset-all url.https://github.com/farapeyk/front-iran-plaza.git.insteadOf
git ls-remote origin
```

تنظیم host key و rewrite فقط داخل `.git/config`/`.git` هستند و در commit منتشر نمی‌شوند. مقدار `core.autocrlf=false` نیز فقط محلی است تا بررسی اختلاف، تغییر محتوایی را از نویز پایان خط جدا کند.

## QA همین تسک

مرجع: [چک‌لیست پروژه](QA-SPECIALIST-CHECKLIST.md)، مطابق الزام کاربر برای هر تسک؛ نسخه مشترک workspace نیز پیش از کار خوانده شد. بررسی inline انجام شد و نتایج زیر از اجرای تازه‌اند، نه گزارش‌های قبلی.

| فرمان/بررسی | نتیجه |
| --- | --- |
| `pnpm install --frozen-lockfile` با `CI=true` | exit 0؛ dependencyهای موجود نصب شدند، lockfile تغییر نکرد. تلاش اولیه بدون TTY رد شد؛ اجرای CI آن مانع را رفع کرد |
| `pnpm test` | exit 0؛ تمام ۲۶ تست پاس، صفر ناموفق/skip |
| `pnpm lint` | exit 0؛ ESLint با `--max-warnings=0` |
| `pnpm build` | exit 0؛ compile، TypeScript و تولید صفحات موفق |
| `pnpm run typecheck` | exit 0؛ TypeScript مستقل موفق |
| `pnpm run test:production` | exit 0؛ برنامه buildشده از HTTP آزموده شد: هدایت ADMIN/SUPER_ADMIN و صفحه معتبر مدیر با plans=404، همراه ۴۰۴ کسب‌وکار واقعاً ناموجود |
| در بک‌اند: `npm test -- --runInBand test/api-contract.spec.ts` | exit 0؛ سه تست شامل sync پاسخ، قرارداد کامل/HTTP fixture و ورودی‌های نامعتبر پاس |
| staging و `git diff --cached --check` | موفق؛ diff نهایی، مسیرها و حذف‌های محلی بررسی می‌شوند؛ قبل از هر یک از دو commit دوباره کنترل می‌شوند |
| اسکن مسیرهای staged و امضای private key/token با inline Node | موفق؛ هیچ env/build/cache یا امضای شناخته‌شده private key/token وارد staging نشد. این اسکن تضمین عمومی نبود تمام انواع secret نیست |
| مستندات | ارجاع‌های محلی، UTF-8 و fence توسط تست docs کنترل می‌شوند؛ گزارش حاضر نیز پیش از commit بررسی می‌شود |

Build با URL داخلی ایزوله `http://127.0.0.1:1` و secret صرفاً fixture در متغیر محیط همان پردازش اجرا شد؛ مقدار env واقعی چاپ یا تغییر داده نشد. وجود `.env` در خروجی Next فقط بارگذاری معمول فایل توسط build است. تست production نیز backend fixture خودش را اجرا می‌کند و به سرویس پیکربندی‌شده محصول درخواست نمی‌فرستد.

### پنج کنترل قرارداد

| بند | شاهد اجرای تازه |
| --- | --- |
| تولید کامل/اعتبارسنجی و ثبات نام | qa-api از AppModule با validator مستقل، referenceها، operationId یکتا، baseline نام/enum و فیلدهای validated DTO؛ response-contracts نیز drift پاسخ‌ها را کنترل کرد |
| دنبال‌کردن URL واقعی | multipart upload/download و URLهای mock payment با HTTP واقعی به Nest ایزوله؛ تست BFF فرانت نیز HTTP واقعی fixture دارد |
| multipart binary | schema تولیدشده `file` با format binary بررسی شد |
| path identifier | required و string بودن پارامترهای CUID در schema کنترل شد |
| business error و shape | error responseهای فایل/پرداخت و شکل پاسخ‌های موفق و metadata اعتبارسنجی DTO بررسی شد |

این کنترل‌ها از سورس محلی بک‌اند هستند؛ client تولیدشده Orval هنوز وجود ندارد. HTTP واقعی fixture به معنی PostgreSQL/Redis/storage/SMS/درگاه واقعی نیست. baseline بدون بازبینی جایگزین نشده است.

### مرور دامنه‌ها و حدود پذیرش

- backend/security: مسیر BFF، header/cookie forwarding، Origin، refresh، الگوریتم JWT، redirect و کنترل ورودی/فایل مرور شدند؛ regressionهای موجود گذشتند. مجوز نهایی عملیات همچنان با بک‌اند است.
- database: schema/migration در این تسک تغییر ندارد؛ migration QA نامرتبط است. PostgreSQL و Redis واقعی آزموده نشده‌اند و پذیرش استقرار محصول ادعا نمی‌شود.
- UI/UX: مسیرهای مدیر/کاربر، ۴۰۴ اصلی در برابر خطای plans، ادامه ثبت، ترتیب ۱۱ مرحله، حالت busy/error و حذف لینک‌های ناموجود مرور شدند. QA بصری کامل فیگما در این تسک انجام نشده است.
- SEO/marketing: metadata/robots/sitemap و لینک‌های CTA موجود مرور شدند؛ ادعای فعال‌شدن VIP پس از ثبت در نسخه محلی حذف شده است. انتقال کامل ظاهر و محتوای طراحی همچنان در برنامه آینده است.
- شکاف‌های قبلی محصول، از جمله فیلترهای vipOnly/hasMedia بدون DTO، تفاوت برخی محدودیت‌های ورودی فرانت/بک‌اند و فرمت‌های upload، در ادغام Git تغییر نکردند. این گزارش پذیرش انطباق کامل یا مجوز production نیست؛ بررسی و رفع آن‌ها در فاز قرارداد برنامه محصول انجام می‌شود.

هیچ check لازمِ اجراشده برای ثبت/merge این نسخه ناموفق باقی نمانده است. تست‌های runtime پس از افزودن این گزارش نیاز به تکرار ندارند چون محتوای runtime آزموده‌شده تغییر نکرده است؛ تست مستندات و staged check روی متن نهایی اجرا می‌شوند.
