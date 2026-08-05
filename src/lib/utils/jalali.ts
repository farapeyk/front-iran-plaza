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
  // الگوریتم ۳۳ ساله‌ی متداول برای تشخیص سال کبیسه‌ی جلالی
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  let jp = breaks[0];
  let jump = 0;
  for (let j = 1; j < breaks.length; j++) {
    const jm = breaks[j];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }
  let n = jy - jp;
  if (n < jump) {
    if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
    let leap = ((n + 1) % 33) % 4;
    if (jump === 33 && leap === 1) leap = 0;
    return leap === 0 && n >= 0;
  }
  return false;
}

/** تعداد روزهای هر ماه شمسی (۱ تا ۱۲) برای یک سال مشخص */
export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

/** تبدیل تاریخ شمسی به میلادی — خروجی رشته‌ی ISO "YYYY-MM-DD" */
export function jalaliToGregorian(jy: number, jm: number, jd: number): string {
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
  const d = typeof input === "string" ? new Date(input) : input;
  let gy = d.getUTCFullYear();
  let gm = d.getUTCMonth() + 1;
  const gd = d.getUTCDate();

  const gDaysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  if (isLeap) gDaysInMonth[2] = 29;

  let gy2 = gy - 1600;
  let gm2 = gm - 1;
  let gd2 = gd - 1;

  let gDayNo = 365 * gy2 + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400);
  for (let i = 0; i < gm2; i++) gDayNo += gDaysInMonth[i + 1];
  gDayNo += gd2;

  let jDayNo = gDayNo - 79;
  const jNp = Math.floor(jDayNo / 12053);
  jDayNo %= 12053;

  let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
  jDayNo %= 1461;

  if (jDayNo >= 366) {
    jy += Math.floor((jDayNo - 1) / 365);
    jDayNo = (jDayNo - 1) % 365;
  }

  const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let jm = 0;
  let jd = jDayNo + 1;
  for (; jm < 12; jm++) {
    if (jd <= jDaysInMonth[jm]) break;
    jd -= jDaysInMonth[jm];
  }

  return { jy, jm: jm + 1, jd };
}