import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { iconOptions } from '../fields/icons'
import { buttonField } from '../fields/link'
import { seoField } from '../fields/seo'
import { revalidateGlobal } from '../hooks/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: authenticated },
  hooks: revalidateGlobal('home-page'),
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Top banner',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Small text above the heading' },
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'textarea' },
        buttonField('primaryButton', 'Main button'),
        buttonField('secondaryButton', 'Second button'),
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'pillars',
      type: 'array',
      label: 'Three highlights',
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'select', options: [...iconOptions] },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About section',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'featuredServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Services shown on the home page, in this order.' },
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Closing call to action',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        buttonField('button', 'Button'),
      ],
    },
    seoField,
  ],
}
