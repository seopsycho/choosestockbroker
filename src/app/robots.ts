import type { MetadataRoute } from 'next'

const BASE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.choosestockbroker.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
