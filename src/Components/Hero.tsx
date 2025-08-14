import { getTranslations, normalizeLocale } from '../lib/language'

export function Hero({ locale, country }: { locale: string; country: string }) {
  const lang = normalizeLocale(locale)
  const t = getTranslations(lang)
  const currentYear = new Date().getFullYear()
  
  // Helper function to get localized country name
  const getCountryName = (country: string) => {
    const raw = (country || '').toLowerCase()
    if (raw === 'global') {
      return null // Special case for global
    }
    
    // Map ISO country codes to route slugs (best effort)
    const codeToSlug: Record<string, string> = {
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
    }

    // Map known slugs to translation keys (subset supported in translations)
    const slugToKey: Record<string, keyof typeof t.countries | 'global'> = {
      'global': 'global',
      'vietnam': 'vietnam',
      'united-kingdom': 'unitedKingdom',
      'united-states': 'unitedStates',
      'germany': 'germany',
      'france': 'france',
      'spain': 'spain',
      'italy': 'italy',
      'portugal': 'portugal',
      'russia': 'russia',
      'japan': 'japan',
      'korea': 'korea',
      'china': 'china',
      'australia': 'australia',
      'canada': 'canada',
      'brazil': 'brazil',
      'mexico': 'mexico',
      'argentina': 'argentina',
      'chile': 'chile',
      'india': 'india',
      'thailand': 'thailand',
      'singapore': 'singapore',
      'malaysia': 'malaysia',
      'indonesia': 'indonesia',
      'philippines': 'philippines',
    }

    // Resolve a candidate slug first
    const candidateSlug = /^[a-z]{2}$/i.test(raw) ? (codeToSlug[raw] || raw) : raw
    // Try to localize via translations if we know the key
    const key = slugToKey[candidateSlug] as keyof typeof t.countries | undefined
    if (key && t.countries[key]) return t.countries[key] as string

    // Humanize fallback: replace dashes and title-case
    const human = candidateSlug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
    return human
  }
  
  const countryName = getCountryName(country)
  
  const getTitle = () => {
    if (country.toLowerCase() === 'global') {
      if (locale === 'en') {
        return `Compare Global Online Trading Brokers - ${currentYear}`
      }
      // For non-English, use localized version
      switch (locale) {
        case 'vi': return `So Sánh Các Nhà Môi Giới Giao Dịch Trực Tuyến Toàn Cầu - ${currentYear}`
        case 'th': return `เปรียบเทียบนายหน้าซื้อขายออนไลน์ทั่วโลก - ${currentYear}`
        case 'ar': return `قارن وسطاء التداول عبر الإنترنت العالميين - ${currentYear}`
        case 'ja': return `グローバルオンライン取引ブローカーを比較 - ${currentYear}`
        case 'ko': return `글로벌 온라인 거래 브로커 비교 - ${currentYear}`
        case 'zh': return `比较全球在线交易经纪商 - ${currentYear}`
        case 'hi': return `वैश्विक ऑनलाइन ट्रेडिंग ब्रोकर्स की तुलना करें - ${currentYear}`
        case 'ms': return `Bandingkan Broker Perdagangan Dalam Talian Global - ${currentYear}`
        case 'ur': return `عالمی آن لائن ٹریڈنگ بروکرز کا موازنہ کریں - ${currentYear}`
        case 'ta': return `உலகளாவிய ஆன்லைன் வர்த்தக புரோக்கர்களை ஒப்பிடுங்கள் - ${currentYear}`
        case 'es': return `Compara Corredores de Trading Online Globales - ${currentYear}`
        case 'pt': return `Compare Corretores de Negociação Online Globais - ${currentYear}`
        case 'id': return `Bandingkan Broker Trading Online Global - ${currentYear}`
        default: return `Compare Global Online Trading Brokers - ${currentYear}`
      }
    }
    
    // For specific countries, use localized format
    if (lang === 'en') {
      return `Compare Online Trading Brokers in ${countryName} - ${currentYear}`
    }
    
    switch (lang) {
      case 'vi': return `So Sánh Các Nhà Môi Giới Giao Dịch Trực Tuyến tại ${countryName} - ${currentYear}`
      case 'th': return `เปรียบเทียบนายหน้าซื้อขายออนไลน์ใน${countryName} - ${currentYear}`
      case 'ar': return `قارن وسطاء التداول عبر الإنترنت في ${countryName} - ${currentYear}`
      case 'ja': return `${countryName}のオンライン取引ブローカーを比較 - ${currentYear}`
      case 'ko': return `${countryName}의 온라인 거래 브로커 비교 - ${currentYear}`
      case 'zh': return `比较${countryName}的在线交易经纪商 - ${currentYear}`
      case 'hi': return `${countryName} में ऑनलाइन ट्रेडिंग ब्रोकर्स की तुलना करें - ${currentYear}`
      case 'ms': return `Bandingkan Broker Perdagangan Dalam Talian di ${countryName} - ${currentYear}`
      case 'ur': return `${countryName} میں آن لائن ٹریڈنگ بروکرز کا موازنہ کریں - ${currentYear}`
      case 'ta': return `${countryName} இல் ஆன்லைன் வர்த்தக புரோக்கர்களை ஒப்பிடுங்கள் - ${currentYear}`
      case 'es': return `Compara Corredores de Trading Online en ${countryName} - ${currentYear}`
      case 'pt': return `Compare Corretores de Negociação Online em ${countryName} - ${currentYear}`
      case 'id': return `Bandingkan Broker Trading Online di ${countryName} - ${currentYear}`
      default: return `Compare Online Trading Brokers in ${countryName} - ${currentYear}`
    }
  }
  
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              {getTitle()}
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                {t.hero.viewTopBrokers}
              </button>
              <button className="border border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                {t.hero.learnMore}
              </button>
            </div>
          </div>

          <div className="hidden md:block flex-1 max-w-lg ml-12">
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
                  <div className="text-slate-600 mb-4">Trading Assets</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-semibold text-slate-800">Stocks</div>
                      <div className="text-slate-600">Global Markets</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-semibold text-slate-800">Forex</div>
                      <div className="text-slate-600">Major Pairs</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-semibold text-slate-800">Crypto</div>
                      <div className="text-slate-600">Top Tokens</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-semibold text-slate-800">ETFs</div>
                      <div className="text-slate-600">Diversified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
