import { formatHtml, formatMediaDate } from '@/lib/utils'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
  }
  focal_point: {
    object_position: string
  }
}

interface Rubrique {
  title: string
  slug: string
  id: number
}

export default async function BentoContainer({
  rubrique,
}: {
  rubrique: Rubrique
}) {
  const { data: posts } = await getPostsByCategoryPaginated(rubrique.id)
  const rubriqueUrl = `/category/${rubrique.slug}`

  return (
    <section className='w-full bg-agro-background py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between border-b border-gray-100 pb-3 mb-6 gap-4'>
          <Link href={rubriqueUrl} className='group flex items-center gap-2'>
            <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase'>
              {formatHtml(rubrique.title)}
            </h2>
          </Link>

          {/* Lien direct "Voir tout" vers /rubrique/[slug] */}
          <Link
            href={formatHtml(rubriqueUrl)}
            className='hidden md:flex items-center align-center gap-2 font-arial text-sm font-bold text-agro-green hover:underline whitespace-nowrap'
          >
            <span>Voir tout</span>
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </Link>
        </div>

        {/* Grille Bento réactive : 1 colonne sur mobile, 4 colonnes sur ordinateur */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]'>
          {posts.slice(0, 5).map((post, idx) => {
            const isMain = idx === 0

            return (
              <div
                key={post.id}
                className={`
             relative 
             overflow-hidden 
             bg-gray-950 
             rounded-2xl 
             border 
             border-gray-200/10 
             group 
             shadow-xs
             
             ${isMain ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2 lg:col-span-1'}
           `}
              >
                {/* Image en arrière-plan avec opacité ajustée pour le texte */}
                {post._embedded?.['wp:featuredmedia']?.[0].source_url && (
                  <Image
                    src={post._embedded?.['wp:featuredmedia']?.[0].source_url}
                    alt={post.title.rendered}
                    fill
                    sizes={
                      isMain
                        ? '(max-w-768px) 100vw, 50vw'
                        : '(max-w-768px) 100vw, 25vw'
                    }
                    className='object-cover opacity-60 group-hover:scale-102 transition-transform duration-500 ease-out'
                    style={{
                      objectPosition: post.focal_point.object_position
                        ? `${post.focal_point.object_position}`
                        : '50% 50%',
                    }}
                  />
                )}

                {/* Dégradé noir pour protéger la lisibilité des textes blancs */}
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

                {/* Contenu textuel superposé calé en bas */}
                <div className='absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-white z-10'>
                  <span className='text-[10px] text-agro-orange uppercase tracking-widest block mb-1'>
                    {formatMediaDate(post.date)}
                  </span>

                  <Link href={`/article/${post.slug}`} className='block'>
                    <h3
                      className={`
                   font-lora 
                   font-bold 
                   hover:underline 
                   decoration-agro-green
                   underline-offset-2 
                   decoration-2 
                   leading-tight
                
                   ${isMain ? 'text-lg sm:text-xl md:text-2xl' : 'text-sm sm:text-base line-clamp-3'}
                 `}
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
