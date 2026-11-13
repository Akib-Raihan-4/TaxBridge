/**
 * Temporary placeholders used until the `site-settings` global exists in the CMS.
 * TODO: replace with real business details supplied by the client.
 */
export const site = {
  name: 'TaxBridge',
  description: 'Accounting and tax services in New South Wales.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const
