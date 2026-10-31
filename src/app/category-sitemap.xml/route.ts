import { categoryPath } from "@/features/content/lib/public-paths";
import { loadArticleCategories } from "@/features/seo/sitemap-data";
import { isIndexableSitemapCategory } from "@/features/seo/sitemap-policy";
import {
  absoluteSiteUrl,
  renderUrlSet,
  sitemapResponse,
  sitemapUnavailableResponse,
} from "@/features/seo/sitemap-xml";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const categories = await loadArticleCategories();
    const entries = categories.filter(category => isIndexableSitemapCategory(category.slug)).flatMap(category => {
      const path = categoryPath(category, categories);
      return path ? [{ loc: absoluteSiteUrl(path) }] : [];
    });
    return sitemapResponse(renderUrlSet(entries));
  } catch (error) {
    console.error("Unable to generate category sitemap", error);
    return sitemapUnavailableResponse();
  }
}
