import type { Metadata } from 'next'

import { ContactDetails } from '@/components/sections/ContactDetails'
import { FaqList } from '@/components/sections/FaqList'
import { PageHeader } from '@/components/sections/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { getFaqs, getSiteSettings } from '@/lib/cms'
import { phoneHref } from '@/lib/format'
import { buildMetadata, businessJsonLd, faqJsonLd } from '@/lib/seo'

const description =
  'Book a consultation or ask a question. We will get back to you with a clear next step.'

export const metadata: Metadata = buildMetadata({ title: 'Contact', description, path: '/contact' })

export default async function ContactPage() {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs()])
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

      <section aria-labelledby="contact-details">
        <Container className="max-w-4xl py-16 sm:py-20">
          <h2 id="contact-details" className="mb-8 text-2xl font-medium sm:text-3xl">
            How to reach us
          </h2>
          <ContactDetails settings={settings} />
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
