'use client'

import Image from 'next/image'
import Link from 'next/link'
import bannerImage from '../app/images/banner_hamanie_100.jpeg'

export default function AdBanner() {
  return (
    <div className='w-full flex justify-center items-center bg-stone-100 border-y border-stone-200 py-4'>
      <Link
        href='https://www.hamanie.news/magazine'
        target='_blank'
        rel='noopener noreferrer'
        className='w-full max-w-[1000px] mx-auto px-4 block'
      >
        <Image
          src={bannerImage}
          alt='Hamaniè — Le numéro 100 est en ligne, le mensuel des leaders et décideurs qui façonnent l’Afrique'
          width={1600}
          height={702}
          sizes='(min-width: 1024px) 1000px, 100vw'
          className='w-full h-auto rounded-lg hover:opacity-90 transition-opacity'
          priority
        />
      </Link>
    </div>
  )
}
