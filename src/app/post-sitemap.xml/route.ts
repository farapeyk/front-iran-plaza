import { articlePath } from "@/features/content/lib/public-paths";
import { loadPublishedArticles } from "@/features/seo/sitemap-data";
import { isIndexableSitemapArticle } from "@/features/seo/sitemap-policy";
import {
  absoluteSiteUrl,
  renderUrlSet,
  sitemapResponse,
  sitemapUnavailableResponse,
} from "@/features/seo/sitemap-xml";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const articles = await loadPublishedArticles();
    return sitemapResponse(renderUrlSet([
      { loc: absoluteSiteUrl("/articles/") },
      ...articles.filter(article => isIndexableSitemapArticle(article.slug)).map(article => ({
        loc: absoluteSiteUrl(articlePath(article.slug)),
        lastModified: article.updatedAt,
        images: article.coverImageId
          ? [absoluteSiteUrl(`/api/backend/files/${encodeURIComponent(article.coverImageId)}`)]
          : undefined,
      })),
    ]));
  } catch (error) {
    console.error("Unable to generate post sitemap", error);
    return sitemapUnavailableResponse();
  }
}
