import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.webjothishanalyst.site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/ops',
        '/admin',
        '/api/private',
        '/auth',
        '/login',
        '/mfa',
        '/internal'
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
