import type { Field } from 'payload'

/** Search-engine fields shared by every page-like document. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'Search engine listing',
  admin: {
    description: 'How this page appears in Google and when shared. Leave blank to use defaults.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Page title',
      maxLength: 60,
      admin: { description: 'Up to 60 characters.' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      maxLength: 160,
      admin: { description: 'One or two sentences, up to 160 characters.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Sharing image',
    },
  ],
}
