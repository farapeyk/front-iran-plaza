import type { MetadataRoute } from 'next';

/** Public entry points only; do not invent a production domain. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!process.env.SITE_URL) return [];
  return ['/', '/businesses'].map(path => ({ url: new URL(path, process.env.SITE_URL).href }));
}
