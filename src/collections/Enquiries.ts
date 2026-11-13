import type { CollectionConfig } from 'payload'

import { authenticated, isAdmin } from '../access'

/**
 * Contact form submissions. Contains personal information: there is NO public
 * access. The contact form's server action writes here with the Local API.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'service', 'status', 'createdAt'],
    group: 'Admin',
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'service', type: 'text', label: 'Service of interest' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
