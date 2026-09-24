import { getAllEventSlugs, getEventBySlug } from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ExternalLink,
  PlayCircle,
} from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EventGallery } from '@/components/EventGallery'
import { Metadata } from 'next'
import banner from '@/app/images/pub.png'

function formatEventDate(dateStr: string, timeStr: string) {
  const date = new Date(`${dateStr}T${timeStr || '00:00'}`)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function isPastEvent(dateStr: string, timeStr: string) {
  const eventDate = new Date(`${dateStr}T${timeStr || '00:00'}`)
  return eventDate.getTime() < Date.now()
}

function AdSlot({
  label,
  size,
  className = '',
  imageUrl,
  href,
  alt,
}: {
  label: string
  size: string
  className?: string
  imageUrl?: string | StaticImageData
  href?: string
  alt?: string
}) {
  const content = imageUrl ? (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={imageUrl}
        alt={alt || label}
        fill
        className='object-cover'
        sizes='(min-width: 1024px) 200px, 320px'
      />
      <span className='absolute top-2 right-2 font-arial text-[9px] font-bold uppercase tracking-widest text-white/90 bg-black/40 px-1.5 py-0.5 rounded select-none'>
        Publicité
      </span>
    </div>
  ) : (
    <div
      className={`bg-agro-surface border border-dashed border-agro-border rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden ${className}`}
    >
      <span className='absolute top-2 right-2 font-arial text-[9px] font-bold uppercase tracking-widest text-agro-text-muted select-none'>
        Publicité
      </span>
      <div className='font-arial text-xs text-agro-text-muted space-y-1'>
        <p className='font-bold'>{label}</p>
        <p className='text-[10px] opacity-70'>{size}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        target='_blank'
        rel='noopener sponsored'
        className='block'
      >
        {content}
      </Link>
    )
  }

  return content
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const past = isPastEvent(
    event.event_meta.event_date,
    event.event_meta.event_time,
  )

  const hasReplay = past && !!event.event_meta.event_replay_link
  const hasRegistration = !past && !!event.event_meta.event_link

  return (
    <article className='w-full bg-white'>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12'>
        <div className='grid grid-cols-1 lg:grid-cols-[160px_1fr_160px] xl:grid-cols-[200px_1fr_200px] gap-6 lg:gap-8'>
          {/* Encart pub gauche */}
          <aside className='hidden lg:block'>
            <div className='sticky top-24'>
              <AdSlot
                label='Format Gratte-ciel'
                size='160 x 600 px'
                className='w-full h-[600px]'
                imageUrl={banner}
              />
            </div>
          </aside>

          {/* Colonne centrale */}
          <div className='min-w-0'>
            <div className='max-w-2xl mx-auto'>
              {/* Retour + statut */}
              <div className='flex items-center justify-between gap-4'>
                <Link
                  href='/'
                  className='inline-flex items-center gap-1.5 font-arial text-sm text-agro-text-muted hover:text-agro-green transition-colors'
                >
                  <ArrowLeft className='h-3.5 w-3.5' />
                  Événements
                </Link>

                <span
                  className={`inline-flex items-center gap-1.5 font-arial text-xs font-bold uppercase tracking-wide ${
                    past ? 'text-agro-text-muted' : 'text-agro-green'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      past ? 'bg-agro-text-muted' : 'bg-agro-green'
                    }`}
                  />
                  {past ? 'Terminé' : 'À venir'}
                </span>
              </div>

              {/* Eyebrow : type d'événement + date */}
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-6'>
                {event.event_meta.event_type && (
                  <span className='font-arial text-xs font-bold uppercase tracking-wide text-white bg-agro-green px-2.5 py-1 rounded-full'>
                    {event.event_meta.event_type}
                  </span>
                )}
                <span className='font-arial text-xs font-bold uppercase tracking-[0.14em] text-agro-orange'>
                  {formatEventDate(
                    event.event_meta.event_date,
                    event.event_meta.event_time,
                  )}
                </span>
              </div>

              {/* Titre */}
              <h1
                className='font-lora text-2xl md:text-[2.25rem] md:leading-[1.15] font-bold text-agro-text mt-3'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(event.event_meta.titre_evenement),
                }}
              />

              {/* Métadonnées en ligne fine */}
              <div className='flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 py-4 border-y border-agro-border font-arial text-sm text-agro-text-secondary'>
                <span className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 shrink-0 text-agro-green' />
                  {formatEventDate(
                    event.event_meta.event_date,
                    event.event_meta.event_time,
                  )}
                </span>
                <span className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 shrink-0 text-agro-green' />
                  {event.event_meta.event_time || 'Heure à confirmer'}
                </span>
                {event.event_meta.event_location && (
                  <span className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 shrink-0 text-agro-green' />
                    {event.event_meta.event_location}
                  </span>
                )}
              </div>
            </div>

            {/* Image de couverture */}
            {event.event_meta.poster_url && (
              <div className='max-w-4xl mx-auto mt-6'>
                <div className='relative aspect-[5/2] w-full rounded-md overflow-hidden'>
                  <Image
                    src={event.event_meta.poster_url}
                    alt={formatHtml(event.title.rendered)}
                    fill
                    priority
                    sizes='(min-width: 1024px) 896px, 100vw'
                    className='object-cover'
                    style={{
                      objectPosition:
                        event._embedded?.['wp:featuredmedia']?.[0]?.focus_point
                          ?.object_position ?? '50% 50%',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bouton replay (événement passé) */}
            {hasReplay && (
              <div className='mt-10 pt-8 text-center'>
                <a
                  href={event.event_meta.event_replay_link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 font-arial text-sm font-bold text-white bg-agro-orange hover:bg-agro-orange-dark transition-colors px-6 py-3 rounded-full'
                >
                  <PlayCircle className='h-4 w-4' />
                  Voir le replay
                </a>
              </div>
            )}

            {/* Encart pub mobile/tablette */}
            <div className='lg:hidden mt-6 sm:mt-8 flex justify-center'>
              <AdSlot
                label='Format Bannière'
                size='320 x 100 px'
                className='w-full max-w-[320px] h-[100px]'
              />
            </div>

            {/* Contenu / description */}
            <div className='max-w-2xl mx-auto pb-12 sm:pb-16 pt-8'>
              {event.event_meta.description && (
                <div
                  className='font-arial text-agro-text text-lg leading-[1.7] prose prose-neutral max-w-none
                  [&_h2]:font-lora [&_h2]:text-agro-text [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3
                  [&_h3]:font-lora [&_h3]:text-agro-text [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2
                  [&_a]:text-agro-green-dark [&_a]:no-underline hover:[&_a]:underline
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5
                  [&_p]:mb-4'
                  dangerouslySetInnerHTML={{
                    __html: event.event_meta.description,
                  }}
                />
              )}

              {/* Bouton d'inscription (événement à venir) */}
              {hasRegistration && (
                <div className='mt-10 pt-8 border-t border-agro-border'>
                  <a
                    href={event.event_meta.event_link ?? ''}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 font-arial text-sm font-bold text-white bg-agro-green hover:bg-agro-green-dark transition-colors px-6 py-3 rounded-full'
                  >
                    {"S'inscrire à l'événement"}
                    <ExternalLink className='h-4 w-4' />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Encart pub droite */}
          <aside className='hidden lg:block'>
            <div className='sticky top-24 space-y-6'>
              <AdSlot
                label='Format Gratte-ciel'
                size='160 x 600 px'
                className='w-full h-[600px]'
                imageUrl={banner}
              />
              <AdSlot
                label='Format Pavé'
                size='160 x 250 px'
                className='w-full h-[250px]'
                imageUrl={banner}
              />
            </div>
          </aside>
        </div>
      </div>

      <EventGallery
        images={event.event_gallery_urls ?? []}
        alt={formatHtml(event.title.rendered)}
      />
    </article>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs()
  return slugs.map((slug) => ({ slug: slug.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return { title: 'Événement introuvable' }
  }

  return {
    title: event.event_meta.titre_evenement || `Événement ${event.slug}`,
    description: event.event_meta.description || '',
    openGraph: {
      title: event.event_meta.titre_evenement || `Événement ${event.slug}`,
      description: event.event_meta.description || '',
      images: [
        {
          url: event._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '',
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
      publishedTime: Date.now().toLocaleString(),
      url: `https://agromakers.africa/events/${slug}`,
    },
    alternates: {
      canonical: `https://agromakers.africa/events/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.event_meta.titre_evenement || `Événement ${event.slug}`,
      images: [event._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''],
    },
  }
}
