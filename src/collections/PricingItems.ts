import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const PricingItems: CollectionConfig = {
  slug: 'pricing-items',
  labels: { singular: 'Price', plural: 'Prices' },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'fromPrice', 'order'],
    group: 'Content',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection('pricing-items'),
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'For example: Individual tax return' },
    },
    {
      name: 'fromPrice',
      type: 'number',
      label: 'Price from ($)',
      required: true,
      min: 0,
      admin: { description: 'Whole dollars. Shown on the site as "from $X".' },
    },
    {
      name: 'gst',
      type: 'select',
      label: 'GST',
      required: true,
      defaultValue: 'inclusive',
      options: [
        { label: 'Includes GST', value: 'inclusive' },
        { label: 'Plus GST', value: 'exclusive' },
      ],
    },
    { name: 'note', type: 'text', admin: { description: 'Optional short note.' } },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      admin: { description: 'Optional — links this price to a service page.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
