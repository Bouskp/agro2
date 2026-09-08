import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/wp-admin/',
    },
    sitemap: 'https://agromakers.africa/sitemap.xml',
  }
}
