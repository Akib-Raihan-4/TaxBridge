import { site } from '@/lib/site'

/** Placeholder home page — replaced in Phase 2 with CMS-driven sections. */
export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Coming soon</p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {site.name}
      </h1>
      <p className="max-w-prose text-lg text-muted">{site.description}</p>
    </section>
  )
}
