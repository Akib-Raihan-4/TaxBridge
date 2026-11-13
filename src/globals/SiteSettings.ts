import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { seoField } from '../fields/seo'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Business details',
  admin: { group: 'Settings' },
  access: { read: anyone, update: authenticated },
  hooks: revalidateGlobal('site-settings'),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          fields: [
            { name: 'businessName', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'phones',
              type: 'array',
              labels: { singular: 'Phone number', plural: 'Phone numbers' },
              admin: { description: 'The first number is used for the "Call" button.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', admin: { description: 'e.g. Office, Mobile' } },
                    { name: 'number', type: 'text', required: true },
                  ],
                },
              ],
            },
            { name: 'email', type: 'email' },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'suburb', type: 'text' },
                    { name: 'state', type: 'text', defaultValue: 'NSW' },
                    { name: 'postcode', type: 'text' },
                  ],
                },
                {
                  name: 'mapUrl',
                  type: 'text',
                  label: 'Google Maps link',
                },
              ],
            },
            {
              name: 'parkingNote',
              type: 'text',
              label: 'Parking or directions note',
            },
            {
              name: 'openingHours',
              type: 'array',
              labels: { singular: 'Row', plural: 'Opening hours' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'days',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. Mon – Fri' },
                    },
                    {
                      name: 'hours',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. 9am – 5pm, or Closed' },
                    },
                    {
                      name: 'note',
                      type: 'text',
                      admin: { description: 'e.g. July to September only' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'socials',
              type: 'array',
              labels: { singular: 'Link', plural: 'Social links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: ['Facebook', 'LinkedIn', 'Instagram', 'Google', 'X'],
                    },
                    { name: 'url', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Compliance',
          fields: [
            { name: 'abn', type: 'text', label: 'ABN' },
            { name: 'taxAgentNumber', type: 'text', label: 'Registered tax agent number' },
            {
              name: 'memberships',
              type: 'array',
              labels: { singular: 'Membership', plural: 'Professional memberships' },
              admin: { description: 'Only list memberships the firm actually holds.' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'logo', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'showPslStatement',
              type: 'checkbox',
              label:
                'Show "Liability limited by a scheme approved under Professional Standards Legislation"',
              defaultValue: false,
              admin: { description: 'Tick only if the firm participates in such a scheme.' },
            },
            {
              name: 'footerNote',
              type: 'textarea',
              label: 'Extra footer note',
            },
          ],
        },
        {
          label: 'Search engines',
          fields: [seoField],
        },
      ],
    },
  ],
}
