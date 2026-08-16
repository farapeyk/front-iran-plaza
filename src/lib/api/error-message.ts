/**
 * پیام خطای بک‌اند را استخراج می‌کند. NestJS بسته به نوع خطا گاهی message را
 * رشته برمی‌گرداند (مثل ConflictException با پیام دستی) و گاهی آرایه (خطاهای
 * class-validator) — این تابع هر دو حالت را یکسان هندل می‌کند.
 */
export function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object" || !("message" in body)) {
    return fallback;
  }

  const message = (body as { message: unknown }).message;

  if (Array.isArray(message) && message.length > 0) {
    return String(message[0]);
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}