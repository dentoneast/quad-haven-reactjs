import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Homely Quad - Rental Property Management',
  description: 'Comprehensive rental property management platform for landlords, tenants, and maintenance teams.',
  keywords: ['rental', 'property management', 'landlord', 'tenant', 'maintenance'],
  authors: [{ name: 'Homely Quad Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}