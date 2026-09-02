'use client'

import Link from 'next/link'
import {
  Users,
  MessageSquare,
  TrendingUp,
  Zap,
  Ticket,
  Megaphone,
  Eye,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const clubBenefits = [
  {
    icon: <Users className='h-5 w-5 text-agro-green-light' />,
    title: 'La communauté AgroMakers',
    description:
      "Rejoignez un écosystème dynamique d'entraide composé d'acteurs engagés pour l'avenir de l'agriculture.",
  },
  {
    icon: <MessageSquare className='h-5 w-5 text-agro-green-light' />,
    title: 'Groupe WhatsApp privé',
    description:
      "Un espace d'échange direct, de partages instantanés et de réseautage exclusif réservé aux seuls membres du Club.",
  },
  {
    icon: <TrendingUp className='h-5 w-5 text-agro-green-light' />,
    title: 'Veille sectorielle régulière',
    description:
      'Restez informé des meilleures opportunités : financements, appels à projets, formations, événements et partenariats.',
  },
  {
    icon: <Zap className='h-5 w-5 text-agro-green-light' />,
    title: 'Mises en relation ciblées',
    description:
      "Accès privilégié à des contacts clés : entrepreneurs, experts, partenaires stratégiques, structures d'accompagnement ou financeurs.",
  },
  {
    icon: <Ticket className='h-5 w-5 text-agro-green-light' />,
    title: 'Accès prioritaire & Remises',
    description:
      'Bénéficiez de tarifs préférentiels exclusifs et de places garanties en priorité sur tous les événements signés AgroMakers.',
  },
  {
    icon: <Megaphone className='h-5 w-5 text-agro-green-light' />,
    title: "Publication d'opportunités",
    description:
      "Partagez et diffusez directement vos propres annonces (offres d'emploi, collaborations, prestations de services) auprès de la communauté.",
  },
  {
    icon: <Eye className='h-5 w-5 text-agro-green-light' />,
    title: 'Visibilité de bienvenue',
    description:
      "Profitez d'une mise en avant ponctuelle et ciblée sur les canaux officiels AgroMakers dès la validation de votre adhésion.",
  },
]

export function AgroMakersClub() {
  return (
    <section className='w-full bg-agro-charcoal text-agro-white py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start'>
          {/* BLOC DESCRIPTIF (sticky) */}
          <div className='lg:col-span-4 lg:sticky lg:top-8 flex flex-col justify-center'>
            <span className='font-arial text-xs font-bold uppercase tracking-[0.14em] text-agro-orange mb-3 block'>
              Espace Membres Privé
            </span>

            <h2 className='font-lora text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight mb-6'>
              Pourquoi rejoindre le Club ?
            </h2>

            <p className='font-georgia text-sm sm:text-base text-white/70 leading-relaxed mb-6'>
              Devenir membre du Club AgroMakers, c&apos;est intégrer un cercle
              restreint pensé pour briser l&apos;isolement entrepreneurial et
              accélérer le développement de vos projets agricoles.
            </p>

            <p className='font-georgia text-sm text-white/70 leading-relaxed mb-8'>
              Découvrez l&apos;ensemble des avantages et services conçus
              exclusivement pour accompagner votre croissance au quotidien.
            </p>

            <div className='flex flex-col sm:flex-row lg:flex-col gap-4'>
              <Button
                asChild
                className='bg-agro-green hover:bg-agro-green-dark text-white gap-2 font-arial py-5 px-6 w-full sm:w-auto lg:w-full'
              >
                <Link
                  href='https://forms.gle/n7GAW9HLhayoN7EW9'
                  target='_blank'
                >
                  Rejoindre le Club <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>

          {/* LISTE DES 7 AVANTAGES */}
          <div className='lg:col-span-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              {clubBenefits.map((benefit, index) => {
                const isLastItem = index === clubBenefits.length - 1

                return (
                  <Card
                    key={index}
                    className={`bg-white/5 border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:border-agro-green/30 group ${
                      isLastItem ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <CardContent className='p-6 flex flex-col sm:flex-row items-start gap-4 h-full'>
                      <div className='p-3 bg-black/20 rounded-lg w-fit group-hover:bg-agro-green/10 transition-colors duration-300 flex-shrink-0'>
                        {benefit.icon}
                      </div>

                      <div className='space-y-1'>
                        <h3 className='font-arial font-semibold text-base text-white group-hover:text-agro-orange-light transition-colors duration-300'>
                          {benefit.title}
                        </h3>
                        <p className='font-georgia text-xs sm:text-sm text-white/60 leading-relaxed'>
                          {benefit.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
