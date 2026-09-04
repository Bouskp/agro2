import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebook, FaWhatsapp, FaLinkedin, FaYoutube } from 'react-icons/fa6'
import { links } from '@/lib/utils'
import logo from '../app/images/logo.png'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className='bg-agro-charcoal text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-4'>
          {/* Bloc marque */}
          <div className='md:col-span-2'>
            <Link
              href='/'
              className='relative h-10 w-36 sm:h-16 sm:w-52 shrink-0 block'
            >
              <Image
                src={logo}
                alt='logo Agromakers'
                className='object-contain object-left'
                fill
                priority
              />
            </Link>
            <p className='font-lora text-sm text-agro-text-muted mt-4 leading-relaxed hover:text-white transition-colors'>
              AgroMakers est le média business de l’agriculture africaine. À
              travers l’actualité, des analyses, des enquêtes, des interviews et
              des contenus de référence, nous suivons et décryptons les
              dynamiques qui façonnent l’économie agricole du continent, avec
              une ambition : offrir aux acteurs du secteur l’information dont
              ils ont besoin pour comprendre les marchés, identifier les
              opportunités et anticiper les transformations de l’agriculture
              africaine.
            </p>
            <div className='flex gap-3 mt-6'>
              <a
                href='https://www.facebook.com/p/AgroMakers-61589154570878/'
                aria-label='Facebook'
                className='rounded-full border border-white/15 p-2 hover:bg-agro-green transition-colors'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaFacebook className='h-4 w-4' />
              </a>
              <a
                href='https://whatsapp.com/channel/0029VbCR4qX0rGiFZyuq8Z0o'
                aria-label='WhatsApp'
                className='rounded-full border border-white/15 p-2 hover:bg-agro-green transition-colors'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaWhatsapp className='h-4 w-4' />
              </a>
              <a
                href='https://www.linkedin.com/company/agromakers-africa/'
                aria-label='LinkedIn'
                className='rounded-full border border-white/15 p-2 hover:bg-agro-green transition-colors'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin className='h-4 w-4' />
              </a>
              <a
                href='https://www.youtube.com/playlist?list=PLJPMVpGSbEkEUZMvW4ljawX4lpvJgl4V2'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='YouTube'
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
              {links.map((item) => (
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
                {/* ⚠️ Numéro à confirmer : href et texte affiché différaient dans l'original */}
                <a
                  href='tel:+2250708734964'
                  className='hover:text-agro-orange transition-colors'
                >
                  +225 07 08 73 49 64
                </a>
              </li>
              <li className='flex items-center gap-2'>
                <Mail className='h-4 w-4 shrink-0' />
                <a
                  href='mailto:infos@mianmedia.com'
                  className='hover:text-agro-orange transition-colors'
                >
                  infos@mianmedia.com
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
