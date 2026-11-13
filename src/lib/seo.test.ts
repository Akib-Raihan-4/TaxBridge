import { describe, expect, it } from 'vitest'

import type { SiteSetting } from '@/payload-types'

import { buildMetadata, businessJsonLd, faqJsonLd, serializeJsonLd } from './seo'

const baseSettings = { id: 1, businessName: 'TaxBridge' } as SiteSetting

describe('buildMetadata', () => {
  it('prefers the editor’s SEO fields over the defaults', () => {
    const metadata = buildMetadata({
      seo: { title: 'Custom title', description: 'Custom description' },
      title: 'Default',
      description: 'Default description',
      path: '/about',
    })
    expect(metadata.title).toBe('Custom title')
    expect(metadata.description).toBe('Custom description')
    expect(metadata.alternates?.canonical).toBe('/about')
  })

  it('falls back to the defaults when SEO fields are blank', () => {
    const metadata = buildMetadata({
      seo: { title: '', description: null },
      title: 'Pricing',
      path: '/pricing',
    })
    expect(metadata.title).toBe('Pricing')
    expect(metadata.description).toBeUndefined()
  })
})

describe('businessJsonLd', () => {
  it('leaves out contact facts the business has not entered', () => {
    const data = businessJsonLd(baseSettings)
    expect(data.name).toBe('TaxBridge')
    expect(data).not.toHaveProperty('telephone')
    expect(data).not.toHaveProperty('email')
    expect(data).not.toHaveProperty('address')
  })

  it('includes phone, email and address once they exist', () => {
    const data = businessJsonLd({
      ...baseSettings,
      phones: [{ number: '(02) 9000 0000' }],
      email: 'hello@example.com',
      address: { street: '1 Example St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
    })
    expect(data.telephone).toBe('(02) 9000 0000')
    expect(data.address).toMatchObject({
      addressLocality: 'Sydney',
      postalCode: '2000',
      addressCountry: 'AU',
    })
  })
})

describe('faqJsonLd and serializeJsonLd', () => {
  it('builds FAQ structured data', () => {
    const data = faqJsonLd([{ question: 'Q?', answer: 'A.' }])
    expect(data.mainEntity[0]).toMatchObject({ name: 'Q?', acceptedAnswer: { text: 'A.' } })
  })

  it('escapes < so CMS text cannot close the script tag', () => {
    const output = serializeJsonLd({ text: '</script><script>alert(1)</script>' })
    expect(output).not.toContain('<')
  })
})
