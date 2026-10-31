import type { MetadataRoute } from 'next';
import type { ContentCategory, PublicArticleListResponse } from '@/features/content/types';
import { articlePath, categoryPath } from '@/features/content/lib/public-paths';
import { isIndexableSitemapArticle, isIndexableSitemapCategory } from '@/features/seo/sitemap-policy';

/** Public entry points and published CMS content only; drafts never enter the sitemap. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.SITE_URL) return [];
  const entries: MetadataRoute.Sitemap = ['/', '/businesses', '/categories', '/articles/', '/faq', '/about', '/contact', '/terms'].map(path => ({ url: new URL(path, process.env.SITE_URL).href }));
  const backend = process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, '');
  if (!backend) return entries;
  try {
    const categoriesResponse = await fetch(`${backend}/api/articles/categories`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json() as ContentCategory[];
      entries.push(...categories.filter(category => isIndexableSitemapCategory(category.slug)).flatMap(category => {
        const path = categoryPath(category, categories);
        return path ? [{ url: new URL(path, process.env.SITE_URL).href }] : [];
      }));
    }
  } catch {
    // Article discovery remains available if only category discovery fails.
  }
  try {
    let page = 1;
    let total = 0;
    do {
      const response = await fetch(`${backend}/api/articles?page=${page}&limit=50`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
      if (!response.ok) break;
      const result = await response.json() as PublicArticleListResponse;
      total = result.total;
      entries.push(...result.data.filter(article => isIndexableSitemapArticle(article.slug)).map(article => ({ url: new URL(articlePath(article.slug), process.env.SITE_URL).href, lastModified: new Date(article.updatedAt) })));
      page += 1;
    } while ((page - 1) * 50 < total && page <= 20);
  } catch {
    // Static pages and any categories already loaded remain discoverable during an article API outage.
  }
  return entries;
}
