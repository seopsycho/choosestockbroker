'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getTranslations, normalizeLocale } from '../lib/language'

interface Country {
  id: string
  name: string
  code: string
  flag?: {
    url: string
    alt?: string
  }
  languages: Array<{
    language: string
    code: string
  }>
}

// Fallback data
const fallbackCountries = [
  {
    id: '1',
    code: 'us',
    name: 'United States',
    languages: [{ language: 'English', code: 'en' }],
  },
  {
    id: '2',
    code: 'gb',
    name: 'United Kingdom',
    languages: [{ language: 'English', code: 'en' }],
  },
  {
    id: '3',
    code: 'vn',
    name: 'Vietnam',
    languages: [
      { language: 'Tiếng Việt', code: 'vi' },
      { language: 'English', code: 'en' },
    ],
  },
]

// Mapping between ISO country codes and URL slugs (bidirectional)
const countryCodeToSlug: Record<string, string> = {
  vn: 'vietnam',
  us: 'united-states',
  gb: 'united-kingdom',
  de: 'germany',
  fr: 'france',
  es: 'spain',
  it: 'italy',
  pt: 'portugal',
  ru: 'russia',
  jp: 'japan',
  kr: 'korea',
  cn: 'china',
  au: 'australia',
  ca: 'canada',
  co: 'colombia',
  br: 'brazil',
  mx: 'mexico',
  ar: 'argentina',
  cl: 'chile',
  in: 'india',
  th: 'thailand',
  sg: 'singapore',
  my: 'malaysia',
  id: 'indonesia',
  ph: 'philippines',
  global: 'global',
}

const slugToCountryCode: Record<string, string> = Object.entries(countryCodeToSlug).reduce(
  (acc, [code, slug]) => {
    acc[slug] = code
    return acc
  },
  {} as Record<string, string>,
)

const resolveCountryCode = (value?: string): string | undefined => {
  if (!value) return undefined
  const v = value.toLowerCase()
  return slugToCountryCode[v] || v
}

