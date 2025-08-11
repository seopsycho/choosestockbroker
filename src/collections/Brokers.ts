import { revalidateTag } from 'next/cache'
import type { CollectionConfig } from 'payload'
export const Brokers: CollectionConfig = {
  slug: 'brokers',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'minDeposit',
      type: 'number',
      required: true,
    },
    {
      name: 'commissions',
      type: 'text',
      required: true,
    },
    {
      name: 'regulation',
      type: 'text',
      required: true,
    },
    {
      name: 'platforms',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'highlight',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'paymentMethods',
      type: 'array',
      fields: [
        {
          name: 'method',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      required: true,
    },
    {
      name: 'countries',
      type: 'array',
      fields: [
        {
          name: 'countryCode',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'website',
      type: 'text',
      required: false,
    },
  ],
  hooks: {
    afterChange: [
      ({ operation }) => {
        if (operation === 'create') {
          revalidateTag('brokers')
        }
      },
    ],
  },
}
