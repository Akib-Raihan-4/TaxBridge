import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { phoneHref } from '@/lib/format'

type Props = {
  heading?: string | null
  body?: string | null
  button?: { label?: string | null; href?: string | null } | null
  phone?: string | null
}

/** Closing call to action. Every page ends with one. */
export function CtaBand({ heading, body, button, phone }: Props) {
  return (
    <section className="bg-paper-deep">
      <Container className="flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl leading-tight font-normal tracking-tight sm:text-4xl">
            {heading || 'Ready to get your tax sorted?'}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {body || 'Tell us what you need and we will get back to you with a clear next step.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={button?.href || '/contact'}>
            {button?.label || 'Get in touch'}
          </ButtonLink>
          {phone && (
            <ButtonLink href={phoneHref(phone)} variant="outline">
              Call {phone}
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  )
}
