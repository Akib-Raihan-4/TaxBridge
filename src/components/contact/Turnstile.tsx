'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type TurnstileApi = {
  render: (element: HTMLElement, options: { sitekey: string; theme: 'light' }) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

/**
 * Cloudflare Turnstile spam check. Adds a hidden `cf-turnstile-response` input to
 * the surrounding form. `resetKey` should change after each failed submission,
 * because a token can only be used once.
 */
export function Turnstile({ siteKey, resetKey }: { siteKey: string; resetKey: number }) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded || !container.current || !window.turnstile || widgetId.current) return
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      theme: 'light',
    })
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
  }, [loaded, siteKey])

  useEffect(() => {
    if (resetKey > 0 && widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [resetKey])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setLoaded(true)}
      />
      <div ref={container} className="min-h-[65px]" />
    </>
  )
}
