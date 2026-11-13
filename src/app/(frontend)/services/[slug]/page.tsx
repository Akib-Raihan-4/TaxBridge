import { Check } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CtaBand } from '@/components/sections/CtaBand'
import { FaqList } from '@/components/sections/FaqList'
import { PageHeader } from '@/components/sections/PageHeader'
import { hasRichText, RichText } from '@/components/sections/RichText'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { getServiceBySlug, getServices, getSiteSettings } from '@/lib/cms'
import { buildMetadata, faqJsonLd } from '@/lib/seo'
import { categoryLabels } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return buildMetadata({
    seo: service.seo,
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()])
  if (!service) notFound()

  const faqs = service.faqs ?? []

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <PageHeader
        eyebrow={categoryLabels[service.category]}
        title={service.title}
        intro={service.summary}
      >
        <ButtonLink href="/contact">Book a consultation</ButtonLink>
        <ButtonLink href="/services" variant="text">
          All services
        </ButtonLink>
      </PageHeader>

      <section>
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            {Boolean(service.inclusions?.length) && (
              <>
                <h2 className="text-2xl font-medium sm:text-3xl">What is included</h2>
                <ul className="mt-6 border-t border-line">
                  {service.inclusions?.map((inclusion) => (
                    <li
                      key={inclusion.id ?? inclusion.item}
                      className="flex gap-4 border-b border-line py-4 text-lg"
                    >
                      <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" />
                      {inclusion.item}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {hasRichText(service.body) && (
              <div className="mt-12">
                <RichText data={service.body} />
              </div>
            )}
          </div>

          {service.whoFor && (
            <aside className="h-fit rounded-2xl border border-line bg-card p-7">
              <h2 className="text-xl font-medium">Who it is for</h2>
              <p className="mt-3 leading-relaxed text-body">{service.whoFor}</p>
            </aside>
          )}
        </Container>
      </section>

      {faqs.length > 0 && (
        <section aria-labelledby="service-faqs" className="border-t border-line">
          <Container className="py-16 sm:py-20">
            <h2 id="service-faqs" className="mb-8 text-2xl font-medium sm:text-3xl">
              Common questions
            </h2>
            <FaqList faqs={faqs} />
          </Container>
        </section>
      )}

      <CtaBand
        heading={`Need help with ${service.title.toLowerCase()}?`}
        phone={settings.phones?.[0]?.number}
      />
    </>
  )
}
