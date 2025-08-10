import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ChooseStockBroker - Compare Online Trading Brokers',
  description:
    'Compare the best stock brokers worldwide. Find regulated brokers with low fees, great platforms, and excellent service.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
