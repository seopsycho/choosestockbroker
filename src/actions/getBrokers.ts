'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const fetchBrokers = async () => {
  const payload = await getPayload({ config })
  try {
    const post = await payload.find({
      collection: 'brokers',
      limit: 50,
      depth: 1, // populate media enough to get logo.url
      sort: '-rating',
      select: {
        name: true,
        logo: true,
        minDeposit: true,
        rating: true,
        highlights: { highlight: true },
        paymentMethods: { method: true },
      } satisfies Partial<import('@/payload-types').BrokersSelect>,
    })
    return post
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating post: ${error.message}`)
    }
    throw new Error('Error creating post: Unknown error')
  }
}

export const getBrokers = unstable_cache(fetchBrokers, ['brokers-list'], {
  revalidate: 300,
  tags: ['brokers'],
})
