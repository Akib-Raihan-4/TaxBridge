import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'
import { revalidateGlobal } from '../hooks/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: authenticated },
  hooks: revalidateGlobal('about-page'),
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'intro', type: 'textarea' },
    { name: 'story', type: 'richText', label: 'Our story' },
    {
      name: 'credentials',
      type: 'array',
      labels: { singular: 'Credential', plural: 'Qualifications and experience' },
      admin: { description: 'Only list qualifications the firm can substantiate.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'detail', type: 'text' },
      ],
    },
    {
      name: 'whyUs',
      type: 'array',
      labels: { singular: 'Reason', plural: 'Why choose us' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    seoField,
  ],
}
