import type { ReactNode } from 'react'

import { Container } from '@/components/ui/Container'

/** Standard top of an inner page: small label, serif h1, optional intro. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string | null
  title: string
  intro?: string | null
  children?: ReactNode
}) {
  return (
    <section className="border-b border-line">
      <Container className="py-14 sm:py-20">
        {eyebrow && <p className="mb-4 text-sm font-medium tracking-wide text-gold">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl leading-[1.1] font-normal tracking-tight sm:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
        {children && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">{children}</div>
        )}
      </Container>
    </section>
  )
}
