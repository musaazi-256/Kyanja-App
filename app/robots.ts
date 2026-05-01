import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/', '/auth/', '/api/'],
      },
    ],
    sitemap: 'https://www.kyanjajuniorschool.com/sitemap.xml',
  }
}
