const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function normalizeBase(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is not configured`);
  const normalized = value.replace(/\/$/, '');
  const parsed = new URL(normalized);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error(`${name} must be an HTTP(S) URL without credentials`);
  }
  return normalized;
}

export function getBackendBaseUrl(method = 'GET'): string {
  const local = normalizeBase(process.env.BACKEND_INTERNAL_URL, 'BACKEND_INTERNAL_URL');
  if (SAFE_METHODS.has(method.toUpperCase()) || !process.env.BACKEND_WRITE_URL) return local;
  return normalizeBase(process.env.BACKEND_WRITE_URL, 'BACKEND_WRITE_URL');
}

export function getBackendUrl(path: string, method = 'GET'): string {
  if (!path.startsWith('/api/') || path.startsWith('//')) throw new Error('Invalid backend path');
  return getBackendBaseUrl(method) + path;
}
