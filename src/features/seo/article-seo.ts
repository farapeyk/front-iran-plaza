import type { Metadata } from "next";
import { displayArticleExcerpt, withoutLegacyArticleWidgets } from "@/features/content/lib/article-content";
import { articlePath } from "@/features/content/lib/public-paths";
import type { PublicArticle, PublicArticleListItem } from "@/features/content/types";

export const OFFICIAL_SITE_ORIGIN = "https://iran-plaza.ir";

export function siteOrigin(configured = process.env.SITE_URL): string {
  try {
    return new URL(configured || OFFICIAL_SITE_ORIGIN).origin;
  } catch {
    return OFFICIAL_SITE_ORIGIN;
  }
}
export function absoluteSiteUrl(value: string, configured = process.env.SITE_URL): string {
  return new URL(value, `${siteOrigin(configured)}/`).href;
}
export function articleDescription(article: PublicArticle): string {
  const excerpt = displayArticleExcerpt(article.excerpt, withoutLegacyArticleWidgets(article.bodyBlocks));
  const value = (article.seoDescription || excerpt).trim();
  return value.length > 170 ? `${value.slice(0, 169).trimEnd()}…` : value;
}
export function buildArticleMetadata(article: PublicArticle, configured = process.env.SITE_URL): Metadata {
  const title = article.seoTitle || article.title;
  const description = articleDescription(article);
  const canonical = absoluteSiteUrl(article.canonicalUrl || articlePath(article.slug), configured);
  const image = article.coverImageId
    ? absoluteSiteUrl(`/api/backend/files/${encodeURIComponent(article.coverImageId)}`, configured)
    : undefined;
  const author = article.author.fullName || "تیم ایران پلازا";
  const images = image ? [{ url: image, alt: article.coverImageAlt || article.title }] : undefined;

  return {
    title,
    description,
    category: article.category?.name || undefined,
    authors: [{ name: author }],
    creator: author,
    publisher: "ایران پلازا",
    alternates: { canonical },
    robots: {
      index: article.robotsIndex,
      follow: article.robotsFollow,
      googleBot: {
        index: article.robotsIndex,
        follow: article.robotsFollow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "article",
      locale: "fa_IR",
      siteName: "ایران پلازا",
      url: canonical,
      title,
      description,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      authors: [author],
      section: article.category?.name || undefined,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

function businessAddress(business: PublicArticle["businesses"][number]["business"]) {
  const address = [business.neighborhood, business.address].filter(Boolean).join("، ");
  if (!address && !business.city) return undefined;
  return {
    "@type": "PostalAddress",
    ...(address ? { streetAddress: address } : {}),
    ...(business.city ? { addressLocality: business.city } : {}),
    addressCountry: "IR",
  };
}

function articleWordCount(article: PublicArticle): number {
  const content = [
    article.excerpt,
    ...article.bodyBlocks.flatMap(block => [
      block.text || "",
      ...(block.table?.headers || []),
      ...(block.table?.rows.flatMap(row => row.cells) || []),
    ]),
  ].join(" ");
  return content.split(/\s+/u).filter(Boolean).length;
}

export function buildArticleStructuredData(
  article: PublicArticle,
  categoryPath?: string,
  configured = process.env.SITE_URL,
): { "@context": "https://schema.org"; "@graph": Array<Record<string, unknown>> } {
  const origin = siteOrigin(configured);
  const articleUrl = absoluteSiteUrl(article.canonicalUrl || articlePath(article.slug), configured);
  const articleId = `${articleUrl}#article`;
  const webPageId = `${articleUrl}#webpage`;
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const imageUrl = article.coverImageId
    ? absoluteSiteUrl(`/api/backend/files/${encodeURIComponent(article.coverImageId)}`, configured)
    : undefined;
  const authorName = article.author.fullName?.trim();
  const businessById = new Map(article.businesses.map(link => [link.business.id, link.business]));
  const activeFaqs = article.faqs.filter(item => item.isActive !== false);
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "WebPage",
      "@id": webPageId,
      url: articleUrl,
      name: article.seoTitle || article.title,
      description: articleDescription(article),
      inLanguage: "fa-IR",
      isPartOf: { "@id": websiteId },
      ...(imageUrl ? { primaryImageOfPage: { "@type": "ImageObject", url: imageUrl } } : {}),
    },
    {
      "@type": "BlogPosting",
      "@id": articleId,
      url: articleUrl,
      headline: article.title,
      description: articleDescription(article),
      inLanguage: "fa-IR",
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      wordCount: articleWordCount(article),
      ...(article.category?.name ? { articleSection: article.category.name } : {}),
      author: authorName
        ? { "@type": "Person", name: authorName }
        : { "@id": organizationId },
      publisher: { "@id": organizationId },
      isPartOf: { "@id": websiteId },
      mainEntityOfPage: { "@id": webPageId },
      ...(imageUrl ? {
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          ...(article.coverImageAlt ? { caption: article.coverImageAlt } : {}),
        },
      } : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${articleUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: `${origin}/` },
        categoryPath
          ? { "@type": "ListItem", position: 2, name: article.category?.name || "مقالات", item: absoluteSiteUrl(categoryPath, configured) }
          : { "@type": "ListItem", position: 2, name: "مقالات", item: absoluteSiteUrl("/articles/", configured) },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    },
  ];

  if (activeFaqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${articleUrl}#faq`,
      isPartOf: { "@id": webPageId },
      mainEntity: activeFaqs.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  for (const block of article.bodyBlocks.filter(item => item.type === "business-list")) {
    const businesses = (block.businessIds || []).map(id => businessById.get(id)).filter((item): item is NonNullable<typeof item> => Boolean(item));
    if (!businesses.length) continue;
    graph.push({
      "@type": "ItemList",
      "@id": `${articleUrl}#${block.id}-item-list`,
      name: block.listTitle?.trim() || article.title,
      numberOfItems: businesses.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: businesses.map((business, index) => {
        const businessUrl = absoluteSiteUrl(`/businesses/${encodeURIComponent(business.slug)}`, configured);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "LocalBusiness",
            "@id": `${businessUrl}#business`,
            url: businessUrl,
            name: business.name,
            ...(business.description ? { description: business.description } : {}),
            ...(business.phone ? { telephone: business.phone } : {}),
            ...(businessAddress(business) ? { address: businessAddress(business) } : {}),
          },
        };
      }),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function buildArticleListStructuredData(
  articles: PublicArticleListItem[],
  name: string,
  path: string,
  startPosition = 1,
  configured = process.env.SITE_URL,
) {
  const pageUrl = absoluteSiteUrl(path, configured);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#article-list`,
    url: pageUrl,
    name,
    numberOfItems: articles.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: articles.map((article, index) => {
      const url = absoluteSiteUrl(articlePath(article.slug), configured);
      const image = article.coverImageId
        ? absoluteSiteUrl(`/api/backend/files/${encodeURIComponent(article.coverImageId)}`, configured)
        : undefined;
      return {
        "@type": "ListItem",
        position: startPosition + index,
        item: {
          "@type": "BlogPosting",
          url,
          headline: article.title,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: article.author.fullName
            ? { "@type": "Person", name: article.author.fullName }
            : { "@id": `${siteOrigin(configured)}/#organization` },
          ...(image ? { image } : {}),
        },
      };
    }),
  };
}
