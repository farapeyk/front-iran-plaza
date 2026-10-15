import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/content', '/dashboard', '/login', '/complete-profile', '/design-system', '/cover', '/profile', '/user-info', '/subscription', '/payments', '/support'] }, sitemap: process.env.SITE_URL ? new URL('/sitemap.xml', process.env.SITE_URL).href : undefined };
}
