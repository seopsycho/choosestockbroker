'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Media } from '@/payload-types'
import { getTranslations } from '../lib/language'

interface Broker {
  id: string
  name: string
  logo?: Media
  rating: number
  minDeposit: number
  assets: number
  highlights: Array<{ highlight: string }>
  paymentMethods: Array<{ method: string }>
  visitUrl: string
  riskWarning?: string
  address?: string
}

type SortField = 'deposit' | 'assets' | null
type SortDirection = 'asc' | 'desc'

export function BrokerTable({
  brokers: initialBrokers,
  locale,
  country: _country,
}: {
  brokers: Broker[]
  locale: string
  country: string
}) {
  const [brokers] = useState<Broker[]>(initialBrokers)
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const t = getTranslations(locale)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const resetSort = () => {
    setSortField(null)
    setSortDirection('asc')
  }

  const sortedBrokers = useMemo(() => {
    const list = [...brokers]
    if (!sortField) return list
    return list.sort((a, b) => {
      const aValue = sortField === 'deposit' ? a.minDeposit : a.assets
      const bValue = sortField === 'deposit' ? b.minDeposit : b.assets
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })
  }, [brokers, sortField, sortDirection])

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 text-xs text-slate-400">
      {sortField === field ? sortDirection === 'asc' ? '▲' : '▼' : <span>▲▼</span>}
    </span>
  )

  return (
    <section id="brokers" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {sortedBrokers.length === 0 && (
          <div className="py-16 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50 mb-8">
            <p className="text-slate-600 mb-4">{t.brokers.status.empty}</p>
            <button
              onClick={resetSort}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
            >
              {t.brokers.status.retry}
            </button>
          </div>
        )}
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm border border-slate-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-700">
                  <button onClick={resetSort} className="flex items-center hover:text-blue-600">
                    {t.brokers.tableHeaders.broker}
                    <span className="ml-1 text-sm">↺</span>
                  </button>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">
                  <button
                    onClick={() => handleSort('deposit')}
                    className="flex items-center hover:text-blue-600"
                  >
                    {t.brokers.tableHeaders.deposit}
                    <SortIcon field="deposit" />
                  </button>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">
                  <button
                    onClick={() => handleSort('assets')}
                    className="flex items-center hover:text-blue-600"
                  >
                    {t.brokers.tableHeaders.assets}
                    <SortIcon field="assets" />
                  </button>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">
                  {t.brokers.tableHeaders.highlights}
                </th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">
                  {t.brokers.tableHeaders.paymentMethods}
                </th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">
                  {t.brokers.tableHeaders.learnMore}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBrokers.map((broker) => (
                <tr key={broker.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-6 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={broker.logo?.url || '/placeholder-logo.png'}
                          alt={broker.logo?.alt || `${broker.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{broker.name}</div>
                        <div className="flex text-yellow-400 text-sm">
                          {'★'.repeat(broker.rating)}
                        </div>
                        {broker.address && (
                          <div className="text-xs text-slate-500 mt-1 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {broker.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="font-semibold text-slate-800">${broker.minDeposit}</div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="font-semibold text-slate-800">
                      {broker.assets.toLocaleString()}+
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <ul className="space-y-2 text-sm">
                      {broker.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                            ✓
                          </span>
                          <span className="text-slate-700">{highlight.highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex flex-wrap gap-1">
                      {broker.paymentMethods.map((method, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                        >
                          {method.method}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors mb-2">
                      {t.brokers.visitSite}
                    </button>
                    <div className="text-xs text-slate-500">{broker.riskWarning}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {sortedBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src={broker.logo?.url || '/placeholder-logo.png'}
                      alt={broker.logo?.alt || `${broker.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{broker.name}</div>
                    <div className="flex text-yellow-400 text-sm">{'★'.repeat(broker.rating)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">
                    {t.brokers.tableHeaders.deposit}:{' '}
                    <span className="font-semibold">${broker.minDeposit}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {t.brokers.tableHeaders.assets}:{' '}
                    <span className="font-semibold">{broker.assets.toLocaleString()}+</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">
                  {t.brokers.tableHeaders.highlights}
                </h4>
                <ul className="space-y-2 text-sm">
                  {broker.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                        ✓
                      </span>
                      <span className="text-slate-600">{highlight.highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">
                  {t.brokers.tableHeaders.paymentMethods}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {broker.paymentMethods.map((method, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                    >
                      {method.method}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-2">
                {t.brokers.visitSite}
              </button>
              <div className="text-xs text-slate-500 text-center">{broker.riskWarning}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
