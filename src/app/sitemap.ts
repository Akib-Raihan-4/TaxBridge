import type { MetadataRoute } from 'next'

import { getPosts, getServices } from '@/lib/cms'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getServices(), getPosts()])
  const staticRoutes = [
    '',
    '/services',
    '/pricing',
    '/about',
    '/resources',
    '/contact',
    '/privacy',
    '/terms',
  ]

  return [
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route}` })),
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: service.updatedAt,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/resources/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ]
}
