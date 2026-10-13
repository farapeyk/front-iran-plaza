/** Page params can remain URL-encoded while metadata params are decoded. Decode once before Orval encodes the API path. */
export function businessSlugFromRoute(value: string): string | null {
  try {
    const slug = decodeURIComponent(value);
    return slug && !/[\/\\\u0000-\u001f\u007f]/.test(slug) ? slug : null;
  } catch { return null; }
}
