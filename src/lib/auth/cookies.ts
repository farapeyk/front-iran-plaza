import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_PATH,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_PATH,
  isProd,
} from "@/lib/constants/auth";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  /** ثانیه تا انقضای accessToken (اختیاری؛ اگر بک‌اند expiresIn برمی‌گرداند بفرستید) */
  accessTokenMaxAge?: number;
  refreshTokenMaxAge?: number;
}

/**
 * توکن‌های دریافتی از بک‌اند (که در بدنه‌ی JSON پاسخ می‌آیند، نه در کوکی) را
 * در کوکی‌های httpOnly ذخیره می‌کند. باید فقط از داخل Server Action یا
 * Route Handler فراخوانی شود (چون cookies().set فقط در آن‌جا مجاز است).
 */
export async function setAuthCookies({
  accessToken,
  refreshToken,
  accessTokenMaxAge = 60 * 15, // پیش‌فرض ۱۵ دقیقه — با عمر واقعی accessToken بک‌اند هماهنگ کنید
  refreshTokenMaxAge = 60 * 60 * 24 * 30, // پیش‌فرض ۳۰ روز
}: TokenPair) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: ACCESS_TOKEN_PATH,
    maxAge: accessTokenMaxAge,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: REFRESH_TOKEN_PATH,
    maxAge: refreshTokenMaxAge,
  });
}

/** هر دو کوکی احراز هویت را پاک می‌کند (برای logout یا شکست refresh) */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, "", { path: ACCESS_TOKEN_PATH, maxAge: 0 });
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", { path: REFRESH_TOKEN_PATH, maxAge: 0 });
}

export async function getAccessTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}
