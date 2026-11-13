import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
    group: 'Content',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection('faqs'),
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Tax returns', value: 'tax' },
        { label: 'Business', value: 'business' },
        { label: 'Super (SMSF)', value: 'super' },
        { label: 'Fees', value: 'fees' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
