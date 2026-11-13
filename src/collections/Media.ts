import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description (alt text)',
      required: true,
      admin: {
        description: 'Describe the image for people who cannot see it.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