// Create a URL-safe slug from a country name
const toSlug = (str?: string) =>
  (str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export function CountrySelector({
  locale: initialLocale,
  country: initialCountryCode,
}: {
  locale?: string
  country?: string
}) {
  // Derive initial selections from props and fallback
  const resolvedInitialCountryCode = resolveCountryCode(initialCountryCode)
  const initialCountryObj =
    (resolvedInitialCountryCode &&
      fallbackCountries.find((c) => c.code.toLowerCase() === resolvedInitialCountryCode)) ||
    fallbackCountries[0]
  const normalizedInitialLocale = normalizeLocale(initialLocale || 'en')
  const initialLanguageObj =
    initialCountryObj.languages.find((l) => normalizeLocale(l.code) === normalizedInitialLocale) ||
    initialCountryObj.languages[0]

  const t = getTranslations(normalizedInitialLocale)

  // Preferred way to compute the country slug for routing based on full object
  const getCountrySlug = (country: Country): string => {
    const code = (country?.code || '').toLowerCase()
    return countryCodeToSlug[code] || toSlug(country?.name) || code
  }

  // Resolve localized country name by ISO code where possible, otherwise fallback to provided name
  const localizedCountryName = (code: string, fallbackName: string) => {
    const keyMap: Record<string, keyof typeof t.countries> = {
      vn: 'vietnam',
      us: 'unitedStates',
      gb: 'unitedKingdom',
      de: 'germany',
      fr: 'france',
      es: 'spain',
      it: 'italy',
      pt: 'portugal',
      ru: 'russia',
      jp: 'japan',
      kr: 'korea',
      cn: 'china',
    }
    const raw = (code && code.toLowerCase()) || ''
    const k = keyMap[raw] as keyof typeof t.countries | undefined
    return k ? t.countries[k] : fallbackName
  }

  const [countries, setCountries] = useState<Country[]>(fallbackCountries)
  const [_loading, setLoading] = useState(true)
  const [_error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountryObj)
  const [selectedLanguage, setSelectedLanguage] = useState<{ language: string; code: string }>(
    initialLanguageObj,
  )
  const router = useRouter()

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/countries', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data && Array.isArray(data.docs) && data.docs.length > 0) {
          // Map Payload country objects to local Country type
          const mappedCountries: Country[] = data.docs.map((country: import('@/payload-types').Country) => ({
            id: country.id,
            name: country.name,
            code: country.code,
            flag: country.flag ? { url: country.flag, alt: country.name } : undefined,
            languages: Array.isArray(country.languages)
              ? country.languages.map((lang: { code: string; name: string }) => ({
                  language: lang.name,
                  code: lang.code,
                }))
              : [{ language: 'English', code: 'en' }],
          }))
          // Stable sort by localized name to improve UX
          mappedCountries.sort((a: Country, b: Country) => {
            const an = (a.name || '').toString()
            const bn = (b.name || '').toString()
            return an.localeCompare(bn)
          })
          setCountries(mappedCountries)
          // Choose defaults based on props if provided
          const routeSlug = (initialCountryCode || '').toLowerCase()
          // First try to match by reverse lookup of code mapping from slug
          const resolvedCode = resolveCountryCode(routeSlug)
          let defaultCountry: Country | undefined =
            (resolvedCode &&
              mappedCountries.find((c) => (c.code || '').toLowerCase() === resolvedCode)) ||
            undefined
          // If not found, match by slugified name
          if (!defaultCountry) {
            defaultCountry = mappedCountries.find((c: Country) => getCountrySlug(c) === routeSlug)
          }
          // Prefer a sensible fallback (global) if present
          if (!defaultCountry) {
            defaultCountry = mappedCountries.find((c: Country) => getCountrySlug(c) === 'global')
          }
          if (!defaultCountry) defaultCountry = mappedCountries[0]
          const normalizedLocale = normalizeLocale(initialLocale || 'en')
          const defaultLanguage =
            defaultCountry.languages.find((l: { language: string; code: string }) => normalizeLocale(l.code) === normalizedLocale) ||
            defaultCountry.languages[0] || { language: 'English', code: 'en' }

          setSelectedCountry(defaultCountry)
          setSelectedLanguage(defaultLanguage)
        } else {
          setError('Failed to load countries')
        }
      } catch (err) {
        console.error('Error fetching countries:', err)
        setError('Failed to load countries')
        // Keep fallback data
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  }, [initialCountryCode, initialLocale])

  const handleSelection = (country: Country, language: { language: string; code: string }) => {
    setSelectedCountry(country)
    setSelectedLanguage(language)
    setIsOpen(false)

    // Navigate to the localized URL with full country name: /[language]/[country-name]
    const countryUrlName = getCountrySlug(country)
    const localeNormalized = normalizeLocale(language.code)
    const newPath = `/${localeNormalized}/${countryUrlName}`
    router.push(newPath)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
      >
        <span className="text-xl">
          {selectedCountry.flag?.url ? (
            <Image
              src={selectedCountry.flag.url}
              alt={selectedCountry.flag.alt || selectedCountry.name}
              width={20}
              height={20}
              className="rounded-sm"
            />
          ) : (
            '🌍'
          )}
        </span>
        <span className="text-sm font-medium text-slate-700">
          {localizedCountryName(selectedCountry.code, selectedCountry.name)}
        </span>
        <span className="text-xs text-slate-500">({selectedLanguage.language})</span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              {t.countries.selectCountry}
            </h3>
            <div className="space-y-2">
              {countries.map((country) => (
                <div key={country.code} className="border-b border-slate-100 pb-2 last:border-b-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">
                      {country.flag?.url ? (
                        <Image
                          src={country.flag.url}
                          alt={country.flag.alt || country.name}
                          width={16}
                          height={16}
                          className="rounded-sm"
                        />
                      ) : (
                        '🌍'
                      )}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {localizedCountryName(country.code, country.name)}
                    </span>
                  </div>
                  <div className="ml-7 flex flex-wrap gap-1">
                    {country.languages.map((language) => (
                      <button
                        key={`${country.code}-${language.code}`}
                        onClick={() => handleSelection(country, language)}
                        className="px-2 py-1 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        {language.language}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
