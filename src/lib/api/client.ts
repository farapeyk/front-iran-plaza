/**
 * پیکربندی SDK تولیدشده از OpenAPI (Swagger بک‌اند).
 *
 * نکته‌ی حیاتی: baseURL باید نسبی و برابر با '/api/backend' باشد — نه آدرس
 * مستقیم بک‌اند (مثل http://localhost:3000). چون این SDK از سمت کلاینت
 * (مرورگر) فراخوانی می‌شود و باید از پروکسی داخلی عبور کند تا:
 *   ۱. accessToken از کوکی httpOnly به‌صورت خودکار در هدر Authorization گذاشته شود
 *   ۲. در صورت 401، refresh-and-retry خودکار انجام شود
 *
 * نحوه‌ی تولید SDK به ابزار انتخابی‌تان بستگی دارد (مثلاً openapi-typescript-codegen
 * یا orval). خروجی معمولاً یک OpenAPI config شیء دارد که این‌جا تنظیم می‌شود:
 *
 *   import { OpenAPI } from '@/lib/api/generated';
 *   OpenAPI.BASE = '/api/backend';
 *
 * این فایل را بعد از تولید SDK واقعی تکمیل کنید — چون خروجی دقیق به ابزار
 * انتخابی بستگی دارد و نباید حدس زده شود.
 */
export const API_BASE_URL = "/api/backend";
