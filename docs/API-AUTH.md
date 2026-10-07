# ارتباط با API و احراز هویت

این سند endpointهای **مصرف‌شده در سورس فرانت** را شرح می‌دهد؛ قرارداد رسمی یا نتیجه تست HTTP بک‌اند نیست. `{id}`، `{businessId}` و دیگر placeholderها در زمان اجرا جایگزین می‌شوند.

## مسیرهای ارتباط

۱. Server Component و Server Action مستقیماً به `BACKEND_INTERNAL_URL` درخواست می‌زنند و در صورت نیاز access token را در `Authorization: Bearer ...` قرار می‌دهند.
۲. مرورگر از `/api/backend/...` استفاده می‌کند؛ handler پایه بک‌اند و `/api/` را اضافه می‌کند، query و body را منتقل و `host` و `cookie` را حذف می‌کند.
۳. silent-refresh زیر `/api/auth` برای navigation و handshake کلاینت است؛ refresh cookie جدید Path برابر `/` دارد و نسخه قدیمی هنگام refresh مهاجرت می‌کند.

`src/lib/api/client.ts` فعلاً فقط `API_BASE_URL = "/api/backend"` و توضیحات آماده‌سازی SDK دارد. SDK تولیدشده یا فرمان تولید آن در پروژه موجود نیست؛ interfaceهای دستی را generated client تلقی نکنید.

## کوکی، JWT و دسترسی

| کوکی | Path | عمر پیش‌فرض | خصوصیات |
| --- | --- | --- | --- |
| `access_token` | `/` | طبق exp توکن | HttpOnly، SameSite=Lax، Secure در production |
| `refresh_token` | `/` | طبق exp توکن | همان خصوصیات |

setAuthCookies عمر کوکی را از exp محاسبه و کوکی قدیمی /api/auth را حذف می‌کند. خروج هر دو scope جدید و قدیمی را پاک می‌کند. verifier کلید غیرخالی، HS256، sub، userType و exp را کنترل می‌کند؛ پاسخ ورود نیز با claimهای امضاشده تطبیق داده می‌شود. محافظ صفحات همچنان در src/proxy.ts است.

## refresh و اعتبارسنجی

refreshSession مسیر مشترک Route Handler و Server Action است. رد احراز هویت ۴۰۱/۴۰۳ کوکی‌ها را پاک می‌کند؛ خطای موقت/پاسخ نامعتبر ۵۰۳ می‌دهد و نشست را حذف نمی‌کند. getActionAccessToken پیش از mutation، توکن نزدیک انقضا را تمدید می‌کند. GET silent-refresh مقصد داخلی امن را باز می‌کند و POST handshake JSON است. پراکسی در ۴۰۱، body اصلی را پس از refresh موفق فقط یک‌بار بازپخش می‌کند.

پراکسی Cookie، Authorization ورودی و headerهای hop را حذف می‌کند، Authorization نشست را اضافه و Set-Cookie بک‌اند را حذف می‌کند. درخواست تغییردهنده با Origin خارجی رد می‌شود. خطای شبکه ۵۰۲، تنظیم سرویس ناموجود ۵۰۳ و body بیش از ۲۵MB برابر ۴۱۳ است. پاسخ‌ها private/no-store هستند.

Server Actionهای JSON از actionFetch و schemaهای mutation-validation استفاده می‌کنند. ورودی و شناسه نامعتبر پیش از HTTP رد می‌شوند؛ این کنترل جای مجوز مالکیت و Tenant بک‌اند را نمی‌گیرد. فایل از مسیر مستقل upload با اعتبارسنجی اندازه، MIME و امضای ابتدایی عبور می‌کند.

## endpointهای مصرف‌شده

همه مسیرها در این جدول مسیر بک‌اند هستند؛ اعلان‌ها نیز اکنون با `/api` مصرف می‌شوند؛ controller محلی شکل قبلی را هم می‌پذیرد.

