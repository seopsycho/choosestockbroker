'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getCounties } from '@/actions/getCounties'

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

export function CountrySelector({
  locale: initialLocale,
  country: initialCountryCode,
}: {
  locale?: string
  country?: string
}) {
  // Derive initial selections from props and fallback
  const initialCountryObj =
    (initialCountryCode && fallbackCountries.find((c) => c.code === initialCountryCode)) ||
    fallbackCountries[0]
  const initialLanguageObj =
    (initialLocale && initialCountryObj.languages.find((l) => l.code === initialLocale)) ||
    initialCountryObj.languages[0]

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
        const data = await getCounties()
        if (data && Array.isArray(data.docs) && data.docs.length > 0) {
          // Map Payload country objects to local Country type
          const mappedCountries = data.docs.map((country: import('@/payload-types').Country) => ({
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
          setCountries(mappedCountries)
          // Choose defaults based on props if provided
          const defaultCountry =
            (initialCountryCode && mappedCountries.find((c) => c.code === initialCountryCode)) ||
            mappedCountries[0]
          const defaultLanguage = (initialLocale &&
            defaultCountry.languages.find((l) => l.code === initialLocale)) ||
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

    // Navigate to the localized URL: /[language]/[country]
    const newPath = `/${language.code}/${country.code}`
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
        <span className="text-sm font-medium text-slate-700">{selectedCountry.name}</span>
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
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Select Country & Language</h3>
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
                    <span className="text-sm font-medium text-slate-700">{country.name}</span>
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
