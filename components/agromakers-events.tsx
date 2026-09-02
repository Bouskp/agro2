import { CalendarX2 } from 'lucide-react'
import { AgroEvent } from '@/lib/wordpress'
import { formatHtml } from '@/lib/utils'
import { Calendar, MapPin } from 'lucide-react'

function formatEventDate(dateStr: string, timeStr: string) {
  const date = new Date(`${dateStr}T${timeStr || '00:00'}`)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function EmptyEventsState() {
  return (
    <div className='flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-agro-border bg-agro-surface py-16 px-6'>
      <div className='rounded-full bg-agro-green/10 p-4 mb-4'>
        <CalendarX2 className='h-8 w-8 text-agro-green' />
      </div>
      <h3 className='font-lora text-lg font-bold text-agro-text'>
        Aucun événement pour le moment
      </h3>
      <p className='font-arial text-sm text-agro-text-secondary mt-2 max-w-sm'>
        Nos prochaines rencontres, formations et salons seront annoncés ici.
        Revenez bientôt !
      </p>
    </div>
  )
}

export function EventsSection({ events }: { events: AgroEvent[] }) {
  return (
    <section className='w-full bg-agro-background py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-10'>
          <h2 className='font-lora text-2xl md:text-3xl font-bold tracking-tight text-agro-text'>
            Événements à venir
          </h2>
          <p className='font-arial text-sm text-agro-text-secondary mt-1'>
            Rencontres, formations et salons Agromakers.
          </p>
        </div>

        {events.length === 0 ? (
          <EmptyEventsState />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {events.map((event) => (
              <article
                key={event.id}
                className='rounded-xl border border-agro-border bg-agro-surface overflow-hidden hover:shadow-md transition-shadow'
              >
                {event._embedded?.['wp:featuredmedia']?.[0] && (
                  <div className='relative aspect-[16/9] w-full'>
                    <img
                      src={event._embedded['wp:featuredmedia'][0].source_url}
                      alt={formatHtml(event.title.rendered)}
                      className='object-cover w-full h-full'
                      loading='lazy'
                    />
                  </div>
                )}

                <div className='p-5'>
                  <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
                    {formatEventDate(
                      event.meta.event_date,
                      event.meta.event_time,
                    )}
                  </span>

                  <h3
                    className='font-lora text-lg font-bold mt-2 text-agro-text leading-snug'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(event.title.rendered),
                    }}
                  />

                  <div className='flex flex-col gap-1.5 mt-3 font-arial text-sm text-agro-text-secondary'>
                    {event.meta.event_location && (
                      <span className='flex items-center gap-1.5'>
                        <MapPin className='h-3.5 w-3.5 shrink-0' />
                        {event.meta.event_location}
                      </span>
                    )}
                    <span className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5 shrink-0' />
                      {event.meta.event_time || 'Heure à confirmer'}
                    </span>
                  </div>

                  {event.meta.event_link && (
                    <a
                      href={event.meta.event_link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-block mt-4 font-arial text-sm font-bold text-agro-green hover:text-agro-green-dark transition-colors'
                    >
                      {"S'inscrire →"}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
