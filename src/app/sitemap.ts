import type { MetadataRoute } from 'next'
import { TRANSLATIONS } from '@/lib/language'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.choosestockbroker.com'

interface CountryDoc {
  id?: string
  code?: string
}

async function getCountryCodes(): Promise<string[]> {
  try {
    const payload = await getPayload({ config })
    const res = (await payload.find({ collection: 'countries', depth: 0, limit: 200 })) as {
      docs?: CountryDoc[]
    }
    if (Array.isArray(res?.docs) && res.docs.length) {
      return res.docs
        .map((c) => (typeof c.code === 'string' ? c.code.toLowerCase() : undefined))
        .filter((v): v is string => Boolean(v))
    }
  } catch (e) {
    console.error('sitemap countries fetch failed, using fallback', e)
  }
  return ['us', 'gb', 'vn', 'de', 'fr']
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = Object.keys(TRANSLATIONS)
  const countryCodes = await getCountryCodes()
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []
  entries.push({ url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 })
  for (const locale of locales) {
    for (const country of countryCodes) {
      entries.push({
        url: `${BASE_URL}/${locale}/${country}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      })
    }
  }
  return entries
}
