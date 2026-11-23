import type { BusinessControllerGetFullBySlug200 } from "@/design/api/generated/models/businessControllerGetFullBySlug200";
import { absoluteSiteUrl, siteOrigin } from "@/features/seo/article-seo";

export function buildBusinessStructuredData(
  business: BusinessControllerGetFullBySlug200,
  configured = process.env.SITE_URL,
) {
  const origin = siteOrigin(configured);
  const businessUrl = absoluteSiteUrl(`/businesses/${encodeURIComponent(business.slug)}`, configured);
  const businessId = `${businessUrl}#business`;
  const addressParts = [business.neighborhood, business.address].filter((value): value is string => Boolean(value?.trim()));
  const sameAs = business.socialMedia && typeof business.socialMedia === "object" && !Array.isArray(business.socialMedia)
    ? Object.values(business.socialMedia).filter((value): value is string => typeof value === "string" && /^https:\/\//i.test(value))
    : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: business.name,
        url: businessUrl,
        ...(business.description ? { description: business.description } : {}),
        ...(business.phone ? { telephone: business.phone } : {}),
        ...(business.website ? { sameAs: [business.website, ...sameAs] } : sameAs.length ? { sameAs } : {}),
        ...(business.logoId ? { image: absoluteSiteUrl(`/api/backend/files/${encodeURIComponent(business.logoId)}`, configured) } : {}),
        ...(addressParts.length || business.city ? {
          address: {
            "@type": "PostalAddress",
            ...(addressParts.length ? { streetAddress: addressParts.join("، ") } : {}),
            ...(business.city ? { addressLocality: business.city } : {}),
            addressCountry: "IR",
          },
        } : {}),
        ...(business.latitude != null && business.longitude != null ? {
          geo: { "@type": "GeoCoordinates", latitude: business.latitude, longitude: business.longitude },
        } : {}),
        ...(business.workingHours.length ? {
          openingHoursSpecification: business.workingHours.flatMap((hours) => [
            hours.openTime1 && hours.closeTime1 ? {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: hours.weekday,
              opens: hours.openTime1,
              closes: hours.closeTime1,
            } : null,
            hours.isTwoShift && hours.openTime2 && hours.closeTime2 ? {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: hours.weekday,
              opens: hours.openTime2,
              closes: hours.closeTime2,
            } : null,
          ].filter((hours): hours is NonNullable<typeof hours> => hours !== null)),
        } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${businessUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "خانه", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "کسب‌وکارها", item: absoluteSiteUrl("/businesses/", configured) },
          { "@type": "ListItem", position: 3, name: business.name, item: businessUrl },
        ],
      },
    ],
  };
}
