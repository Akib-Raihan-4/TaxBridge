/**
 * Uncached content queries. Every query runs as an anonymous visitor
 * (`overrideAccess: false`), so drafts, unapproved testimonials and private
 * collections can never leak onto the public site.
 *
 * Pages should import the cached versions from `@/lib/cms` instead.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const publicRead = { overrideAccess: false, depth: 1 } as const

async function client() {
  return getPayload({ config })
}

export async function querySiteSettings() {
  return (await client()).findGlobal({ slug: 'site-settings', ...publicRead })
}

export async function queryHomePage() {
  return (await client()).findGlobal({ slug: 'home-page', ...publicRead })
}

export async function queryAboutPage() {
  return (await client()).findGlobal({ slug: 'about-page', ...publicRead })
}

export async function queryServices() {
  const { docs } = await (
    await client()
  ).find({ collection: 'services', sort: 'order', limit: 100, ...publicRead })
  return docs
}

export async function queryServiceBySlug(slug: string) {
  const { docs } = await (
    await client()
  ).find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, ...publicRead })
  return docs[0] ?? null
}

export async function queryPricingItems() {
  const { docs } = await (
    await client()
  ).find({ collection: 'pricing-items', sort: 'order', limit: 100, ...publicRead })
  return docs
}

export async function queryTestimonials() {
  const { docs } = await (
    await client()
  ).find({ collection: 'testimonials', limit: 50, ...publicRead })
  return docs
}

export async function queryFaqs() {
  const { docs } = await (
    await client()
  ).find({ collection: 'faqs', sort: 'order', limit: 100, ...publicRead })
  return docs
}

export async function queryPosts() {
  const { docs } = await (
    await client()
  ).find({ collection: 'posts', sort: '-publishedAt', limit: 100, ...publicRead })
  return docs
}

export async function queryPostBySlug(slug: string) {
  const { docs } = await (
    await client()
  ).find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, ...publicRead })
  return docs[0] ?? null
}

export async function queryLegalPageBySlug(slug: string) {
  const { docs } = await (
    await client()
  ).find({ collection: 'legal-pages', where: { slug: { equals: slug } }, limit: 1, ...publicRead })
  return docs[0] ?? null
}
