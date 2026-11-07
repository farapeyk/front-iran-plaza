import type { BusinessCardData } from "@/design/components/business-card";

const MAX_RECENT_BUSINESSES = 8;

type RecentBusiness = {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  logoId: string | null;
  vip: boolean;
};

function storageKey(userId: string) {
  return `iran-plaza:recent-businesses:${userId}`;
}

function isRecentBusiness(value: unknown): value is RecentBusiness {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RecentBusiness>;
  return typeof item.id === "string" && typeof item.slug === "string" &&
    typeof item.name === "string" && typeof item.description === "string" &&
    typeof item.location === "string" && (item.logoId === null || typeof item.logoId === "string") &&
    typeof item.vip === "boolean";
}

function toCard(item: RecentBusiness): BusinessCardData {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    location: item.location,
    image: item.logoId ? `/api/backend/files/${encodeURIComponent(item.logoId)}` : "/design/icons/briefcase.svg",
    vip: item.vip,
    href: `/businesses/${encodeURIComponent(item.slug)}`,
  };
}

export function readRecentBusinesses(userId: string, storage: Storage): BusinessCardData[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(storageKey(userId)) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentBusiness).slice(0, MAX_RECENT_BUSINESSES).map(toCard);
  } catch {
    return [];
  }
}

export function rememberRecentBusiness(
  userId: string,
  business: RecentBusiness,
  storage: Storage,
): void {
  try {
    const current: unknown = JSON.parse(storage.getItem(storageKey(userId)) ?? "[]");
    const recent = Array.isArray(current) ? current.filter(isRecentBusiness) : [];
    const next = [business, ...recent.filter((item) => item.id !== business.id)].slice(0, MAX_RECENT_BUSINESSES);
    storage.setItem(storageKey(userId), JSON.stringify(next));
  } catch {
    // Recent history is an enhancement; browsing still works when storage is unavailable.
  }
}
