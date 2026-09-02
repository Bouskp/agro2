import { Lora, Geist } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { cn } from '@/lib/utils'
import WhatsAppButton from '@/components/WhatsAppButton'

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
