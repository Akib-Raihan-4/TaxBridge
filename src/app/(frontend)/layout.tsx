import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { SkipLink } from '@/components/SkipLink'
import { site } from '@/lib/site'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
