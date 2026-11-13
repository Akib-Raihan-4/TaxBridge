import type { Metadata } from 'next'

import { LegalPage } from '@/components/sections/LegalPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Terms of use', path: '/terms' })

export default function Page() {
  return <LegalPage slug="terms" />
}
