import {
  absoluteSiteUrl,
  renderUrlSet,
  sitemapResponse,
  STATIC_PAGE_PATHS,
} from "@/features/seo/sitemap-xml";

export const dynamic = "force-dynamic";

export function GET(): Response {
  return sitemapResponse(renderUrlSet(
    STATIC_PAGE_PATHS.map(path => ({ loc: absoluteSiteUrl(path) })),
  ));
}
