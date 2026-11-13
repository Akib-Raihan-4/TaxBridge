import { slugField, type CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: { singular: 'Legal page', plural: 'Legal pages' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Privacy policy, terms of use and similar pages.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection('legal-pages'),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'body', type: 'richText', label: 'Content' },
  ],
}
