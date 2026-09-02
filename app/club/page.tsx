import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const clubBenefits = [
  {
    title: 'La communauté AgroMakers',
    description:
      "Rejoignez un écosystème dynamique d'entraide composé d'acteurs engagés pour l'avenir de l'agriculture.",
  },
  {
    title: 'Groupe WhatsApp privé',
    description:
      "Un espace d'échange direct, de partages instantanés et de réseautage exclusif réservé aux seuls membres du Club.",
  },
  {
    title: 'Veille sectorielle régulière',
    description:
      'Restez informé des meilleures opportunités : financements, appels à projets, formations, événements et partenariats.',
  },
  {
    title: 'Mises en relation ciblées',
    description:
      "Accès privilégié à des contacts clés : entrepreneurs, experts, partenaires stratégiques, structures d'accompagnement ou financeurs.",
  },
  {
    title: 'Accès prioritaire & Remises',
    description:
      'Bénéficiez de tarifs préférentiels exclusifs et de places garanties en priorité sur tous les événements signés AgroMakers.',
  },
  {
    title: "Publication d'opportunités",
    description:
      "Partagez et diffusez directement vos propres annonces (offres d'emploi, collaborations, prestations de services) auprès de la communauté.",
  },
  {
    title: 'Visibilité de bienvenue',
    description:
      "Profitez d'une mise en avant ponctuelle et ciblée sur les canaux officiels AgroMakers dès la validation de votre adhésion.",
  },
]

// Données statiques — à remplacer par un CPT WordPress (events) plus tard
const upcomingEvents = [
  {
    id: '1',
    title: 'Rencontre mensuelle du Club — Réseautage',
    date: '2026-09-18',
    location: 'Abidjan, Cocody',
    type: 'Networking',
  },
  {
    id: '2',
    title: 'Atelier : Financer son exploitation agricole',
    date: '2026-09-27',
    location: 'En ligne (Zoom)',
    type: 'Formation',
  },
  {
    id: '3',
    title: 'Visite de terrain — Coopérative de Bouaké',
    date: '2026-10-05',
    location: 'Bouaké',
    type: 'Terrain',
  },
]

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const JOIN_FORM_URL = 'https://forms.gle/n7GAW9HLhayoN7EW9'

export default function ClubPage() {
  return (
    <div className='bg-agro-background'>
      {/* ─── HERO ─── */}
      <section className='w-full border-b border-agro-border py-10 md:py-16'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center'>
          <span className='text-[10px] font-sans font-light uppercase tracking-[0.14em] text-agro-green mb-4 block'>
            Espace Membres Privé
          </span>
          <h1 className='font-lora text-3xl sm:text-4xl md:text-5xl font-normal text-agro-charcoal tracking-wide leading-tight mb-6'>
            Le Club AgroMakers
          </h1>
          <p className='text-agro-text-secondary text-base font-light leading-relaxed max-w-2xl mx-auto mb-10'>
            Un cercle restreint pensé pour briser l&apos;isolement
            entrepreneurial et accélérer le développement de vos projets
            agricoles — communauté, opportunités et rencontres réservées aux
            membres.
          </p>
          <Button
            asChild
            size='lg'
            className='font-lora font-normal text-base bg-agro-green hover:bg-agro-green-dark text-white'
          >
            <Link href={JOIN_FORM_URL} target='_blank'>
              Rejoindre le Club
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── AVANTAGES ─── */}
      <section className='w-full py-8 md:py-12'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start'>
            <div className='lg:col-span-4 lg:sticky lg:top-8'>
              <span className='text-[10px] font-sans font-light uppercase tracking-[0.14em] text-agro-green mb-3 block'>
                Ce que vous obtenez
              </span>
              <h2 className='font-lora text-2xl sm:text-3xl font-normal text-agro-charcoal tracking-wide leading-tight'>
                Sept avantages pensés pour votre croissance
              </h2>
            </div>

            <div className='lg:col-span-8'>
              <div className='border-t border-agro-border divide-y divide-agro-border'>
                {clubBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className='group/item grid grid-cols-[auto_1fr] gap-6 py-6'
                  >
                    <span className='font-lora text-sm font-normal text-agro-orange pt-0.5'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className='font-lora text-base font-normal text-agro-charcoal tracking-wide mb-1 group-hover/item:text-agro-green transition-colors'>
                        {benefit.title}
                      </h3>
                      <p className='text-agro-text-secondary text-sm font-light leading-relaxed'>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ÉVÉNEMENTS ─── */}
      <section className='w-full border-t border-agro-border py-8 md:py-12'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10'>
            <div>
              <span className='text-[10px] font-sans font-light uppercase tracking-[0.14em] text-agro-green mb-3 block'>
                Agenda du Club
              </span>
              <h2 className='font-lora text-2xl sm:text-3xl font-normal text-agro-charcoal tracking-wide leading-tight'>
                Prochains événements
              </h2>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-px bg-agro-border'>
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className='bg-agro-surface p-6 flex flex-col gap-4'
              >
                <span className='text-[10px] font-sans font-light uppercase tracking-[0.14em] text-agro-orange'>
                  {event.type}
                </span>
                <h3 className='font-lora text-base font-normal text-agro-charcoal tracking-wide leading-snug'>
                  {event.title}
                </h3>
                <div className='mt-auto space-y-1.5 pt-2'>
                  <div className='flex items-center gap-2 text-xs text-agro-text-secondary font-light'>
                    <Calendar className='h-3.5 w-3.5 text-agro-green' />
                    {formatEventDate(event.date)}
                  </div>
                  <div className='flex items-center gap-2 text-xs text-agro-text-secondary font-light'>
                    <MapPin className='h-3.5 w-3.5 text-agro-green' />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className='w-full border-t border-agro-border py-20 md:py-28'>
        <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='font-lora text-2xl sm:text-3xl font-normal text-agro-charcoal tracking-wide leading-tight mb-6'>
            Prêt à rejoindre le mouvement ?
          </h2>
          <p className='text-agro-text-secondary text-sm font-light leading-relaxed mb-10'>
            L&apos;adhésion au Club AgroMakers est ouverte à tous les acteurs
            engagés dans la transformation du secteur agricole ivoirien.
          </p>
          <Button
            asChild
            size='lg'
            className='font-lora font-normal text-base bg-agro-orange hover:bg-agro-orange-dark text-white'
          >
            <Link href={JOIN_FORM_URL} target='_blank'>
              Devenir membre
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
