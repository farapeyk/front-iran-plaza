/**
 * نام کوکی‌ها و تنظیمات مشترک احراز هویت.
 * این مقادیر در چند جا استفاده می‌شوند (middleware، Server Actions، پروکسی بک‌اند)
 * پس اینجا متمرکز شده‌اند تا از عدم‌هماهنگی جلوگیری شود.
 */
export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

// HttpOnly؛ BFF و Server Actionها نیاز دارند و پراکسی کوکی را به بک‌اند نمی‌فرستد.
export const REFRESH_TOKEN_PATH = "/";
export const ACCESS_TOKEN_PATH = "/";

export const isProd = process.env.NODE_ENV === "production";
