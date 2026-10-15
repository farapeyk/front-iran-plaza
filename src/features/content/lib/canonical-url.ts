/** Normalizes an optional canonical URL while keeping the backend contract absolute. */
export function normalizeCanonicalUrl(input: string | undefined): string | undefined | null {
  const trimmed = input?.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return null;

  const explicitScheme = trimmed.match(/^([a-z][a-z\d+.-]*):\/\//i)?.[1]?.toLowerCase();
  if (explicitScheme && explicitScheme !== 'http' && explicitScheme !== 'https') return null;

  const candidate = explicitScheme
    ? trimmed
    : `https://${trimmed.replace(/^\/\//, '')}`;

  try {
    const url = new URL(candidate);
    const hasQualifiedHost = url.hostname.includes('.') || url.hostname.includes(':');
    if (!hasQualifiedHost || (url.protocol !== 'http:' && url.protocol !== 'https:')) return null;
    return url.href;
  } catch {
    return null;
  }
}
