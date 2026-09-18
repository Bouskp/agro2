import { getEventsPaginated } from '@/lib/wordpressApi' // ⚠️ adapte au nom réel de ta fonction (endpoint /wp-json/wp/v2/event?_embed)
import EventsFilter from './Eventsfilter'
import type { WPEvent } from './EventCard'

export default async function EventsSection() {
  const { data } = await getEventsPaginated(1, 30)

  const events = (data as WPEvent[])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.event_meta.event_date).getTime() -
        new Date(a.event_meta.event_date).getTime(),
    )

  return <EventsFilter events={events} />
}
