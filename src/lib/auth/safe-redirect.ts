export function safeRedirect(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020\u007f]/.test(value)) return '/dashboard';
  try {
    const base = 'https://internal.invalid';
    const parsed = new URL(value, base);
    return parsed.origin === base ? parsed.pathname + parsed.search + parsed.hash : '/dashboard';
  } catch { return '/dashboard'; }
}
