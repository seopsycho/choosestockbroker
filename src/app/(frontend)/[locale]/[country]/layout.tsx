import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  params: {
    locale: string
    country: string
  }
}

export default function LocalizedLayout({ children, params }: LayoutProps) {
  const { locale, country } = params

  return (
    <div data-locale={locale} data-country={country}>
      {children}
    </div>
  )
}

// Generate metadata based on locale and country
export async function generateMetadata({
  params,
}: {
  params: { locale: string; country: string }
}) {
  const { locale, country } = params

  const titles: Record<string, string> = {
    en: 'ChooseStockBroker - Compare Online Trading Brokers',
    vi: 'ChooseStockBroker - So Sánh Nhà Môi Giới Giao Dịch Trực Tuyến',
    de: 'ChooseStockBroker - Online Trading Broker Vergleichen',
    fr: 'ChooseStockBroker - Comparer les Courtiers de Trading en Ligne',
  }

  const descriptions: Record<string, string> = {
    en: 'Compare the best online trading brokers. Find regulated brokers with low fees, great platforms, and excellent customer service.',
    vi: 'So sánh các nhà môi giới giao dịch trực tuyến tốt nhất. Tìm nhà môi giới được quy định với phí thấp và dịch vụ tuyệt vời.',
    de: 'Vergleichen Sie die besten Online-Trading-Broker. Finden Sie regulierte Broker mit niedrigen Gebühren und exzellentem Service.',
    fr: 'Comparez les meilleurs courtiers de trading en ligne. Trouvez des courtiers régulés avec des frais bas et un excellent service.',
  }

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  }
}
