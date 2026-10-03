// src/lib/tracking/session.ts
const SESSION_KEY = "iranplaza_session_id";

/**
 * ساخت یک UUID نسخه ۴ (برای محیط‌های غیر امن HTTP)
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback برای مرورگرهایی که در HTTP محدود شده‌اند
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * فقط سمت کلاینت کار می‌کند (localStorage). اگه قبلاً ساخته شده، همون مقدار
 * قدیمی برمی‌گرده تا Session بین بازدیدهای مختلف کاربر پایدار بمونه.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}