'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cleanWordPressExcerpt, formatHtml } from '@/lib/utils'

export type Dossier = {
  id: string | number
  slug: string
  titre: string
  description?: string
  image_url?: string
}

export function DossierCarousel({ dossiers }: { dossiers: Dossier[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-dossier-card]')
    const step = card ? card.offsetWidth + 24 /* gap-6 */ : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div className='relative'>
      {/* Flèches - visibles à partir de md, superposées au slider */}
      <button
        type='button'
        aria-label='Dossier précédent'
        onClick={() => scrollByCard(-1)}
        className='hidden md:flex absolute -left-4 top-[38%] -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-agro-text hover:bg-agro-orange hover:text-white hover:border-agro-orange transition-colors'
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      <button
        type='button'
        aria-label='Dossier suivant'
        onClick={() => scrollByCard(1)}
        className='hidden md:flex absolute -right-4 top-[38%] -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-agro-text hover:bg-agro-orange hover:text-white hover:border-agro-orange transition-colors'
      >
        <ChevronRight className='h-5 w-5' />
      </button>

      <div
        ref={scrollerRef}
        className='flex gap-5 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-hide'
      >
        {dossiers.map((dossier) => (
          <article
            key={dossier.id}
            data-dossier-card
            className='group snap-start shrink-0 w-[300px] sm:w-[350px] lg:w-[400px]'
          >
            <Link
              href={`/article/${dossier.slug}`}
              className='relative block mb-3 overflow-hidden rounded-md aspect-[3/2] bg-agro-charcoal'
            >
              {dossier.image_url ? (
                <Image
                  src={dossier.image_url}
                  alt={dossier.titre}
                  fill
                  sizes='(max-width: 768px) 240px, 300px'
                  className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                />
              ) : null}
            </Link>

            <h3 className='font-lora font-semibold text-xl leading-snug text-agro-text mb-2 line-clamp-3'>
              <Link
                href={`/article/${dossier.slug}`}
                className='group-hover:underline'
              >
                {formatHtml(dossier.titre)}
              </Link>
            </h3>

            {dossier.description && (
              <p className='hidden md:block font-arial text-lg leading-relaxed text-gray-600 line-clamp-4'>
                {cleanWordPressExcerpt(formatHtml(dossier.description))}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
