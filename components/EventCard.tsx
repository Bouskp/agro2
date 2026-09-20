import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock } from 'lucide-react'
import { formatHtml } from '@/lib/utils'

export type WPEvent = {
  id: number
  slug: string
  title: { rendered: string }
  event_meta: {
    titre_evenement: string
    description?: string
    event_date: string
    event_time: string
    event_location?: string
    event_link?: string | null
    event_type?: string
    poster_url?: string | null
  }
  _embedded?: {
    'wp:featuredmedia'?: [
      {
        source_url: string
        focus_point?: {
          object_position: string
        }
      },
    ]
  }
}

function isPastEvent(dateStr: string, timeStr: string) {
  const eventDate = new Date(`${dateStr}T${timeStr || '00:00'}`)
  return eventDate.getTime() < Date.now()
}

function formatEventDate(dateStr: string, timeStr: string) {
  const date = new Date(`${dateStr}T${timeStr || '00:00'}`)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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

export default function EventCard({ event }: { event: WPEvent }) {
  const { event_meta } = event
  const past = isPastEvent(event_meta.event_date, event_meta.event_time)

  return (
    <Link href={`/events/${event.slug}`} className='group block'>
      <div className='relative aspect-[16/9] rounded-xl overflow-hidden bg-agro-charcoal mb-4'>
        {event_meta.poster_url ? (
          <Image
            src={event_meta.poster_url}
            alt={formatHtml(event.title.rendered)}
            fill
            sizes='(max-width: 768px) 100vw, 400px'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            style={{
              objectPosition:
                event._embedded?.['wp:featuredmedia']?.[0].focus_point
                  ?.object_position,
            }}
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center text-white/40 font-lora text-3xl'>
            {event_meta.titre_evenement?.charAt(0)}
          </div>
        )}
        <div className='absolute top-3 left-3'>
          <EventStatusBadge isPast={past} />
        </div>
      </div>

      <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
        {formatEventDate(event_meta.event_date, event_meta.event_time)}
      </span>

      <h3
        className='font-lora text-lg font-bold text-agro-text uppercase leading-tight mt-2 line-clamp-2 group-hover:text-agro-green transition-colors'
        dangerouslySetInnerHTML={{
          __html: formatHtml(event_meta.titre_evenement),
        }}
      />

      <div className='flex flex-wrap gap-x-4 gap-y-1 mt-3 font-arial text-xs text-agro-text-secondary'>
        {event_meta.event_location && (
          <span className='flex items-center gap-1.5'>
            <MapPin className='h-3.5 w-3.5 shrink-0 text-agro-green' />
            {event_meta.event_location}
          </span>
        )}
        <span className='flex items-center gap-1.5'>
          <Clock className='h-3.5 w-3.5 shrink-0 text-agro-green' />
          {event_meta.event_time || 'Heure à confirmer'}
        </span>
      </div>

      {!past && event_meta.event_link && (
        <span className='inline-flex items-center font-arial text-sm font-bold text-agro-green mt-4 group-hover:underline'>
          S&apos;inscrire
        </span>
      )}
    </Link>
  )
}
