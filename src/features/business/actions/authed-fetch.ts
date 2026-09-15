import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { extractErrorMessage } from "@/lib/api/error-message";

export type ActionResult<T = undefined> = { success: true; data: T } | { success: false; message: string };

export async function authedFetch<T>(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<ActionResult<T>> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) {
    return { success: false, message: "نشست شما منقضی شده، دوباره وارد شوید" };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error(`[authedFetch] ${method} ${path} rejected:`, res.status, errBody);
      return { success: false, message: extractErrorMessage(errBody, `عملیات با خطا مواجه شد (کد ${res.status})`) };
    }

    const data = res.status === 204 ? (undefined as T) : ((await res.json().catch(() => undefined)) as T);
    return { success: true, data };
  } catch (err) {
    console.error(`[authedFetch] ${method} ${path} network error:`, err);
    return { success: false, message: "برقراری ارتباط با سرور ممکن نشد" };
  }
}