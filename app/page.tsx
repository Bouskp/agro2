import BentoContainer from '@/components/Bento'
import { DossiersSection } from '@/components/Dossiersection'
import EventTypesSection from '@/components/Eventtypessection'
import { LatestMagazine } from '@/components/LatestMagazine'
import NewsletterSection from '@/components/Newslettersection'
import PortraitsSection from '@/components/Portraitssection'
import CardsContainer from '@/components/ScrollCards'
import { VideoTvSection } from '@/components/video-tv'
import { categories } from '@/lib/utils'

export const revalidate = 3600

export default async function Home() {
  return (
    <>
      <LatestMagazine />
      <BentoContainer
        rubrique={{
          ...categories[3],
          title: 'Actualités à la une',
          slug: 'actualite',
        }}
      />
      <VideoTvSection />
      <CardsContainer
        rubrique={{ id: 109, title: 'Portraits', slug: 'portrait-interview' }}
      />
      <DossiersSection />
      <EventTypesSection />
      <NewsletterSection />
    </>
  )
}
