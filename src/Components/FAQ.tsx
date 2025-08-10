'use client'

import { getFaqs } from '@/actions/getFaqs'
import { useState, useEffect } from 'react'

interface FAQ {
  id: string
  question: string
  answer: string
  countries?: Array<{ country: string }>
  languages?: Array<{ language: string }>
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true)
        const data = await getFaqs()

        if (data && Array.isArray(data.docs)) {
          const mappedFaqs = data.docs.map(
            (faq: { id: string; question: string; answer: string }) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
            }),
          )
          setFaqs(mappedFaqs)
        } else {
          setError('Failed to load FAQs')
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err)
        setError('Failed to load FAQs')
        // Fallback to mock data
        setFaqs([
          {
            id: '1',
            question: 'What is the best online trading broker?',
            answer:
              'The best online trading broker depends on your individual needs, trading style, and investment goals. Factors to consider include fees, available assets, regulation, customer support, and trading platforms.',
          },
          {
            id: '2',
            question: 'How do I choose a trading broker?',
            answer:
              'When choosing a trading broker, consider: 1) Regulation and safety, 2) Trading fees and commissions, 3) Available assets and markets, 4) Trading platform quality, 5) Customer support, 6) Minimum deposit requirements, 7) Educational resources and tools.',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item: string) => item !== id) : [...prev, id],
    )
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Frequently Asked Questions
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-slate-600">Loading FAQs...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">Error loading FAQs. Please try again later.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-slate-200"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-semibold text-slate-800 pr-4">{item.question}</h3>
                    <svg
                      className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${
                        openItems.includes(item.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-slate-100 pt-4">
                        <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Still have questions? We&#39;re here to help.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
