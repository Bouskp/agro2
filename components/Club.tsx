'use client'

import Link from 'next/link'
import { Users, Lightbulb, ShieldCheck, Rocket, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const clubBenefits = [
  {
    icon: <Users className='h-5 w-5 text-agro-green-light' />,
    title: "Réseau Privé d'Élite",
    description:
      "Connectez-vous directement avec des centaines de producteurs, d'investisseurs et d'experts AgriTech d'Afrique et d'ailleurs.",
  },
  {
    icon: <Lightbulb className='h-5 w-5 text-agro-green-light' />,
    title: 'Ressources & Formations',
    description:
      'Accédez à nos guides techniques complets, replays de masterclasses et analyses de marché exclusives non publiés sur le site.',
  },
  {
    icon: <ShieldCheck className='h-5 w-5 text-agro-green-light' />,
    title: 'Accompagnement Sur-Mesure',
    description:
      'Bénéficiez de sessions de mentorat de groupe pour structurer, financer et sécuriser juridiquement vos exploitations.',
  },
  {
    icon: <Rocket className='h-5 w-5 text-agro-green-light' />,
    title: 'Opportunités de Financement',
    description:
      'Présentez vos projets en priorité lors de nos sessions de pitch fermées devant notre réseau de business angels.',
  },
]

export function AgroMakersClub() {
  return (
    <section className='w-full bg-agro-charcoal text-agro-white py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center'>
          {/* BLOC PRÉSENTATION GAUCHE */}
          <div className='lg:col-span-5 flex flex-col justify-center'>
            <span className='font-arial text-xs font-bold uppercase tracking-[0.14em] text-agro-orange mb-3 block'>
              Espace Membres Exclusif
            </span>

            <h2 className='font-lora text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight mb-6'>
              Rejoignez le Club des AgroMakers
            </h2>

            <p className='font-georgia text-sm sm:text-base text-white/70 leading-relaxed mb-6'>
              Le Club AgroMakers rassemble les entrepreneurs, décideurs et
              innovateurs de l&apos;écosystème agricole moderne. Plus
              qu&apos;une communauté, c&apos;est un accélérateur de synergies
              conçu pour briser l&apos;isolement et propulser vos projets vers
              l&apos;excellence.
            </p>

            <p className='font-georgia text-sm sm:text-base text-white/70 leading-relaxed mb-8'>
              Que vous lanciez votre première ferme connectée ou gériez une
              agro-industrie d&apos;envergure, votre place est parmi nous.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                asChild
                className='bg-agro-green hover:bg-agro-green-dark text-white gap-2 font-arial py-5 px-6'
              >
                <Link href='/club/devenir-membre'>
                  Devenir Membre <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className='border-white/20 text-white/90 hover:bg-white/10 hover:text-white font-arial py-5 px-6'
              >
                <Link href='/club/charte'>Découvrir la charte</Link>
              </Button>
            </div>
          </div>

          {/* BLOC AVANTAGES DROITE */}
          <div className='lg:col-span-7'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              {clubBenefits.map((benefit, index) => (
                <Card
                  key={index}
                  className='bg-white/5 border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:border-agro-green/40 group'
                >
                  <CardContent className='p-6 flex flex-col gap-4'>
                    <div className='p-3 bg-black/20 rounded-lg w-fit group-hover:bg-agro-green/10 transition-colors duration-300'>
                      {benefit.icon}
                    </div>

                    <div>
                      <h3 className='font-arial font-semibold text-base text-white group-hover:text-agro-orange-light transition-colors duration-300 mb-1'>
                        {benefit.title}
                      </h3>
                      <p className='font-georgia text-xs sm:text-sm text-white/60 leading-relaxed'>
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
