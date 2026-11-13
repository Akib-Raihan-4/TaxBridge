import type { Payload } from 'payload'

import { aboutPage, faqs, homePage, legalPages, services } from './content'

/** Skip cache revalidation — the seed runs outside Next.js. */
const context = { disableRevalidate: true }

/**
 * Fills an empty site with starter content. Safe to run more than once: existing
 * documents (matched by slug or question) and already-filled pages are left alone,
 * so it never overwrites an editor's work.
 */
export async function seed(payload: Payload): Promise<{ created: number; skipped: number }> {
  let created = 0
  let skipped = 0

  const serviceIds: number[] = []
  for (const [index, service] of services.entries()) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: service.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      serviceIds.push(existing.docs[0].id)
      skipped++
      continue
    }
    const doc = await payload.create({
      collection: 'services',
      context,
      data: {
        title: service.title,
        slug: service.slug,
        category: service.category,
        icon: service.icon as never,
        summary: service.summary,
        whoFor: service.whoFor,
        inclusions: service.inclusions.map((item) => ({ item })),
        order: index + 1,
      },
    })
    serviceIds.push(doc.id)
    created++
  }

  for (const [index, faq] of faqs.entries()) {
    const existing = await payload.count({
      collection: 'faqs',
      where: { question: { equals: faq.question } },
    })
    if (existing.totalDocs > 0) {
      skipped++
      continue
    }
    await payload.create({ collection: 'faqs', context, data: { ...faq, order: index + 1 } })
    created++
  }

  for (const page of legalPages) {
    const existing = await payload.count({
      collection: 'legal-pages',
      where: { slug: { equals: page.slug } },
    })
    if (existing.totalDocs > 0) {
      skipped++
      continue
    }
    await payload.create({ collection: 'legal-pages', context, data: page })
    created++
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (settings.businessName) {
    skipped++
  } else {
    await payload.updateGlobal({
      slug: 'site-settings',
      context,
      data: {
        businessName: 'TaxBridge',
        tagline: 'Accounting and tax services in New South Wales',
        address: { state: 'NSW' },
      },
    })
    created++
  }

  const home = await payload.findGlobal({ slug: 'home-page', depth: 0 })
  if (home.hero?.heading) {
    skipped++
  } else {
    await payload.updateGlobal({
      slug: 'home-page',
      context,
      data: {
        hero: homePage.hero,
        pillars: homePage.pillars.map((pillar) => ({ ...pillar })),
        about: homePage.about,
        featuredServices: serviceIds.slice(0, 6),
        cta: homePage.cta,
      },
    })
    created++
  }

  const about = await payload.findGlobal({ slug: 'about-page' })
  if (about.heading) {
    skipped++
  } else {
    await payload.updateGlobal({
      slug: 'about-page',
      context,
      data: {
        heading: aboutPage.heading,
        intro: aboutPage.intro,
        whyUs: aboutPage.whyUs.map((reason) => ({ ...reason })),
      },
    })
    created++
  }

  return { created, skipped }
}
