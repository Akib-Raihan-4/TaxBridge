import type { Metadata } from 'next'

import { CtaBand } from '@/components/sections/CtaBand'
import { PageHeader } from '@/components/sections/PageHeader'
import { ServiceGrid } from '@/components/sections/ServiceCard'
import { Container } from '@/components/ui/Container'
import { getServices, getSiteSettings } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'
import { categoryLabels, type ServiceCategory } from '@/lib/site'

const description =
  'Tax returns, BAS, bookkeeping, self-managed super and business advice for individuals and businesses.'

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description,
  path: '/services',
})

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()])
  const categories = (Object.keys(categoryLabels) as ServiceCategory[])
    .map((category) => ({
      category,
      label: categoryLabels[category],
      services: services.filter((service) => service.category === category),
    }))
    .filter((group) => group.services.length > 0)

  return (
    <>
      <PageHeader eyebrow="Services" title="Accounting and tax services" intro={description} />

      {categories.length === 0 && (
        <Container className="py-16">
          <p className="text-lg text-muted">Our services will be listed here shortly.</p>
        </Container>
      )}

      {categories.map((group) => (
        <section
          key={group.category}
          aria-labelledby={`services-${group.category}`}
          className="border-b border-line"
        >
          <Container className="py-14 sm:py-16">
            <h2 id={`services-${group.category}`} className="text-2xl font-medium sm:text-3xl">
              {group.label}
            </h2>
            <div className="mt-8">
              <ServiceGrid services={group.services} />
            </div>
          </Container>
        </section>
      ))}

      <CtaBand
        heading="Not sure which service you need?"
        body="Tell us about your situation and we will point you in the right direction."
        phone={settings.phones?.[0]?.number}
      />
    </>
  )
}
