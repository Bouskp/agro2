import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { getAllAgromags } from '@/lib/wordpressApi' // adaptez le chemin

export async function LatestMagazine() {
  const { data: magazines } = await getAllAgromags(1, 1)
  const magazine = magazines[0]

  if (!magazine) return null

  const meta = magazine.magazine_meta

  return (
    /* 
      Changement du fond : bg-gray-50/70 crée un contraste doux et premium.
      Les bordures horizontales ancrent proprement la section.
    */
    <section className='w-full bg-gray-50/70 border-y border-gray-200/60 py-8 md:py-12'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center'>
          {/* ─── COUVERTURE ─── */}
          <div className='lg:col-span-5 flex justify-center order-first lg:order-none'>
            {/* 
               shadow-[15px_15px_30px_rgba(0,0,0,0.08)] : simule une ombre de livre réaliste.
               rounded-sm : donne une micro-courbure aux coins de la revue papier.
            */}
            <div className='group relative w-full max-w-[320px] aspect-[3/4] overflow-hidden bg-white shadow-[15px_15px_30px_rgba(0,0,0,0.08)] rounded-sm transition-all duration-500 ease-out hover:shadow-[20px_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1'>
              {meta.poster_url && (
                <Image
                  src={meta.poster_url}
                  alt={`Couverture du magazine n°${meta.issue}`}
                  fill
                  priority // Recommandé car c'est un bloc de présentation Hero/Une
                  className='object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.03]'
                  style={{ objectPosition: meta.poster_position ?? '50% 50%' }}
                />
              )}
              {/* Reflet lumineux brillant au survol */}
              <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none' />
            </div>
          </div>

          {/* ─── CONTENU ─── */}
          <div className='lg:col-span-7 flex flex-col justify-center'>
            <span className='text-[10px] font-arial font-medium uppercase tracking-[0.14em] text-agro-orange mb-3 block'>
              Dernier Numéro — N°{meta.issue}
            </span>

            <h2 className='font-lora text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-wide leading-tight mb-6'>
              {meta.titre_magazine}
            </h2>

            <p className='text-gray-600 text-sm sm:text-base font-light leading-relaxed mb-8 font-arial'>
              {meta.description}
            </p>

            {/* Sommaire (Adapté pour se détacher sur le fond gris clair) */}
            <div className='border-t border-b border-gray-200/80 mb-8 py-4'>
              <p className='text-[10px] font-georgia font-bold uppercase tracking-[0.14em] text-gray-400 mb-3'>
                Au sommaire de cette édition
              </p>
              <div
                className='font-arial font-light text-neutral-800 text-base leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2 [&_li]:text-neutral-700 hover:[&_li]:text-black transition-colors'
                dangerouslySetInnerHTML={{ __html: meta.sommaire_html }}
              />
            </div>

            {/* Actions */}
            <div className='flex flex-col sm:flex-row gap-6 sm:gap-8'>
              <Link
                href={`/magazines/${magazine.magazine_meta.issue}`}
                className='group inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] font-bold text-black hover:text-agro-orange transition-colors'
              >
                Lire en ligne
                <ArrowRight className='h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1' />
              </Link>

              {meta.pdf_url && (
                <a
                  href={meta.pdf_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] font-bold text-gray-500 hover:text-black transition-colors'
                >
                  <Download className='h-3.5 w-3.5' />
                  Télécharger (PDF)
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
