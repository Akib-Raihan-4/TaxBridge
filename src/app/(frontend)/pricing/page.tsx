import type { Metadata } from 'next'

import { CtaBand } from '@/components/sections/CtaBand'
import { FaqList } from '@/components/sections/FaqList'
import { PageHeader } from '@/components/sections/PageHeader'
import { PricingTable } from '@/components/sections/PricingTable'
import { Container } from '@/components/ui/Container'
import { getFaqs, getPricingItems, getSiteSettings } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'

const description =
  'Guide prices for our most common services. We confirm a quote before starting any work.'

export const metadata: Metadata = buildMetadata({ title: 'Pricing', description, path: '/pricing' })

export default async function PricingPage() {
  const [items, faqs, settings] = await Promise.all([
    getPricingItems(),
    getFaqs(),
    getSiteSettings(),
  ])
  const feeFaqs = faqs.filter((faq) => faq.category === 'fees')

  return (
    <>
      <PageHeader eyebrow="Pricing" title="Clear fees, agreed up front" intro={description} />

      <section>
        <Container className="max-w-4xl py-16 sm:py-20">
          <PricingTable items={items} />
          {items.length > 0 && (
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Prices are a guide only and depend on the complexity of your affairs. We will confirm
              your fee before we begin.
            </p>
          )}
        </Container>
      </section>

      {feeFaqs.length > 0 && (
        <section aria-labelledby="pricing-faqs" className="border-t border-line">
          <Container className="max-w-4xl py-16 sm:py-20">
            <h2 id="pricing-faqs" className="mb-8 text-2xl font-medium sm:text-3xl">
              Questions about fees
            </h2>
            <FaqList faqs={feeFaqs} />
          </Container>
        </section>
      )}

      <CtaBand
        heading="Want a quote?"
        body="Tell us what you need and we will come back with a clear price."
        button={{ label: 'Request a quote', href: '/contact' }}
        phone={settings.phones?.[0]?.number}
      />
    </>
  )
}