| حوزه | متد و مسیر | انتظار فرانت / عملیات |
| --- | --- | --- |
| احراز هویت | POST `/api/auth/request-otp` | `{phone}`؛ نتیجه ارسال کد |
| احراز هویت | POST `/api/auth/verify-otp` | `{phone,code}`؛ توکن‌ها، user، isNewUser |
| مدیر | POST `/api/auth/login-password` | `{phone,password}`؛ توکن‌ها و user با نقش مدیر |
| نشست | POST `/api/auth/refresh` | `{refreshToken}`؛ جفت توکن جدید |
| خروج | POST `/api/auth/logout` | Bearer access token |
| حساب | GET / PATCH `/api/users/me` | کاربر جاری / ذخیره داده حساب |
| علاقه‌مندی | GET `/api/users/me/favorites` | آرایه کسب‌وکارهای ذخیره‌شده |
| علاقه‌مندی | POST `/api/businesses/{id}/favorite` | تغییر وضعیت علاقه‌مندی |
| دسته‌ها | GET `/api/categories` | آرایه دسته‌ها |
| کسب‌وکار | GET / POST `/api/businesses` | فهرست صفحه‌بندی‌شده / ایجاد |
| مالک | GET `/api/businesses/mine` | آرایه؛ UI عمدتاً عنصر اول را برمی‌دارد |
| جزئیات | GET / PATCH `/api/businesses/{id}` | داده جزئیات / ویرایش پروفایل |
| عمومی | GET `/api/businesses/slug/{slug}` | پروفایل با مجموعه‌های مرتبط |
| فایل | POST `/api/files/upload` | multipart با `file`؛ پاسخ دارای `id` |
| فایل | GET `/api/files/{id}` | نمایش فایل از طریق پراکسی؛ نیازمند تأیید با HTTP واقعی |
| مدارک | GET / POST `/api/businesses/{id}/documents` | دریافت / ثبت نوع، fileId و metadata |
| پیشرفت | POST `/api/businesses/{id}/onboarding/advance` | `{step}`؛ `{onboardingStep}` |
| ساعات | GET / PATCH `/api/businesses/{id}/working-hours` | دریافت / ذخیره با `{hours: entries}` |
| گالری | GET / POST `/api/businesses/{id}/gallery` | دریافت / افزودن تصویر |
| گالری | DELETE `/api/businesses/{id}/gallery/{imageId}` | حذف |
| امکانات | GET / POST `/api/businesses/{id}/features` | دریافت / افزودن label |
| امکانات | DELETE `/api/businesses/{id}/features/{featureId}` | حذف |
| شعب | GET / POST `/api/businesses/{id}/branches` | دریافت / ایجاد |
| شعب | DELETE `/api/businesses/{id}/branches/{branchId}` | حذف |
| خدمات | GET / POST `/api/businesses/{id}/services` | دریافت / ایجاد |
| خدمات | DELETE `/api/businesses/{id}/services/{serviceId}` | حذف |
| محصولات | GET / POST `/api/businesses/{id}/products` | دریافت / ایجاد |
| محصولات | DELETE `/api/businesses/{id}/products/{productId}` | حذف |
| دسته محصول | GET / POST `/api/businesses/{id}/product-categories` | دریافت / ایجاد |
| دسته محصول | DELETE `/api/businesses/{id}/product-categories/{categoryId}` | حذف |
| اقساط | GET / PATCH `/api/businesses/{id}/installment-plan` | دریافت / ذخیره |
| نظرات | GET / POST `/api/businesses/{id}/reviews` | فهرست / ثبت نظر |
| پاسخ نظر | POST `/api/reviews/{reviewId}/replies` | ثبت پاسخ |
| اعلان | GET `/api/notifications?page=1&limit=50` | آرایه یا `data` |
| اعلان | PATCH `/api/notifications/{id}/read` | علامت‌گذاری خوانده‌شده |
| مدیر کسب‌وکار | GET `/api/businesses/admin` | فهرست با skip/take |
| مدیر کسب‌وکار | GET `/api/businesses/admin/pending` | فهرست انتظار با skip/take |
| مدیر کسب‌وکار | POST `/api/businesses/{id}/approve`، `/reject`، `/suspend` | تأیید، رد یا تعلیق؛ reason برای موارد مربوط |
| مدیر مدارک | GET `/api/admin/documents/pending` | شمارش موارد انتظار از پاسخ |
| مدیر مدارک | POST `/api/admin/documents/{id}/approve`، `/reject` | بررسی مدرک |
| مدیر ثبت دستی | POST `/api/admin/businesses` | ایجاد کسب‌وکار دستی |
| پلن | GET `/api/plans` | گزینه‌های پلن |
| مدیر پلن | PATCH `/api/admin/businesses/{id}/plan`، `/plan/downgrade` | تعیین پلن با planId / کاهش پلن |
| مدیر دسته | GET / POST `/api/admin/categories` | فهرست / ایجاد |
| مدیر دسته | PATCH / DELETE `/api/admin/categories/{id}` | ویرایش / حذف |
| مدیر کاربر | GET `/api/admin/users`، `/api/admin/users/{id}` | فهرست / جزئیات |
| مدیر کاربر | PATCH `/api/admin/users/{id}/suspend`، `/reinstate` | تعلیق با reason / بازگردانی |
| مدیر نظر | GET `/api/admin/reviews` | فیلتر status و page/limit |
| مدیر نظر | PATCH / DELETE `/api/admin/reviews/{id}` | وضعیت / حذف |

