import { formatHtml, formatMediaDate } from '@/lib/utils'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Rubrique {
  title: string
  slug: string
  id: number
}

export default async function CardsContainer({
  rubrique,
}: {
  rubrique: Rubrique
}) {
  const { data: posts } = await getPostsByCategoryPaginated(rubrique.id)
  const rubriqueUrl = `/category/${rubrique.slug}`

  return (
    <section className='my-16 border-t border-gray-100 pt-6 w-full'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between pb-3 mb-6 gap-4'>
          <Link href={rubriqueUrl} className='group flex items-center gap-2'>
            <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase'>
              {rubrique.title}
            </h2>
          </Link>

          {/* Lien direct "Voir tout" vers /rubrique/[slug] */}
          <Link
            href={rubriqueUrl}
            className='hidden md:inline-flex items-center align-center gap-2 font-arial text-sm font-bold text-agro-green hover:underline whitespace-nowrap'
          >
            <span>Voir tout</span>
            <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' />
          </Link>
        </div>
        <div className='relative w-full'>
          <div className='flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none overscroll-x-contain pb-4 -mx-4 px-4'>
            {posts.map((post) => {
              return (
                <div
                  key={post.id}
                  className='min-w-[300px] w-[290px] sm:min-w-[340px] sm:w-[340px] aspect-[3/4] relative rounded-2xl overflow-hidden border border-gray-200/50 bg-gray-950 shadow-md group shrink-0 snap-start'
                >
                  <Image
                    src={
                      post._embedded?.['wp:featuredmedia']?.[0].source_url ?? ''
                    }
                    alt={post.title.rendered}
                    fill
                    sizes='(max-w-768px) 100vw, 33vw'
                    className='object-cover opacity-70 group-hover:scale-105 transition-transform duration-500 ease-out'
                    style={{
                      objectPosition: post.focal_point.object_position
                        ? `${post.focal_point.object_position}`
                        : '50% 50%',
                    }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />
                  <div className='absolute inset-x-0 bottom-0 p-6 space-y-2 flex flex-col justify-end text-white'>
                    <span className='font-condensed text-xs font-black uppercase tracking-widest text-agro-orange'>
                      {formatMediaDate(post.date)}
                    </span>
                    <Link href={`/article/${post.slug}`} className='block'>
                      <h3 className='font-serif text-sm md:text-base font-bold leading-snug group-hover:underline decoration-agro-green underline-offset-2 decoration-2'>
                        {formatHtml(post.title.rendered)}
                      </h3>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
