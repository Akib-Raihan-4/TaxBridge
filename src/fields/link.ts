import type { Field } from 'payload'

/** A button: label + destination. */
export const buttonField = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', label: 'Button text' },
        {
          name: 'href',
          type: 'text',
          label: 'Link',
          admin: { description: 'A page on this site such as /contact, or a full web address.' },
        },
      ],
    },
  ],
})
