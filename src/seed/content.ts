/**
 * Starter content, written fresh for this site (structure informed by
 * docs/content-brief.md). No prices, credentials, testimonials or contact details
 * are seeded — those must come from the business.
 */
type SeedService = {
  title: string
  slug: string
  category: 'individuals' | 'business' | 'super' | 'advisory' | 'registrations'
  icon: string
  summary: string
  whoFor: string
  inclusions: string[]
}

export const services: SeedService[] = [
  {
    title: 'Individual tax returns',
    slug: 'individual-tax-returns',
    category: 'individuals',
    icon: 'receipt',
    summary:
      'Your return prepared and lodged correctly, with every deduction you are entitled to claimed.',
    whoFor: 'Employees, contractors, retirees and anyone with investment or rental income.',
    inclusions: [
      'Salary, wages and allowances',
      'Work-related deductions',
      'Rental property schedules',
      'Shares, dividends and capital gains',
      'Prior-year and late returns',
    ],
  },
  {
    title: 'Sole trader and partnership returns',
    slug: 'sole-trader-and-partnership-returns',
    category: 'business',
    icon: 'briefcase',
    summary:
      'Business income, expenses and GST sorted, so you can get back to running the business.',
    whoFor: 'Sole traders, freelancers, tradies and partnerships.',
    inclusions: [
      'Business income and expense schedules',
      'Motor vehicle and home office claims',
      'Depreciation of tools and equipment',
      'PAYG instalment planning',
    ],
  },
  {
    title: 'Company and trust tax',
    slug: 'company-and-trust-tax',
    category: 'business',
    icon: 'building-2',
    summary:
      'Year-end accounts and tax returns for companies and trusts, prepared accurately and on time.',
    whoFor: 'Private companies, family trusts and unit trusts.',
    inclusions: [
      'Annual financial statements',
      'Company and trust tax returns',
      'Trust distribution minutes',
      'Director loan (Division 7A) reviews',
      'ASIC annual review support',
    ],
  },
  {
    title: 'BAS and GST',
    slug: 'bas-and-gst',
    category: 'business',
    icon: 'calculator',
    summary: 'Business Activity Statements prepared and lodged on time, every time.',
    whoFor: 'Any business registered for GST.',
    inclusions: [
      'Monthly, quarterly or annual BAS',
      'GST reconciliation',
      'PAYG withholding and instalments',
      'Fringe benefits tax (FBT) returns',
    ],
  },
  {
    title: 'Bookkeeping and payroll',
    slug: 'bookkeeping-and-payroll',
    category: 'business',
    icon: 'book-open',
    summary:
      'Up-to-date books and stress-free pay runs, so your numbers are always ready when you need them.',
    whoFor: 'Businesses that would rather not do their own books.',
    inclusions: [
      'Bank reconciliation',
      'Accounts payable and receivable',
      'Payroll and Single Touch Payroll reporting',
      'Superannuation guarantee payments',
    ],
  },
  {
    title: 'SMSF accounting and tax',
    slug: 'smsf-accounting-and-tax',
    category: 'super',
    icon: 'piggy-bank',
    summary:
      'Keep your self-managed super fund compliant, from setup through to the annual return.',
    whoFor: 'Trustees of self-managed super funds (SMSFs).',
    inclusions: [
      'Fund establishment',
      'Annual financial statements',
      'SMSF annual return',
      'Contribution and pension records',
      'Coordinating the independent audit',
    ],
  },
  {
    title: 'Tax planning and advice',
    slug: 'tax-planning-and-advice',
    category: 'advisory',
    icon: 'chart-line',
    summary:
      'Plan ahead so there are no surprises at tax time, and structure your affairs sensibly.',
    whoFor: 'Business owners and investors who want to plan, not just report.',
    inclusions: [
      'Pre-30 June tax planning',
      'Business structure advice',
      'Capital gains tax planning',
      'Cash flow forecasts and budgets',
    ],
  },
  {
    title: 'Business setup and registrations',
    slug: 'business-setup-and-registrations',
    category: 'registrations',
    icon: 'file-text',
    summary: 'Start on the right footing with the right structure and registrations in place.',
    whoFor: 'Anyone starting a business or changing structure.',
    inclusions: [
      'ABN, GST and PAYG registration',
      'Company and trust establishment',
      'Business name registration',
      'Accounting software setup',
    ],
  },
]

export const faqs: {
  question: string
  answer: string
  category: 'general' | 'tax' | 'business' | 'super' | 'fees'
}[] = [
  {
    question: 'What should I bring to my tax appointment?',
    answer:
      'Photo ID, your income statements, bank interest and dividend details, private health insurance statement, and receipts or records for any deductions you want to claim. If you have a rental property, bring the agent statements and loan interest details.',
    category: 'tax',
  },
  {
    question: 'When is my tax return due?',
    answer:
      'If you lodge your own return it is generally due by 31 October. Lodging through a registered tax agent can give you a later due date, provided you are on our client list before 31 October.',
    category: 'tax',
  },
  {
    question: 'Can you lodge returns from previous years?',
    answer:
      'Yes. We can prepare and lodge overdue returns and help you get back up to date with the ATO.',
    category: 'tax',
  },
  {
    question: 'Do I need to visit the office?',
    answer:
      'No. You can meet us in person, by phone or by video call, and send your documents electronically.',
    category: 'general',
  },
  {
    question: 'Which accounting software do you work with?',
    answer: 'We work with the major cloud accounting packages, including Xero and MYOB.',
    category: 'business',
  },
  {
    question: 'How do your fees work?',
    answer:
      'We give you a quote before starting any work, so you know the cost up front. Guide prices are listed on our pricing page.',
    category: 'fees',
  },
]

export const homePage = {
  hero: {
    eyebrow: 'Accounting and tax, made clear',
    heading: 'Tax and accounting you can understand',
    subheading:
      'We look after returns, BAS and bookkeeping for individuals and businesses, and explain your numbers in plain English.',
    primaryButton: { label: 'Book a consultation', href: '/contact' },
    secondaryButton: { label: 'See our services', href: '/services' },
  },
  pillars: [
    {
      title: 'Tax returns',
      description: 'Individuals, sole traders, companies, trusts and super funds.',
      icon: 'receipt',
    },
    {
      title: 'Business accounting',
      description: 'BAS, bookkeeping, payroll and year-end accounts handled for you.',
      icon: 'calculator',
    },
    {
      title: 'Advice and planning',
      description: 'Practical guidance on structure, cash flow and tax planning.',
      icon: 'chart-line',
    },
  ],
  about: {
    heading: 'A proactive partner, not just a lodgement service',
    body: 'Good accounting is more than meeting deadlines. We take the time to explain what your numbers mean, so you can make decisions with confidence.',
  },
  cta: {
    heading: 'Ready to get your tax sorted?',
    body: 'Tell us what you need and we will get back to you with a clear next step.',
    button: { label: 'Get in touch', href: '/contact' },
  },
} as const

export const aboutPage = {
  heading: 'About us',
  intro:
    'We are a New South Wales accounting practice helping individuals and small businesses stay on top of their tax.',
  whyUs: [
    {
      title: 'Plain-English advice',
      description: 'We explain what we are doing and why, without the jargon.',
    },
    {
      title: 'Clear fees',
      description: 'You get a quote before we start, so there are no surprises.',
    },
    {
      title: 'On time',
      description: 'We track your deadlines so lodgements are never left to the last minute.',
    },
  ],
} as const

export const legalPages = [
  { title: 'Privacy policy', slug: 'privacy' },
  { title: 'Terms of use', slug: 'terms' },
] as const
