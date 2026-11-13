import { Phone } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { phoneHref } from '@/lib/format'
import { navLinks } from '@/lib/site'
import type { SiteSetting } from '@/payload-types'

import { MobileNav } from './MobileNav'

export function Header({ settings }: { settings: SiteSetting }) {
  const number = settings.phones?.[0]?.number
  const phone = number ? { display: number, href: phoneHref(number) } : null

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <Container className="relative flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-serif text-[1.375rem] font-medium tracking-tight text-ink">
          {settings.businessName}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.9375rem]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-body underline-offset-[6px] transition-colors hover:text-ink hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {phone && (
            <a
              href={phone.href}
              className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-ink underline-offset-4 hover:underline"
            >
              <Phone aria-hidden="true" className="size-4" />
              {phone.display}
            </a>
          )}
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper transition-colors duration-200 hover:bg-ink-hover"
          >
            Book a consultation
          </Link>
        </div>

        <MobileNav links={navLinks} phone={phone} />
      </Container>
    </header>
  )
}
