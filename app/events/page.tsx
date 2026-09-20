import { EventsSection } from '@/components/agromakers-events'
import { getEventsPaginated } from '@/lib/wordpressApi'

export default async function page() {
  const { data: events } = await getEventsPaginated(1, 10)

  return <EventsSection events={events} />
}
