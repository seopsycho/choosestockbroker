import { Broker as PayloadBroker, Media } from '@/payload-types'
import { BrokerTable } from '@/Components/BrokerTable'
import { FAQ } from '@/Components/FAQ'
import { Footer } from '@/Components/Footer'
import { Header } from '@/Components/Header'
import { Hero } from '@/Components/Hero'
import { ExitIntentPopup } from '@/Components/ExitIntentPopup'
import { getBrokers } from '@/actions/getBrokers'

interface PageProps {
  params: {
    locale: string
    country: string
  }
}

export default async function LocalizedPage({ params }: PageProps) {
  const { locale, country } = params
  const data = await getBrokers()
  const brokers = Array.isArray(data?.docs)
    ? data.docs.map((broker: Partial<PayloadBroker>) => ({
        id: broker.id as string,
        name: broker.name as string,
        logo: broker.logo && typeof broker.logo === 'object' ? (broker.logo as Media) : undefined,
        rating: typeof broker.rating === 'number' ? broker.rating : 0,
        minDeposit: typeof broker.minDeposit === 'number' ? broker.minDeposit : 0,
        assets: 0,
        highlights: Array.isArray(broker.highlights)
          ? broker.highlights.map((h) => ({ highlight: h?.highlight || '' }))
          : [],
        paymentMethods: Array.isArray(broker.paymentMethods)
          ? broker.paymentMethods.map((m) => ({ method: m?.method || '' }))
          : [],
        visitUrl: (broker.website as string) || '',
        riskWarning: '',
        address: '',
      }))
    : []

  return (
    <>
      <Header locale={locale} country={country} />
      <main>
        <Hero locale={locale} country={country} />
        <BrokerTable brokers={brokers} locale={locale} country={country} />
        <FAQ locale={locale} country={country} />
      </main>
      <Footer locale={locale} country={country} />
      <ExitIntentPopup locale={locale} />
    </>
  )
}

// Allow any country slug at runtime; we render dynamically if not in static params
export const dynamicParams = true

// Generate static paths for supported locale/country combinations
export async function generateStaticParams() {
  const locales = ['en', 'vi', 'th', 'ar', 'ja', 'ko', 'zh', 'hi', 'ms', 'ur', 'ta', 'es', 'pt', 'id']
  // Fallback baseline countries for pre-rendering
  const fallbackCountries = [
    'vietnam', 'united-states', 'united-kingdom', 'germany', 'france', 'australia',
    'spain', 'italy', 'portugal', 'russia', 'japan', 'korea', 'china', 'colombia',
    'canada', 'brazil', 'mexico', 'argentina', 'chile', 'india', 'thailand',
    'singapore', 'malaysia', 'indonesia', 'philippines', 'global',
  ]
  const combinations: Array<{ locale: string; country: string }> = []
  for (const locale of locales) {
    for (const country of fallbackCountries) {
      combinations.push({ locale, country })
    }
  }
  return combinations
}
