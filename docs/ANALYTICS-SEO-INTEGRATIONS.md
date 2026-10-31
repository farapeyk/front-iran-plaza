# اتصال ابزارهای آمار و وبمستر

پروژه از GA4 و Microsoft Clarity برای آمار و از Yandex Webmaster و Baidu Webmaster برای تأیید مالکیت دامنه پشتیبانی می‌کند. همه اتصال‌ها اختیاری‌اند؛ اگر مقدار env خالی باشد هیچ اسکریپت یا تگ مربوط به آن سرویس تولید نمی‌شود.

## تنظیم متغیرها

```dotenv
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=abc123def4
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=0123456789abcdef
NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=codeva-xxxxxxxxxx
```

| متغیر | مقدار مورد نیاز |
| --- | --- |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Measurement ID از GA4 Web Data Stream با قالب `G-...` |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Project ID پروژه در Microsoft Clarity |
| `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` | فقط مقدار `content` از تگ `yandex-verification` |
| `NEXT_PUBLIC_BAIDU_SITE_VERIFICATION` | فقط مقدار `content` از تگ `baidu-site-verification`، معمولاً با پیشوند `codeva-` |

این شناسه‌ها و توکن‌های تأیید به‌طور طبیعی در HTML یا درخواست مرورگر دیده می‌شوند و secret نیستند. بااین‌حال مقدار کامل تگ HTML را وارد نکنید؛ فقط شناسه یا `content` را قرار دهید. مقدار نامعتبر build را متوقف می‌کند تا پیکربندی اشتباه منتشر نشود.

## فعال‌سازی در حساب سرویس‌ها

1. در Google Analytics یک Web Data Stream برای دامنه production بسازید و Measurement ID را وارد کنید.
2. در Microsoft Clarity پروژه سایت را بسازید و Project ID را وارد کنید.
3. سایت را در Yandex Webmaster اضافه کنید، روش Meta tag را انتخاب کنید و مقدار `content` را وارد کنید.
4. سایت را در Baidu Search Resource Platform اضافه کنید، روش HTML tag را انتخاب کنید و مقدار `content` را وارد کنید.
5. برنامه را دوباره build و deploy کنید؛ سپس دکمه Verify هر دو ابزار وبمستر را بزنید.

در GitHub Actions شناسه production کلریتی `ytzg76hino` در workflow تثبیت شده است. مقادیر GA4، Yandex و Baidu از Repository Variables با نام‌های `GA4_MEASUREMENT_ID`، `YANDEX_SITE_VERIFICATION` و `BAIDU_SITE_VERIFICATION` خوانده و به envهای بالا نگاشت می‌شوند. در build مستقیم Docker نام کامل envهای فهرست‌شده در بالا را با `--build-arg` ارسال کنید.

```bash
docker build \
  --build-arg SITE_URL=https://iran-plaza.ir \
  --build-arg NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX \
  --build-arg NEXT_PUBLIC_CLARITY_PROJECT_ID=abc123def4 \
  --build-arg NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=0123456789abcdef \
  --build-arg NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=codeva-xxxxxxxxxx \
  -t iran-plaza-web .
```

## بررسی پس از انتشار

- در View Source باید تگ‌های `yandex-verification` و `baidu-site-verification` دیده شوند.
- در Network مرورگر باید درخواست `googletagmanager.com/gtag/js` و `clarity.ms/tag/...` دیده شود.
- در GA4 بخش Realtime و در Clarity بخش Live باید بازدید آزمایشی ثبت شود. GA4 برای تغییر مسیرهای داخلی App Router نیز رویداد `page_view` می‌فرستد.
- اسکریپت‌های آمار فقط روی صفحات عمومی بارگذاری می‌شوند و query string را به GA4 نمی‌فرستند؛ صفحات ورود، داشبورد، مدیریت و CMS ردیابی نمی‌شوند.
- اگر سیاست حریم خصوصی یا مقررات بازار هدف رضایت کاربر را الزامی می‌کند، بارگذاری ابزارهای آمار باید در مرحله بعد به سامانه consent متصل شود.

شناسه‌های `NEXT_PUBLIC_` هنگام build داخل bundle قرار می‌گیرند؛ تغییر env در کانتینر آماده، بدون build مجدد، آن‌ها را عوض نمی‌کند.
