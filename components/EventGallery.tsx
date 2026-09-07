// components/events/EventGallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

interface EventGalleryProps {
  images: string[]
  alt: string
}

export function EventGallery({ images, alt }: EventGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const closeLightbox = () => setActiveIndex(null)

  const showPrev = () => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex - 1 + images.length) % images.length)
  }

  const showNext = () => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex + 1) % images.length)
  }

  return (
    <div className='mt-10 pt-8 border-t border-agro-border'>
      <div className='flex items-center justify-center gap-2 mb-5'>
        <Images className='h-5 w-5 text-agro-green' />
        <h2 className='font-lora text-xl font-bold text-agro-text'>
          Galerie photos
        </h2>
      </div>

      {/* Vignettes centrées */}
      <div className='flex flex-wrap justify-center gap-3'>
        {images.map((src, idx) => (
          <button
            key={src + idx}
            onClick={() => setActiveIndex(idx)}
            className='group relative aspect-square w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] md:w-[160px] overflow-hidden rounded-lg bg-agro-charcoal border border-agro-border'
          >
            <Image
              src={src}
              alt={`${alt} - photo ${idx + 1}`}
              fill
              sizes='(max-width: 768px) 50vw, 160px'
              className='object-cover group-hover:scale-105 transition-transform duration-300'
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label='Fermer'
            className='absolute top-4 right-4 text-white/80 hover:text-white transition-colors'
          >
            <X className='h-8 w-8' />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
              aria-label='Image précédente'
              className='absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors'
            >
              <ChevronLeft className='h-10 w-10' />
            </button>
          )}

          <div
            className='relative w-full max-w-4xl aspect-[4/3]'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${alt} - photo ${activeIndex + 1}`}
              fill
              sizes='90vw'
              className='object-contain'
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
              aria-label='Image suivante'
              className='absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors'
            >
              <ChevronRight className='h-10 w-10' />
            </button>
          )}

          <span className='absolute bottom-4 font-arial text-sm text-white/70'>
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  )
}
