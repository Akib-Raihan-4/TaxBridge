/**
 * Turn a displayed Australian phone number into a `tel:` href.
 * "(02) 9000 0000" -> "tel:+61290000000", "1300 000 000" -> "tel:1300000000"
 */
export function phoneHref(display: string): string {
  const digits = display.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return `tel:${digits}`
  // 13/1300/1800 numbers are not dialled with a country code
  if (/^1[38]/.test(digits)) return `tel:${digits}`
  if (digits.startsWith('0')) return `tel:+61${digits.slice(1)}`
  return `tel:${digits}`
}

/** Format a whole-dollar "from" price, e.g. 1100 -> "$1,100". */
export function formatPrice(dollars: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(dollars)
}

/** Format an ISO date for display, e.g. "14 November 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Sydney',
  }).format(new Date(iso))
}
