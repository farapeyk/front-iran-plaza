import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/backend/files/'],
      disallow: ['/api/', '/admin', '/content/', '/dashboard', '/login', '/complete-profile', '/design-system', '/cover', '/profile', '/user-info', '/subscription', '/payments', '/support'],
    },
    sitemap: new URL('/sitemap_index.xml', process.env.SITE_URL || 'https://iran-plaza.ir').href,
  };
}
