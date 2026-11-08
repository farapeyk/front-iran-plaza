import type { BusinessCardData } from "@/design/components/business-card";

const CACHE_VERSION = 1;
const PUBLIC_TTL_MS = 5 * 60 * 1000;
const FAVORITES_TTL_MS = 60 * 1000;

type CacheKind = "latest" | "featured" | "favorites";
type CacheEntry<T> = { version: number; savedAt: number; value: T };

function cacheKey(userId: string, kind: CacheKind): string {
  return `iran-plaza:customer-dashboard:v${CACHE_VERSION}:${userId}:${kind}`;
}

function isBusinessCard(value: unknown): value is BusinessCardData {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<BusinessCardData>;
  return typeof item.id === "string" && typeof item.name === "string" &&
    typeof item.description === "string" && typeof item.location === "string" &&
    typeof item.image === "string" && (item.vip === undefined || typeof item.vip === "boolean") &&
    (item.href === undefined || typeof item.href === "string");
}

export function readCustomerDashboardCache(
  userId: string,
  kind: CacheKind,
  storage: Storage,
  now = Date.now(),
): BusinessCardData[] | null {
  try {
    const raw = storage.getItem(cacheKey(userId, kind));
    if (!raw) return null;
    const entry: unknown = JSON.parse(raw);
    if (!entry || typeof entry !== "object") return null;
    const cached = entry as Partial<CacheEntry<unknown>>;
    const ttl = kind === "favorites" ? FAVORITES_TTL_MS : PUBLIC_TTL_MS;
    if (cached.version !== CACHE_VERSION || typeof cached.savedAt !== "number" ||
      now - cached.savedAt < 0 || now - cached.savedAt > ttl ||
      !Array.isArray(cached.value) || !cached.value.every(isBusinessCard)) return null;
    return cached.value;
  } catch {
    return null;
  }
}

export function writeCustomerDashboardCache(
  userId: string,
  kind: CacheKind,
  value: BusinessCardData[],
  storage: Storage,
  now = Date.now(),
): void {
  try {
    storage.setItem(cacheKey(userId, kind), JSON.stringify({ version: CACHE_VERSION, savedAt: now, value }));
  } catch {
    // Dashboard cache is an enhancement; the API remains the source of truth.
  }
}
