import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa6'
import { links } from '@/lib/utils'

const exploreLinks = [...links, { title: 'Newsletter', path: '/newsletter' }]

const helpLinks = [
  { href: '/faq', label: 'Questions fréquentes' },
  { href: '/conditions', label: 'Conditions générales' },
  { href: '/confidentialite', label: 'Confidentialité' },
]

export default function Footer() {
  return (
    <footer className='bg-black text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-4'>
          {/* Bloc marque */}
          <div className='md:col-span-1'>
            <Link
              href='/'
              className='uppercase font-lora text-2xl font-bold tracking-tight'
            >
              <span className=''>Agro</span>
              <span className='text-agro-green'>m</span>
              <span className='text-agro-orange'>akers</span>
            </Link>
            <p className='font-lora text-sm text-agro-text-muted mt-4 leading-relaxed max-w-[26ch] group hover:text-white'>
              AgroMakers est une plateforme dédiée à la transformation de
              l’agriculture africaine. Elle informe, connecte et accompagne les
              acteurs du secteur à travers contenus, analyses, événements et
              opportunités pour accélérer des projets durables et performants.
            </p>
            <div className='flex gap-3 mt-6'>
              <a
                href='https://www.facebook.com/p/AgroMakers-61589154570878/'
                aria-label='Facebook'
                className='rounded-full border border-white/15 p-2 hover:bg-agro-green transition-colors'
                target='_blank'
              >
                <FaFacebook className='h-4 w-4' />
              </a>
              <a
                href='https://instagram.com'
                aria-label='Instagram'
                className='rounded-full border border-white/15 p-2 hover:bg-agro-green transition-colors'
              >
                <FaInstagram className='h-4 w-4' />
              </a>
              <a
                href='https://www.linkedin.com/company/agromakers'
                aria-label='LinkedIn'
                className='rounded-full border border-white/15 p-2 hover:bg-agro-green transition-colors'
                target='_blank'
              >
                <FaLinkedin className='h-4 w-4' />
              </a>
              <a
                href='https://www.youtube.com/playlist?list=PLJPMVpGSbEkEUZMvW4ljawX4lpvJgl4V2'
                target='_blank'
                aria-label='LinkedIn'
                className='rounded-full border border-white/15 p-2 hover:bg-agro-green transition-colors'
              >
                <FaYoutube className='h-4 w-4' />
              </a>
            </div>
          </div>

          {/* Explorer */}
          <div>
            <h3 className='font-arial text-sm font-bold mb-4'>Explorer</h3>
            <ul className='space-y-3'>
              {exploreLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className='font-arial text-sm text-agro-text-muted hover:text-agro-orange transition-colors'
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className='font-arial text-sm font-bold mb-4'>Aide</h3>
            <ul className='space-y-3'>
              {helpLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className='font-arial text-sm text-agro-text-muted hover:text-agro-orange transition-colors'
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='font-arial text-sm font-bold mb-4'>Contact</h3>
            <ul className='space-y-3 font-arial text-sm text-agro-text-muted'>
              <li className='flex items-start gap-2'>
                <MapPin className='h-4 w-4 mt-0.5 shrink-0' />
                <span>Abidjan, Côte d&apos;Ivoire</span>
              </li>
              <li className='flex items-center gap-2'>
                <Phone className='h-4 w-4 shrink-0' />
                <a
                  href='tel:+2250708734964'
                  className='hover:text-agro-orange transition-colors'
                >
                  +225 07 14 13 2574
                </a>
              </li>
              <li className='flex items-center gap-2'>
                <Mail className='h-4 w-4 shrink-0' />
                <a
                  href='mailto:contact@agromakers.com'
                  className='hover:text-agro-orange transition-colors'
                >
                  contact@agromakers.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre inférieure */}
        <div className='mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='font-arial text-xs text-agro-text-muted'>
            © {new Date().getFullYear()} Agromakers. Tous droits réservés.
          </p>
          <div className='flex gap-6'>
            <Link
              href='/conditions'
              className='font-arial text-xs text-agro-text-muted hover:text-agro-orange transition-colors'
            >
              CGU
            </Link>
            <Link
              href='/confidentialite'
              className='font-arial text-xs text-agro-text-muted hover:text-agro-orange transition-colors'
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
