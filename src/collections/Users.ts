import type { CollectionConfig } from 'payload'

import { adminOrSelf, isAdmin, isAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  auth: true,
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The very first account becomes the admin; everyone after is an editor by default
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin — full access including users and enquiries', value: 'admin' },
        { label: 'Editor — can edit website content', value: 'editor' },
      ],
      access: {
        // Only admins can change roles (prevents self-promotion)
        update: isAdminField,
      },
      // Stored in the login token so access checks don't need a database lookup
      saveToJWT: true,
    },
  ],
}
