'use client'

import { useState, useEffect } from 'react'
import { getTranslations } from '../lib/language'

interface ExitIntentPopupProps {
  locale: string
}

export function ExitIntentPopup({ locale }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const t = getTranslations(locale)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Detect when mouse leaves towards the top of the page (exit intent)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hasShown])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-2">{t.exitIntent.title}</h2>
          <p className="text-blue-100">{t.exitIntent.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block text-sm font-semibold mb-4">
              🎯 Exclusive Broker Offer
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Special Trading Account Bonus
            </h3>
            <p className="text-slate-600 mb-4">
              Get started with our top-rated broker partner and receive:
            </p>
          </div>

          {/* Offer Highlights */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </span>
              <span className="text-slate-700">$100 Welcome Bonus</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </span>
              <span className="text-slate-700">Zero Commission Trading</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </span>
              <span className="text-slate-700">Free Trading Signals</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </span>
              <span className="text-slate-700">24/7 Customer Support</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col gap-3">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105">
              Claim Exclusive Offer
            </button>
            <button
              onClick={handleClose}
              className="text-slate-600 hover:text-slate-800 py-2 text-sm transition-colors"
            >
              No thanks, continue browsing
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-500 text-center mt-4">
            *Terms and conditions apply. Risk warning: Trading involves risk.
          </p>
        </div>
      </div>
    </div>
  )
}
