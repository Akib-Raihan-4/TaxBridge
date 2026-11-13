import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { phoneHref } from '@/lib/format'
import { navLinks } from '@/lib/site'
import type { SiteSetting } from '@/payload-types'

export function formatAddress(address: SiteSetting['address']): string | null {
  if (!address?.street && !address?.suburb) return null
  const locality = [address.suburb, address.state, address.postcode].filter(Boolean).join(' ')
  return [address.street, locality].filter(Boolean).join(', ')
}

export function Footer({ settings }: { settings: SiteSetting }) {
  const address = formatAddress(settings.address)
  const year = new Date().getFullYear()
  const headingClass = 'font-sans text-sm font-semibold text-paper'
  const linkClass =
    'inline-flex min-h-11 items-center text-paper/85 underline-offset-4 hover:text-paper hover:underline sm:min-h-0 sm:py-1'

  return (
    <footer className="bg-ink text-paper/85">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="font-serif text-2xl font-medium text-paper">{settings.businessName}</p>
          {settings.tagline && (
            <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed">{settings.tagline}</p>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className={headingClass}>Explore</h2>
          <ul className="mt-3 text-[0.9375rem]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>Contact</h2>
          <ul className="mt-3 text-[0.9375rem]">
            {settings.phones?.map((phone) => (
              <li key={phone.id ?? phone.number}>
                <a href={phoneHref(phone.number)} className={linkClass}>
                  {phone.label ? `${phone.label}: ` : ''}
                  {phone.number}
                </a>
              </li>
            ))}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className={linkClass}>
                  {settings.email}
                </a>
              </li>
            )}
            {address && <li className="py-1 leading-relaxed">{address}</li>}
            {!settings.phones?.length && !settings.email && !address && (
              <li>
                <Link href="/contact" className={linkClass}>
                  Get in touch
                </Link>
              </li>
            )}
          </ul>
        </div>

        {Boolean(settings.openingHours?.length) && (
          <div>
            <h2 className={headingClass}>Opening hours</h2>
            <dl className="mt-3 space-y-1.5 text-[0.9375rem]">
              {settings.openingHours?.map((row) => (
                <div key={row.id ?? row.days} className="flex justify-between gap-4">
                  <dt>{row.days}</dt>
                  <dd className="text-right text-paper">
                    {row.hours}
                    {row.note && <span className="block text-sm text-paper/75">{row.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Container>

      <div className="border-t border-paper/15">
        <Container className="flex flex-col gap-3 py-6 text-sm leading-relaxed text-paper/75">
          {(settings.abn || settings.taxAgentNumber || Boolean(settings.memberships?.length)) && (
            <p>
              {[
                settings.abn && `ABN ${settings.abn}`,
                settings.taxAgentNumber && `Registered tax agent ${settings.taxAgentNumber}`,
                ...(settings.memberships?.map((membership) => membership.name) ?? []),
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
          {settings.showPslStatement && (
            <p>Liability limited by a scheme approved under Professional Standards Legislation.</p>
          )}
          {settings.footerNote && <p>{settings.footerNote}</p>}
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p>
              © {year} {settings.businessName}. All rights reserved.
            </p>
            <ul className="flex gap-5">
              <li>
                <Link href="/privacy" className={linkClass}>
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={linkClass}>
                  Terms of use
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  )
}
