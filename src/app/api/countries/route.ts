import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'countries', limit: 1000 })
    return NextResponse.json(result)
  } catch (err) {
    console.error('Error fetching countries:', err)
    return NextResponse.json({ docs: [] }, { status: 500 })
  }
}
