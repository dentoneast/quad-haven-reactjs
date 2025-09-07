import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Homely Quad - Find Your Perfect Home',
  description: 'Discover and rent the perfect property with Homely Quad. Browse thousands of properties, save favorites, and connect with property owners.',
  keywords: 'rental, property, apartment, house, real estate, homely quad',
  authors: [{ name: 'Homely Quad Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
