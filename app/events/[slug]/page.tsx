import { getAllEventSlugs, getEventBySlug } from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EventGallery } from '@/components/EventGallery'
import { Metadata } from 'next'

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

function EventStatusBadge({ isPast }: { isPast: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-arial text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${
        isPast
          ? 'bg-agro-text-muted/10 text-agro-text-muted'
          : 'bg-agro-green/10 text-agro-green'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPast ? 'bg-agro-text-muted' : 'bg-agro-green'
        }`}
      />
      {isPast ? 'Événement terminé' : 'Événement à venir'}
    </span>
  )
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

  return (
    <>
      <article className='w-full bg-agro-background py-8 md:py-12'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          {/* Retour */}
          <Link
            href='/events'
            className='inline-flex items-center gap-2 font-arial text-sm font-bold text-agro-text-secondary hover:text-agro-green transition-colors mb-6'
          >
            <ArrowLeft className='h-4 w-4' />
            Retour aux événements
          </Link>

          {/* Image de couverture */}
          <div className='relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-agro-charcoal mb-8'>
            {event.event_meta.poster_url && (
              <Image
                src={event.event_meta.poster_url}
                alt={formatHtml(event.title.rendered)}
                fill
                priority
                sizes='(max-width: 768px) 100vw, 800px'
                className='object-cover'
              />
            )}
            <div className='absolute top-4 left-4'>
              <EventStatusBadge isPast={past} />
            </div>
          </div>

          {/* En-tête */}
          <div className='mb-8'>
            <span className='font-arial text-sm font-bold uppercase tracking-wide text-agro-orange'>
              {formatEventDate(
                event.event_meta.event_date,
                event.event_meta.event_time,
              )}
            </span>

            <h1
              className='font-lora text-3xl md:text-4xl font-bold text-agro-text uppercase mt-3 leading-tight'
              dangerouslySetInnerHTML={{
                __html: formatHtml(event.event_meta.titre_evenement),
              }}
            />

            <div className='flex flex-wrap gap-x-6 gap-y-2 mt-5 font-arial text-sm text-agro-text-secondary'>
              {event.event_meta.event_location && (
                <span className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 shrink-0 text-agro-green' />
                  {event.event_meta.event_location}
                </span>
              )}
              <span className='flex items-center gap-2'>
                <Clock className='h-4 w-4 shrink-0 text-agro-green' />
                {event.event_meta.event_time || 'Heure à confirmer'}
              </span>
              <span className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 shrink-0 text-agro-green' />
                {formatEventDate(
                  event.event_meta.event_date,
                  event.event_meta.event_time,
                )}
              </span>
            </div>
          </div>

          {/* Contenu / description */}
          {event.event_meta.description && (
            <div
              className='font-arial text-agro-text-secondary text-base leading-relaxed prose prose-agro max-w-none mt-4 pt-8 border-t border-agro-border
              [&_h2]:font-lora [&_h2]:text-agro-text [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3
              [&_h3]:font-lora [&_h3]:text-agro-text [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2
              [&_a]:text-agro-green [&_a]:font-bold [&_a]:no-underline hover:[&_a]:underline
              [&_p]:mb-4'
              dangerouslySetInnerHTML={{ __html: event.event_meta.description }}
            />
          )}

          {/* Bouton d'inscription */}
          {!past && event.event_meta.event_link && (
            <a
              href={event.event_meta.event_link}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 font-arial text-sm font-bold text-white bg-agro-green hover:bg-agro-green-dark transition-colors px-6 py-3 rounded-full mb-10'
            >
              {"S'inscrire à l'événement"}
              <ExternalLink className='h-4 w-4' />
            </a>
          )}

          {/* Rappel d'inscription en bas si événement long */}
          {!past && event.event_meta.event_link && (
            <div className='mt-10 pt-8 border-t border-agro-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-agro-surface border border-agro-border p-6'>
              <div>
                <h3 className='font-lora text-lg font-bold text-agro-text'>
                  Ne manquez pas cet événement
                </h3>
                <p className='font-arial text-sm text-agro-text-secondary mt-1'>
                  Places limitées, inscrivez-vous dès maintenant.
                </p>
              </div>
              <a
                href={event.event_meta.event_link}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 font-arial text-sm font-bold text-white bg-agro-green hover:bg-agro-green-dark transition-colors px-6 py-3 rounded-full whitespace-nowrap'
              >
                {"S'inscrire"}
                <ExternalLink className='h-4 w-4' />
              </a>
            </div>
          )}
        </div>
        <EventGallery
          images={event.event_gallery_urls ?? []}
          alt={formatHtml(event.title.rendered)}
        />
      </article>
    </>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs()
  return slugs.map(({ slug }) => ({ slug }))
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
