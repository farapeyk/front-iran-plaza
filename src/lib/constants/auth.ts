/**
 * نام کوکی‌ها و تنظیمات مشترک احراز هویت.
 * این مقادیر در چند جا استفاده می‌شوند (middleware، Server Actions، پروکسی بک‌اند)
 * پس اینجا متمرکز شده‌اند تا از عدم‌هماهنگی جلوگیری شود.
 */
export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

// مسیر مجاز ارسال کوکی refresh_token — فقط به مسیرهای auth ارسال می‌شود
// تا در صورت لو رفتن یک درخواست دیگر، این توکن حساس‌تر افشا نشود.
export const REFRESH_TOKEN_PATH = "/api/auth";
export const ACCESS_TOKEN_PATH = "/";

export const isProd = process.env.NODE_ENV === "production";
