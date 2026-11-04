import Image from 'next/image'
import Link from 'next/link'
import { categories, cleanWordPressExcerpt, formatHtml } from '@/lib/utils'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi'
import { notFound } from 'next/navigation'
import Pagination from '@/components/Pagination' // ⚠️ adapte le chemin réel

const PER_PAGE = 15

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: [
      {
        source_url: string
        focus_point?: {
          object_position: string
        }
      },
    ]
  }
}

function getImage(item: WPPost) {
  return item._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateShort(dateString: string) {
  const d = new Date(dateString)
  return {
    day: d.toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }),
  }
}

/* ---------------------------------------------------------- */
/* ACTUALITÉ — flux chronologique dense, l'info avant l'image  */
/* ---------------------------------------------------------- */
function ActualiteLayout({
  posts,
  slug,
  currentPage,
  totalPages,
}: {
  posts: WPPost[]
  slug: string
  currentPage: number
  totalPages: number
}) {
  return (
    <section className='mx-auto max-w-7xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold break-words hyphens-auto'>
        Actualités
      </h1>

      <ol className='flex flex-col'>
        {posts.map((item) => {
          const { day, month } = formatDateShort(item.date)
          const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0]
          const imageUrl = featuredMedia?.source_url
          const objectPosition =
            item._embedded?.['wp:featuredmedia']?.[0]?.focus_point
              ?.object_position ?? '50% 50%'

          return (
            <li
              key={item.id}
              className='border-t border-stone-200 first:border-t-0'
            >
              <Link
                href={`/article/${item.slug}`}
                className='group flex gap-5 py-6 sm:gap-8'
              >
                <div className='flex shrink-0 flex-col items-center w-12 pt-1'>
                  <span className='font-lora text-xl text-agro-orange leading-none'>
                    {day}
                  </span>
                  <span className='text-xs text-agro-orange lowercase mt-1'>
                    {month}
                  </span>
                </div>

                {imageUrl && (
                  <div className='relative hidden sm:block shrink-0 w-32 h-24 md:w-40 md:h-28 overflow-hidden rounded-md bg-stone-100'>
                    <Image
                      src={imageUrl}
                      alt={formatHtml(item.title.rendered) || ''}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                      style={{ objectPosition }}
                      sizes='(min-width: 768px) 160px, 128px'
                    />
                  </div>
                )}

                <div className='flex-1 min-w-0 border-l-2 border-transparent group-hover:border-agro-green pl-5 transition-colors'>
                  <h2
                    className='text-lg sm:text-xl font-medium text-agro-charcoal leading-snug group-hover:text-agro-green transition-colors break-words hyphens-auto'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(item.title.rendered),
                    }}
                  />
                  {item.excerpt?.rendered && (
                    <div
                      className='mt-2 text-sm md:text-base text-stone-600 [&_p]:m-0 line-clamp-3 break-words hyphens-auto [&_a]:[overflow-wrap:anywhere]'
                      dangerouslySetInnerHTML={{
                        __html: cleanWordPressExcerpt(item.excerpt.rendered),
                      }}
                    />
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/category/${slug}`}
      />
    </section>
  )
}

/* ---------------------------------------------------------- */
/* PORTRAIT / INTERVIEW — le visage et la parole en avant      */
/* ---------------------------------------------------------- */
function PortraitInterviewLayout({
  posts,
  slug,
  currentPage,
  totalPages,
}: {
  posts: WPPost[]
  slug: string
  currentPage: number
  totalPages: number
}) {
  return (
    <section className='mx-auto max-w-8xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold break-words hyphens-auto'>
        Portraits
      </h1>

      {/* Grille des autres portraits */}
      <div className='grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-stone-200'>
        {posts.map((item) => {
          const itemImg = getImage(item)
          return (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className={cn(
                'group min-w-0 pt-6 sm:pt-0 sm:px-4',
                'sm:[&:nth-child(2n)]:border-l sm:[&:nth-child(2n)]:border-stone-200',
                'lg:[&:nth-child(3n+1)]:border-l-0',
                'lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(3n+1))]:border-stone-200',
              )}
            >
              {itemImg && (
                <div className='relative aspect-[16/10] w-full overflow-hidden bg-stone-100 mb-4'>
                  <Image
                    src={itemImg}
                    alt=''
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                    style={{
                      objectPosition:
                        item._embedded?.['wp:featuredmedia']?.[0]?.focus_point
                          ?.object_position ?? '50% 50%',
                    }}
                    sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                  />
                </div>
              )}
              <span className='text-sm text-agro-orange'>
                {formatDate(item.date)}
              </span>
              <h3
                className='font-arial text-xl text-black mt-2 mb-3 group-hover:text-agro-green transition-colors line-clamp-2 break-words hyphens-auto'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(item.title.rendered),
                }}
              />
            </Link>
          )
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/category/${slug}`}
      />
    </section>
  )
}

/* ---------------------------------------------------------- */
/* DOSSIER — enquête de fond, un vedette + colonnes de presse  */
/* ---------------------------------------------------------- */
function DossierLayout({
  posts,
  slug,
  currentPage,
  totalPages,
}: {
  posts: WPPost[]
  slug: string
  currentPage: number
  totalPages: number
}) {
  return (
    <section className='mx-auto max-w-8xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold break-words hyphens-auto'>
        Dossiers
      </h1>

      {/* Les autres dossiers, en colonnes de presse */}
      <div className='grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-stone-200'>
        {posts.map((item) => {
          const itemImg = getImage(item)
          return (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className={cn(
                'group min-w-0 pt-6 sm:pt-0 sm:px-4',
                'sm:[&:nth-child(2n)]:border-l sm:[&:nth-child(2n)]:border-stone-200',
                'lg:[&:nth-child(3n+1)]:border-l-0',
                'lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(3n+1))]:border-stone-200',
              )}
            >
              {itemImg && (
                <div className='relative aspect-[16/10] w-full overflow-hidden bg-stone-100 mb-4'>
                  <Image
                    src={itemImg}
                    alt=''
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                    style={{
                      objectPosition:
                        item._embedded?.['wp:featuredmedia']?.[0]?.focus_point
                          ?.object_position ?? '50% 50%',
                    }}
                    sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                  />
                </div>
              )}
              <span className='text-sm text-agro-orange'>
                {formatDate(item.date)}
              </span>
              <h3
                className='font-arial text-xl text-black mt-2 mb-3 group-hover:text-agro-green transition-colors line-clamp-2 break-words hyphens-auto'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(item.title.rendered),
                }}
              />
              {item.excerpt?.rendered && (
                <div
                  className='text-sm text-stone-600 max-w-[45ch] [&_p]:m-0 line-clamp-3 break-words hyphens-auto [&_a]:[overflow-wrap:anywhere]'
                  dangerouslySetInnerHTML={{
                    __html: cleanWordPressExcerpt(item.excerpt.rendered),
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/category/${slug}`}
      />
    </section>
  )
}

/* ---------------------------------------------------------- */
/* DEFAULT — mise en page générique pour toutes les autres     */
/* catégories : grille simple, image + date + titre + extrait  */
/* ---------------------------------------------------------- */
function DefaultLayout({
  title,
  posts,
  slug,
  currentPage,
  totalPages,
}: {
  title: string
  posts: WPPost[]
  slug: string
  currentPage: number
  totalPages: number
}) {
  return (
    <section className='mx-auto max-w-7xl px-4 py-12 sm:py-16'>
      <h1
        className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold break-words hyphens-auto'
        dangerouslySetInnerHTML={{ __html: formatHtml(title) }}
      />

      {posts.length === 0 ? (
        <p className='text-stone-600'>
          Aucun article dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className='grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((item) => {
            const itemImg = getImage(item)
            return (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className='group min-w-0'
              >
                {itemImg && (
                  <div className='relative aspect-[16/10] w-full overflow-hidden rounded-md bg-stone-100 mb-4'>
                    <Image
                      src={itemImg}
                      alt=''
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                      style={{
                        objectPosition:
                          item._embedded?.['wp:featuredmedia']?.[0]?.focus_point
                            ?.object_position ?? '50% 50%',
                      }}
                      sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                    />
                  </div>
                )}
                <span className='text-sm text-agro-orange'>
                  {formatDate(item.date)}
                </span>
                <h2
                  className='font-arial text-lg sm:text-xl text-black mt-2 mb-2 group-hover:text-agro-green transition-colors line-clamp-2 break-words hyphens-auto'
                  dangerouslySetInnerHTML={{
                    __html: formatHtml(item.title.rendered),
                  }}
                />
                {item.excerpt?.rendered && (
                  <div
                    className='text-sm text-stone-600 [&_p]:m-0 line-clamp-3 break-words hyphens-auto [&_a]:[overflow-wrap:anywhere]'
                    dangerouslySetInnerHTML={{
                      __html: cleanWordPressExcerpt(item.excerpt.rendered),
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/category/${slug}`}
      />
    </section>
  )
}

/* Petit utilitaire local pour combiner des classes conditionnelles */
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ---------------------------------------------------------- */
/* PAGE                                                        */
/* ---------------------------------------------------------- */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const findCategory = categories.find(
    (item) => item.slug == slug.toLocaleLowerCase(),
  )

  if (!findCategory) {
    return notFound()
  }

  const { data: posts, headers } = await getPostsByCategoryPaginated(
    findCategory.id,
    currentPage,
    PER_PAGE,
  )
  const { totalPages } = headers

  switch (slug) {
    case 'actualite':
      return (
        <ActualiteLayout
          posts={posts as WPPost[]}
          slug={slug}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )
    case 'portraits':
      return (
        <PortraitInterviewLayout
          posts={posts as WPPost[]}
          slug={slug}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )
    case 'dossier':
      return (
        <DossierLayout
          posts={posts as WPPost[]}
          slug={slug}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )
    default:
      return (
        <DefaultLayout
          title={findCategory.name}
          posts={posts as WPPost[]}
          slug={slug}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )
  }
}

export async function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }))
}
