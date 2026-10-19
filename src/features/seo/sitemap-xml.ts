const OFFICIAL_SITE_URL = "https://iran-plaza.ir";

export const CHILD_SITEMAP_PATHS = [
  "/post-sitemap.xml",
  "/page-sitemap.xml",
  "/business-sitemap.xml",
  "/category-sitemap.xml",
] as const;

export const STATIC_PAGE_PATHS = [
  "/",
  "/categories",
  "/business-registration",
  "/faq",
  "/about",
  "/contact",
  "/terms",
] as const;

export type SitemapIndexEntry = {
  loc: string;
  lastModified?: Date | string;
};

export type SitemapUrlEntry = SitemapIndexEntry & {
  images?: string[];
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function isoDate(value: Date | string | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Returns one canonical HTTP(S) origin even when SITE_URL contains a path. */
export function siteOrigin(configuredUrl = process.env.SITE_URL): string {
  const url = new URL(configuredUrl?.trim() || OFFICIAL_SITE_URL);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use http or https");
  }
  return url.origin;
}

export function absoluteSiteUrl(path: string, origin = siteOrigin()): string {
  return new URL(path, `${origin}/`).href;
}

export function renderSitemapIndex(entries: SitemapIndexEntry[]): string {
  const body = entries.map(entry => {
    const lastModified = isoDate(entry.lastModified);
    return [
      "  <sitemap>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
      "  </sitemap>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</sitemapindex>",
  ].join("\n");
}

export function renderUrlSet(entries: SitemapUrlEntry[]): string {
  const hasImages = entries.some(entry => entry.images?.length);
  const namespace = hasImages
    ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : "";
  const body = entries.map(entry => {
    const lastModified = isoDate(entry.lastModified);
    return [
      "  <url>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
      ...(entry.images ?? []).map(image => [
        "    <image:image>",
        `      <image:loc>${escapeXml(image)}</image:loc>`,
        "    </image:image>",
      ].join("\n")),
      "  </url>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${namespace}>`,
    body,
    "</urlset>",
  ].join("\n");
}

export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/xml; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}

export function sitemapUnavailableResponse(): Response {
  return new Response("Sitemap data is temporarily unavailable.\n", {
    status: 503,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "Retry-After": "300",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
