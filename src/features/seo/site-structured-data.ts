import { absoluteSiteUrl, siteOrigin } from "@/features/seo/article-seo";

export function buildSiteStructuredData(configured = process.env.SITE_URL) {
  const origin = siteOrigin(configured);
  const organizationId = `${origin}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "ایران پلازا",
        alternateName: "Iran Plaza",
        url: `${origin}/`,
        logo: {
          "@type": "ImageObject",
          url: absoluteSiteUrl("/design/brand/logo-primary.webp", configured),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: "ایران پلازا",
        alternateName: "Iran Plaza",
        inLanguage: "fa-IR",
        publisher: { "@id": organizationId },
      },
    ],
  };
}
