'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, MapPin, Calendar } from 'lucide-react'
import { AgroEvent } from '@/lib/wordpress'
import { formatHtml } from '@/lib/utils'

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PastEventsSection({ events }: { events: AgroEvent[] }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  if (!events || events.length === 0) return null

  return (
    <section className='w-full bg-agro-background py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-10'>
          <h2 className='font-lora text-2xl md:text-3xl font-bold tracking-tight text-agro-text'>
            Événements passés
          </h2>
          <p className='font-arial text-sm text-agro-text-secondary mt-1'>
            Revivez nos précédentes rencontres en images.
          </p>
        </div>

        <div className='flex flex-col gap-10'>
          {events.map((event) => {
            const gallery = event.event_gallery_urls ?? []

            return (
              <article
                key={event.id}
                className='rounded-xl border border-agro-border bg-agro-surface p-6'
              >
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4'>
                  <h3
                    className='font-lora text-lg font-bold text-agro-text'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(event.title.rendered),
                    }}
                  />
                  <div className='flex items-center gap-3 font-arial text-xs text-agro-text-muted'>
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-3.5 w-3.5' />
                      {formatEventDate(event.event_meta.event_date)}
                    </span>
                    {event.event_meta.event_location && (
                      <span className='flex items-center gap-1'>
                        <MapPin className='h-3.5 w-3.5' />
                        {event.event_meta.event_location}
                      </span>
                    )}
                  </div>
                </div>

                {gallery.length > 0 ? (
                  <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2'>
                    {gallery.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxImage(url)}
                        className='relative aspect-square rounded-md overflow-hidden group'
                      >
                        <Image
                          src={url}
                          alt={`Photo ${i + 1} - ${formatHtml(event.title.rendered)}`}
                          fill
                          sizes='150px'
                          className='object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className='font-arial text-sm text-agro-text-muted italic'>
                    Aucune photo disponible pour cet événement.
                  </p>
                )}
              </article>
            )
          })}
        </div>
      </div>

      {/* Lightbox simple */}
      {lightboxImage && (
        <div
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
          onClick={() => setLightboxImage(null)}
        >
          <button
            className='absolute top-4 right-4 text-white/80 hover:text-white'
            onClick={() => setLightboxImage(null)}
            aria-label='Fermer'
          >
            <X className='h-8 w-8' />
          </button>
          <div className='relative w-full max-w-4xl aspect-video'>
            <Image
              src={lightboxImage}
              alt='Photo agrandie'
              fill
              sizes='90vw'
              className='object-contain'
            />
          </div>
        </div>
      )}
    </section>
  )
}
