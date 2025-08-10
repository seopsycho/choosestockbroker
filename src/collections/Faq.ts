import { CollectionConfig } from 'payload'

export const Faq: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      required: false,
    },
    {
      name: 'language',
      type: 'text',
      required: false,
    },
  ],
}
