# ثبت دستی و مدیریت کسب‌وکار توسط ادمین

در منوی ادمین، «ثبت دستی کسب‌وکار» به `/admin/businesses/new` می‌رود. اطلاعات مالک، شهر، دسته و مشخصات اصلی ثبت می‌شوند و پس از موفقیت، مدیر به `/admin/businesses/:id/edit` می‌رود. اعطای اختیاری پلن مستقل است؛ شکست آن کسب‌وکار ثبت‌شده را حذف نمی‌کند و پیام واضح دارد.

صفحه ویرایش فرم‌های اصلی پروژه را برای لوگو، تماس، شهر، آدرس/نقشه، شعب، امکانات، گالری/ویدیو، شبکه اجتماعی، خدمات، دسته/محصول، درباره ما، ساعات کاری و اقساط به کار می‌گیرد. هر بخش جداگانه ذخیره می‌شود. فرم‌ها با شناسه کسب‌وکار انتخاب‌شده کار می‌کنند و به کسب‌وکار شخصی مدیر وابسته نیستند. لینک صفحهٔ شخصی افزودن محصول در این محیط نمایش داده نمی‌شود؛ فرم درون همان صفحه برای ساخت محصول موجود است.

صفحه `/admin/businesses/:id` لینک ویرایش کامل، دلیل تعلیق و کنترل وضعیت دارد. تعلیق به دلیل نیاز دارد؛ پس از موفقیت وضعیت صفحه تازه می‌شود. کسب‌وکار معلق در سایت نمایش عمومی ندارد. لیست `/admin/businesses/suspended` لینک بررسی دلیل/رفع تعلیق دارد. دکمه «رفع تعلیق و تأیید» از endpoint تأیید فعلی استفاده می‌کند.

در همه صفحه‌های حساب مالک، هر کسب‌وکار معلق با نام و دلیل در بنر هشدار نمایش داده می‌شود؛ فقط اولین کسب‌وکار بررسی نمی‌شود. اعلان در `/dashboard/notifications` نیز قابل مشاهده و خوانده‌شدن است. پاسخ API برابر `{data,total,page,limit}` است؛ صفحه اعلان علاوه بر آن، آرایه یا `{items,total}` را نیز می‌پذیرد. ثبت دستیِ احرازشده توسط مدیر، مالک را مجبور به ارسال مجدد سه مدرک نمی‌کند.

تمام مجوزهای نهایی در بک‌اند کنترل می‌شوند. مالکیت فایل، دسته‌بندی و محدودیت پلن همچنان برقرار است. پیامک یا پرداخت واقعی جزو این جریان نیست.

قرارداد OpenAPI و کلاینت Orval باید فیلدهای الزامی `city` و `categoryIds` را برای ثبت دستی داشته باشند. enum نوع ثبت فقط دو مقدار حضوری/تلفنی دارد؛ نام operationها تغییر نکرده است.

تست‌های `tests/admin-business-management.test.cjs` ورودی ثبت، شکست مستقل پلن، تازه‌سازی پس از تعلیق، پاسخ واقعی اعلان و نمایش دلیل همه کسب‌وکارهای معلق را پوشش می‌دهند. تست‌های دارای mock/fixture به معنی آزمون حساب واقعی نیستند؛ نتایج build و بررسی نهایی در گزارش تحویل ثبت می‌شود.

## Verification (2026-10-19)

- TypeScript, ESLint, all 60 frontend tests, generated-client reproducibility, and the Next.js production build passed.
- Production HTTP fixture checks passed the manual form, complete admin editor, suspended inventory, owner dashboard banner, notifications, admin authorization redirects, and missing-business behavior. Category fixtures are public; the optional plans endpoint can fail without blocking manual registration.
- Deployed image: `iranplaza/frontend:admin-management-20261019`.
- Production HTTP smoke checks returned 200 for the public homepage, admin login page, and categories API. Both production containers are healthy with zero restarts.
