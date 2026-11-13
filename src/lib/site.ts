/** Canonical site URL, used for metadata, the sitemap and structured data. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
] as const

export const categoryLabels = {
  individuals: 'For individuals',
  business: 'For business',
  super: 'Superannuation',
  advisory: 'Advice and planning',
  registrations: 'Starting out',
} as const

export type ServiceCategory = keyof typeof categoryLabels
