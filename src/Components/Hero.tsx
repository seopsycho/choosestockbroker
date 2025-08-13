import { getTranslations } from '../lib/language'

export function Hero({ locale, country: _country }: { locale: string; country: string }) {
  const t = getTranslations(locale)
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">{t.hero.title}</h1>
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
