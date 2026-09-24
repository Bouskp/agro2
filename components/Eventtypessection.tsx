import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import { Video, GraduationCap, Users, ArrowRight } from 'lucide-react'
import masterclass from '../app/images/event/masterclass.png'
import webinaire from '../app/images/event/webinaire.png'
import riaaf from '../app/images/event/riaaf.png'

export const EVENT_TYPES: {
  label: string
  slug: string
  description: string
  icon: typeof Video
  image: StaticImageData | string
}[] = [
  {
    label: 'Webinaires',
    slug: 'webinaire',
    description: 'Sessions en ligne pour apprendre à distance, à votre rythme.',
    icon: Video,
    image: webinaire,
  },
  {
    label: 'Masterclass',
    slug: 'masterclass',
    description: 'Formations approfondies animées par des experts du secteur.',
    icon: GraduationCap,
    image: masterclass,
  },
  {
    label: "Les Rencontres de l'Intelligence Agricole Africaine (RIAAf)",
    slug: 'riaaf',
    description:
      "Le rendez-vous majeur des acteurs de l'innovation agricole en Afrique.",
    icon: Users,
    image: riaaf,
  },
]

export default function EventTypesSection() {
  return (
    <section className='w-full bg-agro-background py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase mb-5'>
          événements
        </h2>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {EVENT_TYPES.map(
            ({ label, slug, description, icon: Icon, image }) => (
              <Link
                key={slug}
                href={`/events/type/${slug}`}
                className='group flex flex-col overflow-hidden rounded-xl border border-agro-border bg-agro-surface hover:border-agro-green hover:shadow-md transition-all'
              >
                <div className='relative aspect-[16/10] w-full overflow-hidden bg-agro-charcoal'>
                  <Image
                    src={image}
                    alt={label}
                    fill
                    sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />
                  <div className='absolute top-4 left-4 rounded-full bg-white/90 p-2.5 text-agro-green group-hover:bg-agro-green group-hover:text-white transition-colors'>
                    <Icon className='h-5 w-5' />
                  </div>
                </div>

                <div className='flex items-center justify-between gap-4 p-5 sm:p-6'>
                  <div>
                    <h3 className='font-lora text-lg font-bold text-agro-text uppercase group-hover:text-agro-green transition-colors'>
                      {label}
                    </h3>
                    <p className='font-arial text-sm text-agro-text-secondary mt-1'>
                      {description}
                    </p>
                  </div>
                  <ArrowRight className='h-5 w-5 shrink-0 text-agro-text-secondary group-hover:text-agro-green group-hover:translate-x-1 transition-all' />
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
