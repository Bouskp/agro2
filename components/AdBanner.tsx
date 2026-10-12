'use client'

import Image from 'next/image'
import Link from 'next/link'
import bannerSquare from '../app/images/square.png'
import bannerMedium from '../app/images/image2.png'
import bannerWide from '../app/images/wide.png'

const ALT =
  'AgroMakers — Annuaire 2027 : référencez votre activité dans l’annuaire des acteurs du monde agricole en Afrique'

export default function AdBanner() {
  return (
    <div className='w-full flex justify-center items-center bg-stone-100 border-y border-stone-200 py-4'>
      <Link
        href='https://www.agromakers.africa'
        target='_blank'
        rel='noopener noreferrer'
        className='w-full max-w-[1000px] mx-auto px-4 block'
      >
        <picture>
          {/* Desktop : bandeau large */}
          <source media='(min-width: 1024px)' srcSet={bannerWide.src} />
          {/* Tablette : bandeau moyen */}
          <source media='(min-width: 640px)' srcSet={bannerMedium.src} />
          {/* Mobile : format carré (fallback) */}
          <Image
            src={bannerSquare}
            alt={ALT}
            width={bannerSquare.width}
            height={bannerSquare.height}
            sizes='(min-width: 1024px) 1000px, 100vw'
            className='w-full h-auto rounded-lg hover:opacity-90 transition-opacity'
            priority
          />
        </picture>
      </Link>
    </div>
  )
}
