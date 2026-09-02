'use client'
import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Post } from '@/lib/wordpress'
import { formatHtml, formatMediaDate } from '@/lib/utils'

export default function HeroSlider({ posts }: { posts: Post[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (!posts || posts.length === 0) return null

  return (
    <section className='relative w-full overflow-hidden bg-agro-charcoal'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          {posts.slice(0, 10).map((post, index) => (
            <div
              key={index}
              className='flex-[0_0_100%] min-w-0 relative aspect-[4/5] md:aspect-[16/9] w-full lg:aspect-[21/9]'
            >
              {post._embedded?.['wp:featuredmedia']?.[0] && (
                <Image
                  src={post._embedded?.['wp:featuredmedia']?.[0].source_url}
                  alt={formatHtml(post.title.rendered)}
                  fill
                  priority={index === 0}
                  className='object-cover'
                  sizes='100vw'
                  style={{
                    objectPosition: post.focal_point
                      ? `${post.focal_point.x} ${post.focal_point.y}`
                      : '50% 50%',
                  }}
                />
              )}

              {/* Voile dégradé pour la lisibilité du texte */}
              <div className='absolute inset-0 bg-gradient-to-t from-agro-charcoal via-agro-charcoal/50 to-transparent' />

              {/* Contenu éditorial */}
              <div className='absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-4xl space-y-4 z-10'>
                <div className='flex items-center gap-3'>
                  <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
                    Actualité
                  </span>
                  <span className='font-arial text-xs md:text-sm text-white/70'>
                    {formatMediaDate(post.date)}
                  </span>
                </div>

                <Link
                  href={`/article/${post.slug}`}
                  className='block group w-fit'
                >
                  <h1
                    className='font-lora text-2xl md:text-3xl lg:text-titre font-bold leading-tight text-white group-hover:text-agro-orange-light transition-colors'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(post.title.rendered),
                    }}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flèches de navigation */}
      <button
        onClick={scrollPrev}
        className='hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-agro-green transition-colors z-20 cursor-pointer'
        aria-label='Article précédent'
      >
        <ChevronLeft className='w-5 h-5' />
      </button>

      <button
        onClick={scrollNext}
        className='hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-agro-green transition-colors z-20 cursor-pointer'
        aria-label='Article suivant'
      >
        <ChevronRight className='w-5 h-5' />
      </button>
    </section>
  )
}
