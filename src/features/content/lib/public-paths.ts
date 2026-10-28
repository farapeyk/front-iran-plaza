import type { ContentCategory } from "@/features/content/types";

export const RESERVED_ROOT_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "articles",
  "business-registration",
  "businesses",
  "categories",
  "category",
  "cip",
  "complete-profile",
  "contact",
  "content",
  "cover",
  "dashboard",
  "design-system",
  "faq",
  "home",
  "login",
  "payment-result",
  "payments",
  "profile",
  "robots.txt",
  "search",
  "sitemap.xml",
  "subscription",
  "support",
  "terms",
  "user-info",
]);

export function articlePath(slug: string): string {
  return `/${slug}/`;
}

export function articlePreviewPath(slug: string, id: string): string {
  return `${articlePath(slug)}?preview=${encodeURIComponent(id)}`;
}

export function categorySegments(category: ContentCategory, categories: ContentCategory[]): string[] | null {
  const byId = new Map(categories.map(item => [item.id, item]));
  const visited = new Set<string>();
  const segments: string[] = [];
  let cursor: ContentCategory | undefined = category;

  while (cursor) {
    if (visited.has(cursor.id)) return null;
    visited.add(cursor.id);
    segments.unshift(cursor.slug);
    if (!cursor.parentId) break;
    cursor = byId.get(cursor.parentId);
    if (!cursor) return null;
  }

  return segments;
}

export function categoryPath(category: ContentCategory, categories: ContentCategory[]): string | null {
  const segments = categorySegments(category, categories);
  return segments ? `/category/${segments.join("/")}/` : null;
}

export function findCategoryBySegments(categories: ContentCategory[], requestedSegments: string[]): ContentCategory | undefined {
  const requestedPath = requestedSegments.join("/");
  return categories.find(category => categorySegments(category, categories)?.join("/") === requestedPath);
}
