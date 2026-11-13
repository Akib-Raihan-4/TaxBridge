import type { Field } from 'payload'

/** Question/answer list embedded in a document (e.g. FAQs on a service page). */
export const faqItemsField: Field = {
  name: 'faqs',
  type: 'array',
  label: 'Questions and answers',
  labels: { singular: 'Question', plural: 'Questions' },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
}
