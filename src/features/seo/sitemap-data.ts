import type { BusinessControllerListPublic200DataItem } from "@/design/api/generated/models/businessControllerListPublic200DataItem";
import type { ContentCategory, PublicArticleListItem } from "@/features/content/types";

const PAGE_SIZE = 50;
const MAX_URLS_PER_SITEMAP = 50_000;
const FETCH_TIMEOUT_MS = 15_000;

function backendOrigin(): string {
  const configured = process.env.BACKEND_INTERNAL_URL?.trim().replace(/\/$/, "");
  if (!configured) throw new Error("BACKEND_INTERNAL_URL is required to build dynamic sitemaps");
  return configured;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${backendOrigin()}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Sitemap API request failed with ${response.status}`);
  return response.json() as Promise<T>;
}

async function fetchAllPages<T>(
  pathForPage: (page: number) => string,
): Promise<T[]> {
  const entries: T[] = [];

  for (let page = 1; ; page += 1) {
    const result = await fetchJson<{ data: T[]; total: number }>(pathForPage(page));
    if (!Array.isArray(result.data) || !Number.isSafeInteger(result.total) || result.total < 0) {
      throw new Error("Sitemap API returned an invalid paginated response");
    }
    if (result.total > MAX_URLS_PER_SITEMAP) {
      throw new Error("Sitemap data exceeds the 50,000 URL protocol limit and must be sharded");
    }

    entries.push(...result.data);
    if (entries.length >= result.total) return entries.slice(0, result.total);
    if (result.data.length === 0) {
      throw new Error("Sitemap API pagination ended before the reported total");
    }
  }
}

export function loadPublishedArticles(): Promise<PublicArticleListItem[]> {
  return fetchAllPages<PublicArticleListItem>(page => `/api/articles?page=${page}&limit=${PAGE_SIZE}`);
}

export function loadPublicBusinesses(): Promise<BusinessControllerListPublic200DataItem[]> {
  return fetchAllPages<BusinessControllerListPublic200DataItem>(
    page => `/api/businesses?page=${page}&limit=${PAGE_SIZE}`,
  );
}

export async function loadArticleCategories(): Promise<ContentCategory[]> {
  const categories = await fetchJson<ContentCategory[]>("/api/articles/categories");
  if (!Array.isArray(categories)) throw new Error("Sitemap API returned an invalid category response");
  return categories.filter(category => category.isActive);
}
