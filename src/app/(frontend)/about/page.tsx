import { Check } from 'lucide-react'
import type { Metadata } from 'next'

import { CtaBand } from '@/components/sections/CtaBand'
import { PageHeader } from '@/components/sections/PageHeader'
import { hasRichText, RichText } from '@/components/sections/RichText'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { Container } from '@/components/ui/Container'
import { getAboutPage, getSiteSettings } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage()
  return buildMetadata({
    seo: about.seo,
    title: 'About us',
    description: about.intro,
    path: '/about',
  })
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAboutPage(), getSiteSettings()])

  return (
    <>
      <PageHeader eyebrow="About" title={about.heading || 'About us'} intro={about.intro} />

      {hasRichText(about.story) && (
        <section>
          <Container className="py-16 sm:py-20">
            <RichText data={about.story} />
          </Container>
        </section>
      )}

      {Boolean(about.credentials?.length) && (
        <section aria-labelledby="about-credentials" className="border-b border-line">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <SectionHeading id="about-credentials" title="Qualifications and experience" />
            <ul className="border-t border-line">
              {about.credentials?.map((credential) => (
                <li
                  key={credential.id ?? credential.title}
                  className="flex gap-4 border-b border-line py-4"
                >
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-lg text-ink">{credential.title}</p>
                    {credential.detail && <p className="mt-0.5 text-muted">{credential.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {Boolean(about.whyUs?.length) && (
        <section aria-labelledby="about-why">
          <Container className="py-16 sm:py-20">
            <SectionHeading id="about-why" eyebrow="Why choose us" title="What you can expect" />
            <ul className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
              {about.whyUs?.map((reason, index) => (
                <li key={reason.id ?? reason.title} className="border-t border-line pt-6">
                  <p aria-hidden="true" className="font-serif text-sm text-gold">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-xl font-medium">{reason.title}</h3>
                  {reason.description && (
                    <p className="mt-2 leading-relaxed text-muted">{reason.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand phone={settings.phones?.[0]?.number} />
    </>
  )
}
