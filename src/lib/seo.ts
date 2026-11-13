import type { Metadata } from 'next'

import type { Media, SiteSetting } from '@/payload-types'

import { siteUrl } from './site'

type Seo =
  { title?: string | null; description?: string | null; image?: number | Media | null } | undefined

/** Page metadata from a document's SEO fields, falling back to sensible defaults. */
export function buildMetadata(opts: {
  seo?: Seo
  title: string
  description?: string | null
  path: string
}): Metadata {
  const title = opts.seo?.title || opts.title
  const description = opts.seo?.description || opts.description || undefined
  const image =
    opts.seo?.image && typeof opts.seo.image === 'object' ? opts.seo.image.url : undefined

  return {
    title,
    description,
    alternates: { canonical: opts.path },
    openGraph: {
      title,
      description,
      url: opts.path,
      type: 'website',
      locale: 'en_AU',
      ...(image ? { images: [image] } : {}),
    },
  }
}

/** schema.org AccountingService. Only includes facts the business has entered. */
export function businessJsonLd(settings: SiteSetting) {
  const { address } = settings
  const hasAddress = Boolean(address?.street || address?.suburb)
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: settings.businessName,
    url: siteUrl,
    ...(settings.phones?.[0]?.number ? { telephone: settings.phones[0].number } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: address?.street || undefined,
            addressLocality: address?.suburb || undefined,
            addressRegion: address?.state || undefined,
            postalCode: address?.postcode || undefined,
            addressCountry: 'AU',
          },
        }
      : {}),
    areaServed: 'New South Wales',
  }
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/** Serialise for a <script type="application/ld+json"> tag without allowing tag injection. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
