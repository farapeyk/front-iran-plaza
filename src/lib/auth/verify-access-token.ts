import { jwtVerify, type JWTPayload } from "jose";

/**
 * پی‌لود واقعی accessToken بک‌اند (بر اساس نمونه‌ی توکن ساخته‌شده):
 * { sub, userType, iat, exp } — توجه: refreshToken فقط { sub, iat, exp } دارد
 * و userType را شامل نمی‌شود.
 */
export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  userType: "CUSTOMER" | "ADMIN" | string;
}

// کلید امضا باید دقیقاً همان JWT_ACCESS_SECRET بک‌اند باشد (env سمت سرور، بدون NEXT_PUBLIC_)
const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

/**
 * فقط امضا و انقضای accessToken را بررسی می‌کند — بدون هیچ ضربه‌ای به دیتابیس.
 * برای استفاده در middleware (Edge Runtime) طراحی شده.
 * در صورت نامعتبر یا منقضی بودن توکن، null برمی‌گرداند (خطا throw نمی‌شود).
 */
export async function verifyAccessToken(
  token: string | undefined,
): Promise<AccessTokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(token, secret);
    return payload;
  } catch {
    // شامل: امضای نامعتبر، انقضا (JWTExpired)، فرمت غلط و غیره
    return null;
  }
}
