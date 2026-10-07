/**
 * توابع کمکی تقویم شمسی (جلالی).
 * چون بک‌اند احتمالاً تاریخ را به‌صورت میلادی/ISO ذخیره می‌کند، ورودی کاربر
 * (روز/ماه/سال شمسی) قبل از ارسال به Gregorian تبدیل می‌شود.
 * الگوریتم تبدیل: پیاده‌سازی متداول jalaali (بدون نیاز به پکیج خارجی).
 *
 * فرض: بک‌اند فیلد birthDate را به فرمت رشته‌ی ISO (مثل "1990-03-21") انتظار
 * دارد. اگر بک‌اند خودش تاریخ شمسی می‌خواهد، تبدیل نهایی در
 * complete-profile.action.ts را حذف کنید و مقدار خام شمسی را بفرستید.
 */

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

function isJalaliLeapYear(jy: number): boolean {
  const start = Date.parse(convertJalaliToGregorian(jy, 1, 1));
  const end = Date.parse(convertJalaliToGregorian(jy + 1, 1, 1));
  return (end - start) / 86400000 === 366;
}

export function isValidJalaliDate(jy: number, jm: number, jd: number): boolean {
  return Number.isInteger(jy) && jy >= 1300 && jy <= 1410 && Number.isInteger(jm) && jm >= 1 && jm <= 12 &&
    Number.isInteger(jd) && jd >= 1 && jd <= jalaliMonthLength(jy, jm);
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): string {
  if (!isValidJalaliDate(jy, jm, jd)) throw new RangeError('تاریخ شمسی معتبر نیست.');
  return convertJalaliToGregorian(jy, jm, jd);
}

/** تعداد روزهای هر ماه شمسی (۱ تا ۱۲) برای یک سال مشخص */
export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

/** تبدیل تاریخ شمسی به میلادی — خروجی رشته‌ی ISO "YYYY-MM-DD" */
function convertJalaliToGregorian(jy: number, jm: number, jd: number): string {
  let gy: number;
  const jy1 = jy + 1595;
  let days =
    -355668 +
    365 * jy1 +
    Math.floor(jy1 / 33) * 8 +
    Math.floor(((jy1 % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  if (isLeap) gDaysInMonth[1] = 29;

  let gm = 0;
  let d = days + 1;
  for (; gm < 12; gm++) {
    if (d <= gDaysInMonth[gm]) break;
    d -= gDaysInMonth[gm];
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${gy}-${pad(gm + 1)}-${pad(d)}`;
}

// بازه‌ی سال برای select — قابل تنظیم بر اساس نیاز محصول (اینجا ۱۳۳۰ تا ۱۴۱۰)
export const JALALI_YEAR_RANGE = { min: 1330, max: 1410 };
/** تبدیل تاریخ میلادی (ISO یا Date) به شمسی — برای پرکردن فیلدهای غیرفعال از داده‌ی موجود کاربر */
export function gregorianToJalali(input: string | Date): { jy: number; jm: number; jd: number } {
  const date = typeof input === 'string' ? new Date(input) : input;
  if (!Number.isFinite(date.getTime())) throw new RangeError('تاریخ میلادی معتبر نیست.');
  const parts = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
  const number = (type: string) => Number(parts.find(part => part.type === type)?.value);
  return { jy: number('year'), jm: number('month'), jd: number('day') };
}
