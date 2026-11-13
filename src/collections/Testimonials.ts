import type { CollectionConfig } from 'payload'

import { approvedOrAuthenticated, authenticated } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'approved'],
    group: 'Content',
  },
  access: {
    read: approvedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection('testimonials'),
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'As the client agreed to be shown, e.g. "Sarah M."' },
    },
    { name: 'role', type: 'text', label: 'Role or business (optional)' },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Client has approved publishing this',
      admin: {
        position: 'sidebar',
        description: 'Only approved testimonials appear on the website.',
      },
    },
  ],
}
