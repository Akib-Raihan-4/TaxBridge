import type { EnquiryInput } from './schema'

const env = (key: string): string => (process.env[key] ?? '').trim()

/**
 * Cloudflare Turnstile check. When no secret key is configured (local dev, tests)
 * the check is skipped and the hidden honeypot field is the only spam protection.
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = env('TURNSTILE_SECRET_KEY')
  if (!secret) return true
  if (!token) return false

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token }),
  })
  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}

export function enquiryEmailText(enquiry: EnquiryInput): string {
  return [
    'New enquiry from the website contact form',
    '',
    `Name:    ${enquiry.name}`,
    `Email:   ${enquiry.email}`,
    `Phone:   ${enquiry.phone || '—'}`,
    `Service: ${enquiry.service || '—'}`,
    '',
    'Message:',
    enquiry.message,
    '',
    'Reply to this email to respond directly to the sender.',
    'The enquiry is also saved in the website admin under Enquiries.',
  ].join('\n')
}

/**
 * Email the enquiry to the firm through Resend. Does nothing unless both
 * RESEND_API_KEY and CONTACT_TO_EMAIL are set.
 */
export async function sendEnquiryEmail(enquiry: EnquiryInput): Promise<void> {
  const apiKey = env('RESEND_API_KEY')
  const to = env('CONTACT_TO_EMAIL')
  if (!apiKey || !to) return

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Until a sending domain is verified in Resend, only its shared test sender works
      from: env('CONTACT_FROM_EMAIL') || 'Website enquiries <onboarding@resend.dev>',
      to: [to],
      reply_to: enquiry.email,
      subject: `New enquiry from ${enquiry.name}`,
      text: enquiryEmailText(enquiry),
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${(await response.text()).slice(0, 300)}`)
  }
}
