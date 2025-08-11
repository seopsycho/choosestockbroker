'use client'

import { useState } from 'react'
import { CountrySelector } from './CountrySelector'
import Link from 'next/link'

export function Header({ locale, country }: { locale: string; country: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-slate-800">ChooseStockBroker</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${locale}/${country}`}
              className="text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href={`/${locale}/${country}/brokers`}
              className="text-slate-700 hover:text-blue-600 transition-colors"
            >
              Online Brokers
            </Link>
            <CountrySelector locale={locale} country={country} />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href={`/${locale}/${country}`}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href={`/${locale}/${country}/brokers`}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Online Brokers
              </Link>
              <div className="pt-2">
                <CountrySelector locale={locale} country={country} />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
