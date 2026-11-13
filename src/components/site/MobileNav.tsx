'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  links: readonly { label: string; href: string }[]
  phone?: { display: string; href: string } | null
}

/** Phone-size navigation: a menu button that opens a full-width panel. */
export function MobileNav({ links, phone }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close when Escape is pressed
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-deep"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        {open ? (
          <X aria-hidden="true" className="size-6" />
        ) : (
          <Menu aria-hidden="true" className="size-6" />
        )}
      </button>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 pb-6 pt-2 shadow-[0_12px_24px_-16px_rgb(31_58_46/0.35)]"
      >
        <ul>
          {links.map((link) => (
            <li key={link.href} className="border-b border-line">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
                className="flex min-h-12 items-center font-serif text-xl text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-3">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-medium text-paper"
          >
            Book a consultation
          </Link>
          {phone && (
            <a
              href={phone.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink px-6 font-medium text-ink"
            >
              Call {phone.display}
            </a>
          )}
        </div>
      </nav>
    </div>
  )
}
