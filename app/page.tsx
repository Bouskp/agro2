import { EventsSection } from '@/components/agromakers-events'
import { LatestMagazine } from '@/components/LatestMagazine'
import HeroSlider from '@/components/SliderComponent'
import { VideoTvSection } from '@/components/video-tv'
import { getEventsPaginated, getRecentPosts } from '@/lib/wordpressApi'

export default async function Home() {
  const data = await getRecentPosts()
  const { data: events } = await getEventsPaginated(1, 5)

  return (
    <>
      <HeroSlider posts={data} />
      <LatestMagazine />
      <VideoTvSection />
      <EventsSection events={events} />
    </>
  )
}
