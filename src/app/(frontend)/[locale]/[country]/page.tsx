import { BrokerTable } from '@/Components/BrokerTable'
import { FAQ } from '@/Components/FAQ'
import { Footer } from '@/Components/Footer'
import { Header } from '@/Components/Header'
import { Hero } from '@/Components/Hero'

interface PageProps {
  params: {
    locale: string
    country: string
  }
}

export default function LocalizedPage({ params }: PageProps) {
  const { locale, country } = params

  return (
    <>
      <Header locale={locale} country={country} />
      <main>
        <Hero locale={locale} country={country} />
        <BrokerTable locale={locale} country={country} />
        <FAQ locale={locale} country={country} />
      </main>
      <Footer locale={locale} country={country} />
    </>
  )
}

// Generate static paths for supported locale/country combinations
export async function generateStaticParams() {
  const locales = ['en', 'vi', 'de', 'fr']
  const countries = ['vn', 'us', 'gb', 'de', 'fr', 'au']

  const combinations = []
  for (const locale of locales) {
    for (const country of countries) {
      combinations.push({ locale, country })
    }
  }

  return combinations
}
