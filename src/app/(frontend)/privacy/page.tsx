import type { Metadata } from 'next'

import { LegalPage } from '@/components/sections/LegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Privacy policy', path: '/privacy' })

export default function Page() {
  return <LegalPage slug="privacy" />
}
