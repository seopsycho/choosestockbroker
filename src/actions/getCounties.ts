'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
export const getCounties = async () => {
  const payload = await getPayload({ config })
  try {
    const post = await payload.find({
      collection: 'countries',
    })
    return post
  } catch (error) {
    throw new Error(`Error creating post: ${error.message}`)
  }
}
