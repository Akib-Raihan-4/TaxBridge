import { slugField, type CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { seoField } from '../fields/seo'
import { revalidateCollection } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'publishedAt'],
    group: 'Content',
  },
  defaultSort: '-publishedAt',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  hooks: {
    ...revalidateCollection('posts'),
    beforeChange: [
      // Stamp the publish date the first time an article is published
      ({ data }) => {
        if (data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200,
      admin: { description: 'Short summary shown in article lists. Up to 200 characters.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Cover image' },
    { name: 'body', type: 'richText', label: 'Article' },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published on',
      admin: { position: 'sidebar' },
    },
    seoField,
  ],
}
