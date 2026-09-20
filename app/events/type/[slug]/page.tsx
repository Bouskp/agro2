import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getEventsByType } from '@/lib/wordpressApi'
import { AgroEvent } from '@/lib/wordpress'
import EventCard from '@/components/EventCard' // ⚠️ adapte le chemin réel
import Pagination from '@/components/Pagination' // ⚠️ adapte le chemin réel
import { CalendarX2 } from 'lucide-react'

const PER_PAGE = 12

const EVENT_TYPES: Record<string, { label: string; plural: string }> = {
  webinaire: { label: 'Webinaire', plural: 'Webinaires' },
  masterclass: { label: 'Masterclass', plural: 'Masterclass' },
}

export function EmptyEventsState() {
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

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const typeInfo = EVENT_TYPES[slug.toLowerCase()]
  if (!typeInfo) {
    return notFound()
  }

  const { data: events, headers } = await getEventsByType(
    typeInfo.label,
    currentPage,
    PER_PAGE,
  )
  const { totalPages } = headers

  return (
    <section className='w-full bg-agro-background py-8 md:py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1 className='font-lora text-xl md:text-2xl font-bold text-black uppercase mb-10'>
          {typeInfo.plural}
        </h1>

        {events.length === 0 ? (
          <EmptyEventsState />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {(events as AgroEvent[]).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/events/type/${slug}`}
        />
      </div>
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const typeInfo = EVENT_TYPES[slug.toLowerCase()]

  return {
    title: typeInfo
      ? `AgroMakers - ${typeInfo.plural}`
      : 'AgroMakers - Événements',
  }
}
