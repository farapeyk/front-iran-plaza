/**
 * اعتبارسنجی کد ملی ایران با الگوریتم رقم کنترلی استاندارد.
 * ورودی باید دقیقاً ۱۰ رقم باشد.
 */
export function isValidIranianNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;

  // کدهای تکراری مثل 0000000000 یا 1111111111 نامعتبرند
  if (/^(\d)\1{9}$/.test(code)) return false;

  const digits = code.split("").map(Number);
  const check = digits[9];
  const sum = digits.slice(0, 9).reduce((acc, digit, i) => acc + digit * (10 - i), 0);
  const remainder = sum % 11;

  return remainder < 2 ? check === remainder : check === 11 - remainder;
}
