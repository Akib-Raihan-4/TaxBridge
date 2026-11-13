import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { SkipLink } from '@/components/site/SkipLink'
import { getSiteSettings } from '@/lib/cms'
import { siteUrl } from '@/lib/site'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const name = settings.businessName || 'TaxBridge'
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.seo?.title || name, template: `%s | ${name}` },
    description: settings.seo?.description || settings.tagline || undefined,
    openGraph: { siteName: name, locale: 'en_AU', type: 'website' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html
      lang="en-AU"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Header settings={settings} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
