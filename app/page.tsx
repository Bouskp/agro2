import Eventssection from '@/components/Eventssection'
import LatestArticles from '@/components/LatestArticles'
import { LatestMagazine } from '@/components/LatestMagazine'
import { VideoTvSection } from '@/components/video-tv'

export default async function Home() {
  return (
    <>
      <LatestMagazine />
      <LatestArticles />
      <VideoTvSection />
      <Eventssection />
    </>
  )
}
