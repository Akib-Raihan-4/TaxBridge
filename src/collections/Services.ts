import { slugField, type CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { faqItemsField } from '../fields/faqItems'
import { iconOptions } from '../fields/icons'
import { seoField } from '../fields/seo'
import { revalidateCollection } from '../hooks/revalidate'

export const serviceCategories = [
  { label: 'Individuals', value: 'individuals' },
  { label: 'Business', value: 'business' },
  { label: 'Super (SMSF)', value: 'super' },
  { label: 'Advisory', value: 'advisory' },
  { label: 'Registrations', value: 'registrations' },
] as const

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order'],
    group: 'Content',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection('services'),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...serviceCategories],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: { description: 'One or two sentences shown on service cards. Up to 200 characters.' },
    },
    { name: 'icon', type: 'select', options: [...iconOptions] },
    {
      name: 'whoFor',
      type: 'textarea',
      label: 'Who it is for',
    },
    {
      name: 'inclusions',
      type: 'array',
      label: 'What is included',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    { name: 'body', type: 'richText', label: 'Page content' },
    faqItemsField,
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    seoField,
  ],
}
