const EXCLUDED_ARTICLE_SLUGS = new Set([
  // Published but intentionally noindex.
  "tests",
  // The legacy public URL is not routed by the production edge and returns 404.
  "بهترین-دفاتر-مهاجرتی-در-شیراز-بهترین",
]);

const EXCLUDED_CATEGORY_SLUGS = new Set([
  // Legacy WordPress fallback category has no routable public archive.
  "دستهبندی-نشده",
]);

export function isIndexableSitemapArticle(slug: string): boolean {
  return !EXCLUDED_ARTICLE_SLUGS.has(slug.trim());
}

export function isIndexableSitemapCategory(slug: string): boolean {
  return !EXCLUDED_CATEGORY_SLUGS.has(slug.trim());
}
