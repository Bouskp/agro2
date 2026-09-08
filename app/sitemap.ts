import { links } from '@/lib/utils'
import {
  getAllAgromagSlug,
  getAllEventSlugs,
  getAllPostsForSitemap,
} from '@/lib/wordpressApi'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsForSitemap()
  const events = await getAllEventSlugs()
  const magazines = await getAllAgromagSlug()

  const postUrls = posts.map((post) => ({
    url: `https://agromakers.africa/article/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const eventsUrls = events.map((event) => ({
    url: `https://agromakers.africa/events/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const magazinesUrls = magazines.map((mag) => ({
    url: `https://agromakers.africa/magazines/${mag.issue}`,
    lastModified: new Date(mag.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticPages = [
    ...links.map((link) => ({
      url: `https://agromakers.africa/${link.path}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]
  return [...staticPages, ...postUrls, ...eventsUrls, ...magazinesUrls]
}
