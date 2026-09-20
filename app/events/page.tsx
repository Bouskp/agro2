import { EventsSection } from '@/components/agromakers-events'
import { getEventsPaginated } from '@/lib/wordpressApi'

export default async function page() {
  const { data: events, headers } = await getEventsPaginated(1, 10)
  console.log(headers)

  return <EventsSection events={events} />
}
