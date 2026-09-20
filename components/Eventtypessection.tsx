import Link from 'next/link'
import { Video, GraduationCap, ArrowRight } from 'lucide-react'

export const EVENT_TYPES = [
  {
    label: 'Webinaire',
    slug: 'webinaire',
    description: 'Sessions en ligne pour apprendre à distance, à votre rythme.',
    icon: Video,
  },
  {
    label: 'Masterclass',
    slug: 'masterclass',
    description: 'Formations approfondies animées par des experts du secteur.',
    icon: GraduationCap,
  },
]

export default function EventTypesSection() {
  return (
    <section className='w-full bg-agro-background py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase mb-5'>
          Types d&apos;événements
        </h2>

        <div className='grid sm:grid-cols-2 gap-6'>
          {EVENT_TYPES.map(({ label, slug, description, icon: Icon }) => (
            <Link
              key={slug}
              href={`/events/type/${slug}`}
              className='group flex items-center justify-between gap-6 rounded-xl border border-agro-border bg-agro-surface p-6 sm:p-8 hover:border-agro-green transition-colors'
            >
              <div className='flex items-center gap-5'>
                <div className='shrink-0 rounded-full bg-agro-green/10 p-4 text-agro-green group-hover:bg-agro-green group-hover:text-white transition-colors'>
                  <Icon className='h-6 w-6' />
                </div>
                <div>
                  <h3 className='font-lora text-xl font-bold text-agro-text uppercase group-hover:text-agro-green transition-colors'>
                    {label}
                  </h3>
                  <p className='font-arial text-sm text-agro-text-secondary mt-1'>
                    {description}
                  </p>
                </div>
              </div>
              <ArrowRight className='h-5 w-5 shrink-0 text-agro-text-secondary group-hover:text-agro-green group-hover:translate-x-1 transition-all' />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
