import { EventsSection } from '@/components/agromakers-events'
import { AgroMakersClub } from '@/components/Club'
import { LatestMagazine } from '@/components/LatestMagazine'
import HeroSlider from '@/components/SliderComponent'
import { VideoTvSection } from '@/components/video-tv'
import { getRecentPosts, getUpcomingEvents } from '@/lib/wordpressApi'

export default async function Home() {
  const data = await getRecentPosts()
  const events = await getUpcomingEvents()

  return (
    <>
      <HeroSlider posts={data} />
      <LatestMagazine />
      <VideoTvSection />
      <EventsSection events={events} />
      <AgroMakersClub />
    </>
  )
}
