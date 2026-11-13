import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

import { formatAddress } from '@/components/site/Footer'
import { phoneHref } from '@/lib/format'
import type { SiteSetting } from '@/payload-types'

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-line py-5">
      <div className="mt-0.5 text-gold">{icon}</div>
      <div>
        <dt className="text-sm font-medium text-muted">{label}</dt>
        <dd className="mt-1 text-lg leading-relaxed text-ink">{children}</dd>
      </div>
    </div>
  )
}

const linkClass = 'underline-offset-4 hover:underline'

export function ContactDetails({ settings }: { settings: SiteSetting }) {
  const address = formatAddress(settings.address)
  const hasAny =
    Boolean(settings.phones?.length) ||
    Boolean(settings.email) ||
    Boolean(address) ||
    Boolean(settings.openingHours?.length)

  if (!hasAny) {
    return (
      <p className="rounded-2xl border border-line bg-card p-8 leading-relaxed text-muted">
        Our contact details will be published here shortly.
      </p>
    )
  }

  return (
    <dl className="border-t border-line">
      {Boolean(settings.phones?.length) && (
        <Row icon={<Phone aria-hidden="true" className="size-5" />} label="Phone">
          {settings.phones?.map((phone) => (
            <span key={phone.id ?? phone.number} className="block">
              <a href={phoneHref(phone.number)} className={linkClass}>
                {phone.number}
              </a>
              {phone.label && <span className="text-base text-muted"> · {phone.label}</span>}
            </span>
          ))}
        </Row>
      )}
      {settings.email && (
        <Row icon={<Mail aria-hidden="true" className="size-5" />} label="Email">
          <a href={`mailto:${settings.email}`} className={`${linkClass} break-all`}>
            {settings.email}
          </a>
        </Row>
      )}
      {address && (
        <Row icon={<MapPin aria-hidden="true" className="size-5" />} label="Office">
          {address}
          {settings.address?.mapUrl && (
            <a
              href={settings.address.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1 block text-base ${linkClass}`}
            >
              Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {settings.parkingNote && (
            <span className="mt-1 block text-base text-muted">{settings.parkingNote}</span>
          )}
        </Row>
      )}
      {Boolean(settings.openingHours?.length) && (
        <Row icon={<Clock aria-hidden="true" className="size-5" />} label="Opening hours">
          {settings.openingHours?.map((row) => (
            <span key={row.id ?? row.days} className="block">
              {row.days}: {row.hours}
              {row.note && <span className="text-base text-muted"> ({row.note})</span>}
            </span>
          ))}
        </Row>
      )}
    </dl>
  )
}
