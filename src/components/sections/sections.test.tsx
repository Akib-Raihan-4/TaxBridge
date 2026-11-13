import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Footer } from '@/components/site/Footer'
import type { PricingItem, SiteSetting } from '@/payload-types'

import { ContactDetails } from './ContactDetails'
import { FaqList } from './FaqList'
import { PricingTable } from './PricingTable'
import { hasRichText } from './RichText'

const bare = { id: 1, businessName: 'TaxBridge' } as SiteSetting
const full = {
  ...bare,
  phones: [{ label: 'Office', number: '(02) 9000 0000' }],
  email: 'hello@example.com',
  address: { street: '1 Example St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
  openingHours: [{ days: 'Mon – Fri', hours: '9am – 5pm' }],
  abn: '00 000 000 000',
  taxAgentNumber: '00000000',
  showPslStatement: true,
} as SiteSetting

describe('Footer', () => {
  it('shows no compliance statements until the business has entered them', () => {
    render(<Footer settings={bare} />)
    expect(screen.queryByText(/Professional Standards Legislation/)).not.toBeInTheDocument()
    expect(screen.queryByText(/ABN/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Registered tax agent/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact')
  })

  it('shows contact details, hours and compliance lines once entered', () => {
    render(<Footer settings={full} />)
    expect(screen.getByRole('link', { name: /9000 0000/ })).toHaveAttribute(
      'href',
      'tel:+61290000000',
    )
    expect(screen.getByRole('link', { name: 'hello@example.com' })).toHaveAttribute(
      'href',
      'mailto:hello@example.com',
    )
    expect(screen.getByText('1 Example St, Sydney NSW 2000')).toBeInTheDocument()
    expect(
      screen.getByText(/ABN 00 000 000 000 · Registered tax agent 00000000/),
    ).toBeInTheDocument()
    expect(screen.getByText(/Professional Standards Legislation/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy')
  })
})

describe('PricingTable', () => {
  it('explains quoting when no prices are published', () => {
    render(<PricingTable items={[]} />)
    expect(screen.getByRole('heading', { name: 'We quote before we start' })).toBeInTheDocument()
  })

  it('shows prices as "from" with their GST status', () => {
    const items = [
      { id: 1, label: 'Individual tax return', fromPrice: 1100, gst: 'inclusive' },
      { id: 2, label: 'Company return', fromPrice: 900, gst: 'exclusive', note: 'Small companies' },
    ] as PricingItem[]
    render(<PricingTable items={items} />)

    const [first, second] = screen.getAllByRole('listitem')
    expect(within(first).getByText('$1,100')).toBeInTheDocument()
    expect(first).toHaveTextContent('from $1,100 incl. GST')
    expect(second).toHaveTextContent('from $900 + GST')
    expect(within(second).getByText('Small companies')).toBeInTheDocument()
  })
})

describe('FaqList', () => {
  it('renders each question as an expandable item', () => {
    const { container } = render(
      <FaqList
        faqs={[
          { question: 'When is my return due?', answer: 'Generally 31 October.' },
          { question: 'Do I need to visit?', answer: 'No.' },
        ]}
      />,
    )
    expect(container.querySelectorAll('details')).toHaveLength(2)
    expect(screen.getByText('When is my return due?').closest('summary')).not.toBeNull()
  })

  it('renders nothing when there are no questions', () => {
    const { container } = render(<FaqList faqs={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('ContactDetails', () => {
  it('shows a holding message when no details exist', () => {
    render(<ContactDetails settings={bare} />)
    expect(screen.getByText(/contact details will be published here shortly/)).toBeInTheDocument()
  })

  it('lists phone, email, address and hours', () => {
    render(<ContactDetails settings={full} />)
    expect(screen.getByRole('link', { name: '(02) 9000 0000' })).toHaveAttribute(
      'href',
      'tel:+61290000000',
    )
    expect(screen.getByText('Mon – Fri: 9am – 5pm')).toBeInTheDocument()
  })
})

describe('hasRichText', () => {
  it('treats an empty editor as no content', () => {
    expect(hasRichText(null)).toBe(false)
    expect(hasRichText({ root: { children: [{ children: [] }] } })).toBe(false)
    expect(hasRichText({ root: { children: [{ children: [{ text: 'Hi' }] }] } })).toBe(true)
  })
})
