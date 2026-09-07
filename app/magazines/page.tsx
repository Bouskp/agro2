import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight } from 'lucide-react'
import { getAgromagsPaginated } from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'

const PER_PAGE = 10

export default async function MagazinesArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))

  const { data: magazines, headers } = await getAgromagsPaginated(
    currentPage,
    PER_PAGE,
  )
  const { totalPages } = headers

  // Le magazine vedette n'apparaît qu'en première page
  const featured = currentPage === 1 ? magazines[0] : null
  const rest = currentPage === 1 ? magazines.slice(1) : magazines

  return (
    <section className='w-full bg-agro-background py-8 md:py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* En-tête */}
        <div className='mb-12'>
          <h1 className='font-lora text-3xl md:text-4xl font-bold tracking-tight text-agro-text'>
            AgroMakers - Le Magazine
          </h1>
          <p className='font-arial text-lg text-agro-text-secondary mt-2'>
            {
              "Proposer chaque deux semaines une information fiable, pédagogique et tournée vers les solutions, afin d'accompagner les décideurs, les entrepreneurs, les investisseurs, les chercheurs et tous les acteurs engagés dans la transformation de l'agriculture africaine."
            }
          </p>
        </div>

        {magazines.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-agro-border bg-agro-surface py-16 px-6'>
            <div className='rounded-full bg-agro-green/10 p-4 mb-4'>
              <BookOpen className='h-8 w-8 text-agro-green' />
            </div>
            <h3 className='font-lora text-lg font-bold text-agro-text'>
              Aucun magazine pour le moment
            </h3>
            <p className='font-arial text-sm text-agro-text-secondary mt-2 max-w-sm'>
              Notre premier numéro est en préparation. Revenez bientôt !
            </p>
          </div>
        ) : (
          <>
            {/* Magazine vedette */}
            {featured && (
              <Link
                href={`/magazines/${featured.magazine_meta?.issue}`}
                className='group mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 rounded-2xl border border-agro-border bg-agro-surface p-4 md:p-8 shadow-sm hover:shadow-lg transition-shadow'
              >
                <div className='relative aspect-[3/4] md:aspect-[4/5] w-full max-w-sm mx-auto md:mx-0 overflow-hidden rounded-xl bg-agro-charcoal'>
                  {featured.magazine_meta?.poster_url ? (
                    <Image
                      src={featured.magazine_meta.poster_url}
                      alt={formatHtml(featured.title.rendered)}
                      fill
                      sizes='(max-width: 768px) 80vw, 40vw'
                      priority
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <BookOpen className='h-10 w-10 text-white/30' />
                    </div>
                  )}

                  {featured.magazine_meta?.issue && (
                    <span className='absolute top-3 left-3 bg-agro-orange text-white font-arial text-xs font-bold px-2.5 py-1 rounded-md'>
                      N° {featured.magazine_meta.issue}
                    </span>
                  )}
                </div>

                <div className='flex flex-col justify-center'>
                  <span className='font-arial text-xs font-bold uppercase tracking-wider text-agro-orange mb-3'>
                    Dernier numéro
                  </span>
                  <h2 className='font-lora text-2xl md:text-3xl font-bold text-agro-text mb-4'>
                    {formatHtml(featured.magazine_meta.titre_magazine)}
                  </h2>
                  {featured.magazine_meta.description && (
                    <div
                      className='font-arial text-agro-text-secondary text-sm md:text-base line-clamp-4 mb-6'
                      dangerouslySetInnerHTML={{
                        __html: featured.magazine_meta.description,
                      }}
                    />
                  )}
                  {featured.magazine_meta.sommaire_html && (
                    <div
                      className='font-arial text-agro-text-secondary [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2'
                      dangerouslySetInnerHTML={{
                        __html: featured.magazine_meta.sommaire_html,
                      }}
                    />
                  )}
                  <span className='inline-flex items-center gap-2 font-arial text-sm font-bold text-black group-hover:gap-3 transition-all mt-2'>
                    Lire le magazine
                    <ArrowRight className='h-4 w-4' />
                  </span>
                </div>
              </Link>
            )}

            {/* Grille des magazines précédents */}
            {rest.length > 0 && (
              <>
                {featured && (
                  <h3 className='font-lora text-xl font-bold text-agro-text mb-6'>
                    Numéros précédents
                  </h3>
                )}
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8'>
                  {rest.map((mag) => {
                    const cover = mag.magazine_meta?.poster_url
                    const issue = mag.magazine_meta?.issue

                    return (
                      <Link
                        key={mag.id}
                        href={`/magazines/${mag.magazine_meta?.issue}`}
                        className='group flex flex-col'
                      >
                        <div className='relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-agro-surface border border-agro-border shadow-sm group-hover:shadow-lg transition-shadow'>
                          {cover ? (
                            <Image
                              src={cover}
                              alt={formatHtml(mag.title.rendered)}
                              fill
                              sizes='(max-width: 768px) 50vw, 25vw'
                              className='object-cover group-hover:scale-105 transition-transform duration-300'
                            />
                          ) : (
                            <div className='absolute inset-0 flex items-center justify-center bg-agro-charcoal'>
                              <BookOpen className='h-8 w-8 text-white/30' />
                            </div>
                          )}

                          {issue && (
                            <span className='absolute top-2 left-2 bg-agro-orange text-white font-arial text-xs font-bold px-2 py-1 rounded-md'>
                              N° {issue}
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className='flex items-center justify-center gap-2 mt-12'
            aria-label='Pagination des magazines'
          >
            <Link
              href={`/magazines?page=${Math.max(1, currentPage - 1)}`}
              aria-disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-agro-border transition-colors ${
                currentPage === 1
                  ? 'pointer-events-none opacity-40'
                  : 'hover:bg-agro-green hover:text-white hover:border-agro-green'
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
                    href={`/magazines?page=${p}`}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-arial text-sm transition-colors ${
                      p === currentPage
                        ? 'bg-agro-green text-white'
                        : 'border border-agro-border text-agro-text hover:bg-agro-green/10'
                    }`}
                  >
                    {p}
                  </Link>
                </span>
              ))}

            <Link
              href={`/magazines?page=${Math.min(totalPages, currentPage + 1)}`}
              aria-disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-agro-border transition-colors ${
                currentPage === totalPages
                  ? 'pointer-events-none opacity-40'
                  : 'hover:bg-agro-green hover:text-white hover:border-agro-green'
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
