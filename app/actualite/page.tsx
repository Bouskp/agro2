import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPostsPaginated } from '@/lib/wordpressApi'
import { formatHtml, formatMediaDate } from '@/lib/utils'

const PER_PAGE = 20

export const revalidate = 3600 // 1 hour

export default async function ArticlesArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))

  const { data: posts, headers } = await getPostsPaginated(
    currentPage,
    PER_PAGE,
  )
  const { totalPages, total } = headers

  return (
    <section className='w-full bg-agro-background py-8 md:py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* En-tête */}
        <div className='mb-12'>
          <h1 className='font-lora text-2xl md:text-3xl font-bold tracking-tight text-agro-text uppercase'>
            Tous les articles
          </h1>
          <p className='font-arial text-sm text-agro-text-secondary mt-2'>
            {
              " Des articles fiables, pédagogiques et tournés vers les solutions pour accompagner les décideurs, les entrepreneurs, les investisseurs, les chercheurs et tous les acteurs engagés dans la transformation de l'agriculture africaine."
            }
          </p>
        </div>

        {/* Grille d'articles */}
        {posts.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-agro-border bg-agro-surface py-16 px-6'>
            <h3 className='font-lora text-lg font-bold text-agro-text'>
              Aucun article pour le moment
            </h3>
            <p className='font-arial text-sm text-agro-text-secondary mt-2 max-w-sm'>
              Revenez bientôt pour découvrir nos prochaines publications.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map((post) => {
              const featuredImage =
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url

              return (
                <article
                  key={post.id}
                  className='group rounded-xl border border-agro-border bg-agro-surface overflow-hidden hover:shadow-md transition-shadow'
                >
                  <Link href={`/article/${post.slug}`}>
                    {featuredImage && (
                      <div className='relative aspect-[16/9] w-full overflow-hidden'>
                        <Image
                          src={featuredImage}
                          alt={formatHtml(post.title.rendered)}
                          fill
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          className='object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                      </div>
                    )}

                    <div className='p-5'>
                      <span className='font-arial text-xs text-agro-text-muted'>
                        {formatMediaDate(post.date)}
                      </span>

                      <h2
                        className='font-lora text-lg font-bold mt-2 text-agro-text leading-snug group-hover:text-agro-orange transition-colors line-clamp-2'
                        dangerouslySetInnerHTML={{
                          __html: formatHtml(post.title.rendered),
                        }}
                      />

                      <p
                        className='font-arial text-sm text-agro-text-secondary mt-3 line-clamp-3'
                        dangerouslySetInnerHTML={{
                          __html: formatHtml(post.excerpt.rendered),
                        }}
                      />
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className='flex items-center justify-center gap-2 mt-12'
            aria-label='Pagination des articles'
          >
            <Link
              href={`/actualite?page=${Math.max(1, currentPage - 1)}`}
              aria-disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-agro-border transition-colors ${
                currentPage === 1
                  ? 'pointer-events-none opacity-40'
                  : 'hover:bg-agro-orange hover:text-white hover:border-agro-orange'
              }`}
            >
              <ChevronLeft className='h-4 w-4' />
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
              )
              .map((p, idx, arr) => (
                <span key={p} className='flex items-center gap-2'>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className='font-arial text-agro-text-muted'>…</span>
                  )}
                  <Link
                    href={`/actualite?page=${p}`}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-arial text-sm transition-colors ${
                      p === currentPage
                        ? 'bg-agro-orange text-white'
                        : 'border border-agro-border text-agro-text hover:bg-agro-orange/10'
                    }`}
                  >
                    {p}
                  </Link>
                </span>
              ))}

            <Link
              href={`/actualite?page=${Math.min(totalPages, currentPage + 1)}`}
              aria-disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-agro-border transition-colors ${
                currentPage === totalPages
                  ? 'pointer-events-none opacity-40'
                  : 'hover:bg-agro-orange hover:text-white hover:border-agro-orange'
              }`}
            >
              <ChevronRight className='h-4 w-4' />
            </Link>
          </nav>
        )}
      </div>
    </section>
  )
}
