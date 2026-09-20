'use client'

import { useState } from 'react'
import EventCard, { type WPEvent } from './EventCard'

const EVENT_TYPES = ['Webinaire', 'Masterclass'] as const

export default function EventsFilter({ events }: { events: WPEvent[] }) {
  const [active, setActive] = useState<'all' | string>('all')

  const filtered =
    active === 'all'
      ? events
      : events.filter((e) => e.event_meta.event_type === active)

  return (
    <section className='w-full bg-agro-background py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10'>
          <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase'>
            Événements
          </h2>

          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setActive('all')}
              className={
                active === 'all'
                  ? 'px-4 py-1.5 font-arial text-sm font-bold rounded-full bg-agro-green text-white transition-colors'
                  : 'px-4 py-1.5 font-arial text-sm font-bold rounded-full border border-agro-border text-agro-text hover:border-agro-green transition-colors'
              }
            >
              Tous
            </button>
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActive(type)}
                className={
                  active === type
                    ? 'px-4 py-1.5 font-arial text-sm font-bold rounded-full bg-agro-green text-white transition-colors'
                    : 'px-4 py-1.5 font-arial text-sm font-bold rounded-full border border-agro-border text-agro-text hover:border-agro-green transition-colors'
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className='font-arial text-sm text-agro-text-secondary'>
            Aucun événement pour le moment.
          </p>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
