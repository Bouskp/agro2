import { Lora, Geist } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { cn } from '@/lib/utils'
import WhatsAppButton from '@/components/WhatsAppButton'
import type { Metadata } from 'next'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['700', '400'],
})

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='fr'
      className={cn(
        'h-full',
        'antialiased',
        lora.variable,
        'font-sans',
        geist.variable,
      )}
    >
      <body>
        <Navbar />
        {children}
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL('https://agromakers.africa'),
  title: 'Agromakers - Le média de l’agriculture et de l’agro-industrie',
  description:
    'AgroMakers est le média business de l’agriculture africaine. À travers l’actualité, des analyses, des enquêtes, des interviews et des contenus de référence',
  openGraph: {
    siteName: 'Agromakers',
    locale: 'fr_FR',
    type: 'website',
    title: 'Agromakers - Le média de l’agriculture et de l’agro-industrie',
    description:
      'AgroMakers est le média business de l’agriculture africaine. À travers l’actualité, des analyses, des enquêtes, des interviews et des contenus de référence',
    images: ['og-image.png'],
  },
  alternates: {
    canonical: 'https://agromakers.africa',
  },
  robots: {
    index: true,
    follow: true,
  },
}
