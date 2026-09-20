import ActualiteSection from '@/components/Actualitesection'
import DossierSection from '@/components/Dossiersection'
import EventTypesSection from '@/components/Eventtypessection'
import { LatestMagazine } from '@/components/LatestMagazine'
import NewsletterForm from '@/components/Newsletterform'
import NewsletterSection from '@/components/Newslettersection'
import PortraitsSection from '@/components/Portraitssection'
import { VideoTvSection } from '@/components/video-tv'

export const revalidate = 3600

export default async function Home() {
  return (
    <>
      <LatestMagazine />
      <ActualiteSection />
      <DossierSection />
      <VideoTvSection />
      <PortraitsSection />
      <EventTypesSection />
      <NewsletterSection />
    </>
  )
}
