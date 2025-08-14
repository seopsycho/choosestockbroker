import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations, normalizeLocale, TRANSLATIONS } from '@/lib/language'
import type { Translations } from '@/lib/language'

interface SiteSection {
  title: string
  description: string
  tagline: string
  metaDescription?: string
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string; country: string }>
}) {
  const { locale, country } = await params
  return (
    <div data-locale={locale} data-country={country}>
      {children}
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>
}): Promise<Metadata> {
  const { locale, country } = await params
  const lang = normalizeLocale(locale)
  const t: Translations = getTranslations(lang)

  // Build language alternates for SEO
  const alternates: Record<string, string> = Object.keys(TRANSLATIONS).reduce(
    (acc, code) => {
      acc[code] = `/${code}/${country}`
      return acc
    },
    {} as Record<string, string>,
  )

  const site = t.site as unknown as SiteSection
  const description: string = site.metaDescription || site.description

  return {
    title: site.title,
    description,
    openGraph: {
      title: site.title,
      description,
      locale: lang,
      type: 'website',
      url: `/${locale}/${country}`,
      siteName: 'ChooseStockBroker',
    },
    alternates: {
      languages: alternates,
    },
  }
}
