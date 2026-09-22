import Link from 'next/link'
import { ChevronRight, FolderOpen } from 'lucide-react'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi' // adaptez le chemin / le nom de la fonction
import { DossierCarousel, type Dossier } from './Dossiercarousel' // adaptez le chemin

export async function DossiersSection() {
  const { data: posts } = await getPostsByCategoryPaginated(108)
  const dossiers: Dossier[] = posts.map((post) => {
    return {
      ...post,
      titre: post.title.rendered,
      image_url: post._embedded?.['wp:featuredmedia']?.[0].source_url,
      description: post.excerpt.rendered,
    }
  })

  if (!posts || posts.length === 0) {
    return (
      <section className='w-full bg-white py-10 md:py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60 py-12 px-6'>
            <div className='rounded-full bg-agro-orange/10 p-3 mb-4'>
              <FolderOpen className='h-6 w-6 text-agro-orange' />
            </div>
            <h3 className='font-lora text-lg font-bold text-agro-text'>
              Aucun dossier pour le moment
            </h3>
            <p className='font-arial text-sm text-agro-text-secondary mt-2 max-w-sm'>
              Nos prochains dossiers sont en préparation. Revenez bientôt !
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='w-full bg-white py-10 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* En-tête de section : titre + bouton "Tous les dossiers" */}
        <div className='flex items-center justify-between gap-4 pb-4 sm:pb-5 mb-6 sm:mb-8 border-gray-200'>
          <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase'>
            Dossiers
          </h2>

          <Link
            href='/category/dossier'
            title='Tous les dossiers'
            className='group inline-flex items-center text-agro-green gap-1.5 px-3 sm:px-4 py-2 font-arial text-xs sm:text-sm font-bold whitespace-nowrap'
          >
            <span className='hidden sm:inline'>Tous les dossiers</span>
            <span className='sm:hidden'>Tout voir</span>
            <ChevronRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5' />
          </Link>
        </div>

        {/* Slider de dossiers - horizontal à toutes les tailles d'écran */}
        <DossierCarousel dossiers={dossiers} />
      </div>
    </section>
  )
}
