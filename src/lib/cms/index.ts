/**
 * Cached content readers for pages. Results are cached until the matching
 * collection/global changes — the Payload hooks in `src/hooks/revalidate.ts`
 * expire the tag — so visitors never wait on the database.
 *
 * The cache tag is always the collection or global slug.
 */
import { unstable_cache } from 'next/cache'

import * as q from './queries'

const cached = <Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  tag: string,
  key: string,
) => unstable_cache(fn, [key], { tags: [tag] })

export const getSiteSettings = cached(q.querySiteSettings, 'site-settings', 'site-settings')
export const getHomePage = cached(q.queryHomePage, 'home-page', 'home-page')
export const getAboutPage = cached(q.queryAboutPage, 'about-page', 'about-page')
export const getServices = cached(q.queryServices, 'services', 'services')
export const getServiceBySlug = cached(q.queryServiceBySlug, 'services', 'service-by-slug')
export const getPricingItems = cached(q.queryPricingItems, 'pricing-items', 'pricing-items')
export const getTestimonials = cached(q.queryTestimonials, 'testimonials', 'testimonials')
export const getFaqs = cached(q.queryFaqs, 'faqs', 'faqs')
export const getPosts = cached(q.queryPosts, 'posts', 'posts')
export const getPostBySlug = cached(q.queryPostBySlug, 'posts', 'post-by-slug')
export const getLegalPageBySlug = cached(
  q.queryLegalPageBySlug,
  'legal-pages',
  'legal-page-by-slug',
)
