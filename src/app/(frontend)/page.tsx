import type { Metadata } from 'next'

import { CtaBand } from '@/components/sections/CtaBand'
import { FaqList } from '@/components/sections/FaqList'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { ServiceGrid } from '@/components/sections/ServiceCard'
import { Testimonials } from '@/components/sections/Testimonials'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { getFaqs, getHomePage, getServices, getSiteSettings, getTestimonials } from '@/lib/cms'
import { buildMetadata, businessJsonLd } from '@/lib/seo'
import type { Service } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  return {
    ...buildMetadata({
      seo: home.seo,
      title: settings.tagline
        ? `${settings.businessName} — ${settings.tagline}`
        : settings.businessName,
      description: home.hero?.subheading,
      path: '/',
    }),
    // The home page title stands alone (no "| Business name" suffix)
    title: {
      absolute: home.seo?.title || `${settings.businessName} — Accounting and tax services`,
    },
  }
}

export default async function HomePage() {
  const [home, settings, allServices, testimonials, faqs] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getServices(),
    getTestimonials(),
    getFaqs(),
  ])

  const featured = (home.featuredServices ?? []).filter(
    (service): service is Service => typeof service === 'object',
  )
  const services = featured.length > 0 ? featured : allServices.slice(0, 6)
  const phone = settings.phones?.[0]?.number
  const hero = home.hero

  return (
    <>
      <JsonLd data={businessJsonLd(settings)} />

      <section>
        <Container className="flex flex-col items-center py-20 text-center sm:py-28">
          {hero?.eyebrow && (
            <p className="mb-5 text-sm font-medium tracking-wide text-gold">{hero.eyebrow}</p>
          )}
          <h1 className="max-w-3xl text-[2.75rem] leading-[1.05] font-normal tracking-tight sm:text-6xl lg:text-7xl">
            {hero?.heading || settings.businessName}
          </h1>
          {hero?.subheading && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              {hero.subheading}
            </p>
          )}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <ButtonLink href={hero?.primaryButton?.href || '/contact'}>
              {hero?.primaryButton?.label || 'Book a consultation'}
            </ButtonLink>
            <ButtonLink href={hero?.secondaryButton?.href || '/services'} variant="text">
              {hero?.secondaryButton?.label || 'See our services'}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {Boolean(home.pillars?.length) && (
        <section aria-label="What we do" className="border-y border-line">
          <Container>
            <ul className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
              {home.pillars?.map((pillar, index) => (
                <li
                  key={pillar.id ?? pillar.title}
                  className="py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0"
                >
                  <p aria-hidden="true" className="font-serif text-sm text-gold">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 text-2xl font-medium">{pillar.title}</h2>
                  {pillar.description && (
                    <p className="mt-2 leading-relaxed text-muted">{pillar.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {(home.about?.heading || home.about?.body) && (
        <section>
          <Container className="grid gap-8 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
            <h2 className="text-3xl leading-tight font-normal tracking-tight sm:text-4xl">
              {home.about.heading}
            </h2>
            <div>
              <p className="text-lg leading-relaxed text-body">{home.about.body}</p>
              <ButtonLink href="/about" variant="text" className="mt-4">
                More about us
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      {services.length > 0 && (
        <section aria-labelledby="home-services" className="bg-paper-deep">
          <Container className="py-20 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                id="home-services"
                eyebrow="Services"
                title="How we can help"
                intro="From a single tax return to looking after the books for your whole business."
              />
              <ButtonLink href="/services" variant="text">
                All services
              </ButtonLink>
            </div>
            <div className="mt-10">
              <ServiceGrid services={services} />
            </div>
          </Container>
        </section>
      )}

      {testimonials.length > 0 && (
        <section aria-labelledby="home-testimonials">
          <Container className="py-20 sm:py-24">
            <SectionHeading
              id="home-testimonials"
              eyebrow="Client feedback"
              title="What our clients say"
            />
            <div className="mt-10">
              <Testimonials testimonials={testimonials.slice(0, 3)} />
            </div>
          </Container>
        </section>
      )}

      {faqs.length > 0 && (
        <section aria-labelledby="home-faqs">
          <Container className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <SectionHeading
              id="home-faqs"
              eyebrow="Common questions"
              title="Good to know"
              intro="Answers to the questions we hear most often."
            />
            <FaqList faqs={faqs.slice(0, 5)} />
          </Container>
        </section>
      )}

      <CtaBand
        heading={home.cta?.heading}
        body={home.cta?.body}
        button={home.cta?.button}
        phone={phone}
      />
    </>
  )
}
