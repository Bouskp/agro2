import BentoContainer from '@/components/Bento'
import { ActualitesSection, DossiersSection } from '@/components/Dossiersection'
import EventTypesSection from '@/components/Eventtypessection'
import { LatestMagazine } from '@/components/LatestMagazine'
import NewsletterSection from '@/components/Newslettersection'
import CardsContainer from '@/components/ScrollCards'
import { VideoTvSection } from '@/components/video-tv'
import { categories } from '@/lib/utils'

export const revalidate = 3600

export default async function Home() {
  return (
    <>
      <BentoContainer
        rubrique={{
          ...categories[3],
          title: 'A la une',
        }}
      />
      <LatestMagazine />
      <ActualitesSection />
      <DossiersSection />
      <CardsContainer
        rubrique={{ id: 109, title: 'Portraits', slug: 'portrait-interview' }}
      />
      <VideoTvSection />
      <EventTypesSection />
      <NewsletterSection />
    </>
  )
}
