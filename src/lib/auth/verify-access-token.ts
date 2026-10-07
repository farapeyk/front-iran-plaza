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

/**
 * فقط امضا و انقضای accessToken را بررسی می‌کند — بدون هیچ ضربه‌ای به دیتابیس.
 * برای استفاده در middleware (Edge Runtime) طراحی شده.
 * در صورت نامعتبر یا منقضی بودن توکن، null برمی‌گرداند (خطا throw نمی‌شود).
 */
export async function verifyAccessToken(
  token: string | undefined,
): Promise<AccessTokenPayload | null> {
  if (!token) return null;
  const configuredSecret = process.env.JWT_ACCESS_SECRET;
  if (!configuredSecret) return null;
  const secret = new TextEncoder().encode(configuredSecret);

  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(token, secret, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || !payload.sub || typeof payload.userType !== "string" || !payload.userType || typeof payload.exp !== "number") return null;
    return payload;
  } catch {
    // شامل: امضای نامعتبر، انقضا (JWTExpired)، فرمت غلط و غیره
    return null;
  }
}
