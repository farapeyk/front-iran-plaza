import { loadPublicBusinesses } from "@/features/seo/sitemap-data";
import {
  absoluteSiteUrl,
  renderUrlSet,
  sitemapResponse,
  sitemapUnavailableResponse,
} from "@/features/seo/sitemap-xml";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const businesses = await loadPublicBusinesses();
    return sitemapResponse(renderUrlSet([
      { loc: absoluteSiteUrl("/businesses") },
      ...businesses.map(business => ({
        loc: absoluteSiteUrl(`/businesses/${encodeURIComponent(business.slug)}`),
        images: business.logoId
          ? [absoluteSiteUrl(`/api/backend/files/${encodeURIComponent(business.logoId)}`)]
          : undefined,
      })),
    ]));
  } catch (error) {
    console.error("Unable to generate business sitemap", error);
    return sitemapUnavailableResponse();
  }
}
