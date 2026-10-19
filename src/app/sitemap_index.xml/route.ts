import {
  absoluteSiteUrl,
  CHILD_SITEMAP_PATHS,
  renderSitemapIndex,
  sitemapResponse,
} from "@/features/seo/sitemap-xml";

export const dynamic = "force-dynamic";

export function GET(): Response {
  const entries = CHILD_SITEMAP_PATHS.map(path => ({ loc: absoluteSiteUrl(path) }));
  return sitemapResponse(renderSitemapIndex(entries));
}