## خطا، upload و قرارداد

`extractErrorMessage` پیام رشته‌ای یا اولین عضو آرایه `message` را استخراج می‌کند؛ همه actionها هنوز از آن استفاده نمی‌کنند. `authedFetch<T>` token و JSON را آماده می‌کند و پاسخ success/data یا success=false/message برمی‌گرداند. این generic پاسخ JSON را در زمان اجرا اعتبارسنجی نمی‌کند.

برای multipart، Content-Type دستی نگذارید تا boundary ساخته شود. inputهای `accept="image/*"` یا `video/*` و چک اندازه در مرورگر جای اعتبارسنجی فایل سمت سرور را نمی‌گیرند. سقف ۲۰ مگابایت اکنون در Server Action upload برای همه مصرف‌کنندگان اعمال می‌شود؛ نوع و امضای ابتدایی نیز بررسی می‌شوند.

برای هر تغییر قرارداد یا client، پنج کنترل مرجع QA لازم است: تولید کامل schema با validation سخت‌گیرانه و مقایسه نام‌ها با baseline بررسی‌شده؛ دنبال‌کردن URLهای تولیدشده با HTTP واقعی؛ binary بودن فیلد multipart؛ نوع واقعی و required بودن path parameter؛ و اعلان پاسخ‌های خطای کسب‌وکار و فیلدهای DTO. وضعیت این پنج کنترل در BACKEND-COMPATIBILITY.md ثبت شده است؛ بک‌اند زنده و baseline رسمی در دسترس نبودند.

## مقصد ورود بر اساس نقش

تشخیص مدیر در `src/lib/auth/roles.ts` برای `ADMIN` و `SUPER_ADMIN` مشترک است. ورود موفق OTP و رمز مدیر به `/admin` می‌رود؛ اولویت نقش مدیر از `isNewUser` و نام ناقص بالاتر است. سایر نقش‌ها در OTP طبق کامل‌بودن حساب به `/complete-profile` یا `/dashboard` می‌روند.

`proxy` نقش را فقط از JWT معتبر می‌خواند. مدیر از `/dashboard` و تمام زیرمسیرها، `/complete-profile` و زیرمسیرها و صفحات دقیق `/login` و `/admin/login` به `/admin` هدایت می‌شود. صفحات ورود بدون access token معتبر قابل نمایش هستند؛ صفحات محافظت‌شده ابتدا silent-refresh را طی می‌کنند و پس از تمدید، دوباره محافظ نقش اجرا می‌شود. ورود مستقیم نقش غیرمدیر به پنل به `/dashboard` برمی‌گردد. شرح QA در [گزارش هدایت مدیر](ADMIN-ROUTING-FIX.md) است.
