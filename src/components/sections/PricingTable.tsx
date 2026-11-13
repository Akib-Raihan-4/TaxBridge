import Link from 'next/link'

import { formatPrice } from '@/lib/format'
import type { PricingItem } from '@/payload-types'

export function PricingTable({ items }: { items: PricingItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-card p-8 sm:p-10">
        <h2 className="text-2xl font-medium">We quote before we start</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          Every situation is a little different, so we give you a fixed quote up front. Tell us what
          you need and we will come back with a price.
        </p>
      </div>
    )
  }

  return (
    <ul className="border-t border-line">
      {items.map((item) => {
        const service = typeof item.service === 'object' ? item.service : null
        return (
          <li
            key={item.id}
            className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <div>
              <h2 className="font-serif text-xl text-ink">
                {service ? (
                  <Link
                    href={`/services/${service.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </h2>
              {item.note && <p className="mt-1 text-[0.9375rem] text-muted">{item.note}</p>}
            </div>
            <p className="shrink-0 text-body">
              <span className="text-sm text-muted">from </span>
              <span className="font-serif text-2xl text-ink">{formatPrice(item.fromPrice)}</span>
              <span className="text-sm text-muted">
                {' '}
                {item.gst === 'exclusive' ? '+ GST' : 'incl. GST'}
              </span>
            </p>
          </li>
        )
      })}
    </ul>
  )
}
