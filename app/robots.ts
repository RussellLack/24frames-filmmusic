import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://24frames-filmmusic.com/sitemap.xml',
    host: 'https://24frames-filmmusic.com',
  }
}
