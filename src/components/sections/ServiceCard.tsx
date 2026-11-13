import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import type { Service } from '@/payload-types'

export function ServiceCard({
  service,
}: {
  service: Pick<Service, 'title' | 'slug' | 'summary' | 'icon'>
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 transition-colors duration-200 hover:border-ink"
    >
      <Icon name={service.icon} className="size-7 text-gold" />
      <h3 className="mt-5 text-xl leading-snug font-medium">{service.title}</h3>
      <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted">{service.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink">
        Learn more
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  )
}

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  )
}
