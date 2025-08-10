'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
export const getBrokers = async () => {
  const payload = await getPayload({ config })
  try {
    const post = await payload.find({
      collection: 'brokers',
    })
    return post
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating post: ${error.message}`)
    }
    throw new Error('Error creating post: Unknown error')
  }
}
