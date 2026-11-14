import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'
import { ContactDetails } from '@/components/sections/ContactDetails'
import { FaqList } from '@/components/sections/FaqList'
import { PageHeader } from '@/components/sections/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { getFaqs, getServices, getSiteSettings } from '@/lib/cms'
import { phoneHref } from '@/lib/format'
import { buildMetadata, businessJsonLd, faqJsonLd } from '@/lib/seo'

import { sendEnquiry } from './actions'

const description =
  'Book a consultation or ask a question. We will get back to you with a clear next step.'

export const metadata: Metadata = buildMetadata({ title: 'Contact', description, path: '/contact' })

export default async function ContactPage() {
  const [settings, faqs, services] = await Promise.all([
    getSiteSettings(),
    getFaqs(),
    getServices(),
  ])
  const phone = settings.phones?.[0]?.number

  return (
    <>
      <JsonLd data={businessJsonLd(settings)} />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <PageHeader eyebrow="Contact" title="Let’s talk about your tax" intro={description}>
        {phone && <ButtonLink href={phoneHref(phone)}>Call {phone}</ButtonLink>}
        {settings.email && (
          <ButtonLink href={`mailto:${settings.email}`} variant={phone ? 'outline' : 'primary'}>
            Email us
          </ButtonLink>
        )}
      </PageHeader>

      <section>
        <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <h2 id="contact-form" className="text-2xl font-medium sm:text-3xl">
              Send us a message
            </h2>
            <p className="mt-3 mb-8 max-w-prose leading-relaxed text-muted">
              Tell us a little about your situation and we will come back to you with a clear next
              step.
            </p>
            <ContactForm
              action={sendEnquiry}
              services={services.map((service) => service.title)}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
            />
          </div>
          <div>
            <h2 id="contact-details" className="mb-8 text-2xl font-medium sm:text-3xl">
              How to reach us
            </h2>
            <ContactDetails settings={settings} />
          </div>
        </Container>
      </section>

      {faqs.length > 0 && (
        <section aria-labelledby="contact-faqs" className="border-t border-line bg-paper-deep">
          <Container className="max-w-4xl py-16 sm:py-20">
            <h2 id="contact-faqs" className="mb-8 text-2xl font-medium sm:text-3xl">
              Before you get in touch
            </h2>
            <FaqList faqs={faqs} />
          </Container>
        </section>
      )}
    </>
  )
}
