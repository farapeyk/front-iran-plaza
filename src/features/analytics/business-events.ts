export type BusinessEvent = 'VIEW_BUSINESS' | 'VIEW_GALLERY' | 'CLICK_PHONE' | 'CLICK_WHATSAPP' | 'CLICK_WEBSITE' | 'CLICK_LOCATION' | 'SHARE_BUSINESS';

const SESSION_KEY = 'iranplaza:analytics-session';

function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const value = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, value);
    return value;
  } catch {
    return crypto.randomUUID();
  }
}

export function trackBusinessEvent(businessId: string, type: BusinessEvent, metadata?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify({ sessionId: sessionId(), businessId, type, ...(metadata ? { metadata } : {}) });
  const url = '/api/backend/tracking/events';
  try {
    if (navigator.sendBeacon?.(url, new Blob([payload], { type: 'application/json' }))) return;
  } catch { /* Fall through to fetch. */ }
  void fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true, credentials: 'same-origin' }).catch(() => {});
}
