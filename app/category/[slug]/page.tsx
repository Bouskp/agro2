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
      <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold'>
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
                    className='text-lg sm:text-xl font-medium text-agro-charcoal leading-snug group-hover:text-agro-green transition-colors'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(item.title.rendered),
                    }}
                  />
                  {item.excerpt?.rendered && (
                    <div
                      className='mt-2 text-sm md:text-base text-stone-600 [&_p]:m-0 line-clamp-3'
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
  const [featured, ...rest] = posts
  if (!featured) {
    return (
      <section className='mx-auto max-w-8xl px-4 py-16'>
        <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold'>
          Portraits
        </h1>
      </section>
    )
  }
  const featuredImg = getImage(featured)

  return (
    <section className='mx-auto max-w-8xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold'>
        Portraits
      </h1>

      {/* Portrait vedette */}
      <Link
        href={`/article/${featured.slug}`}
        className='group grid sm:grid-cols-5 gap-6 sm:gap-10 items-center mb-16'
      >
        <div className='sm:col-span-2 relative aspect-[4/5] overflow-hidden bg-agro-charcoal'>
          {featuredImg ? (
            <Image
              src={featuredImg}
              alt=''
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
              priority
              style={{
                objectPosition:
                  featured._embedded?.['wp:featuredmedia']?.[0]?.focus_point
                    ?.object_position ?? '50% 50%',
              }}
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center text-agro-white/40 font-lora text-5xl'>
              {featured.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
            </div>
          )}
        </div>
        <div className='sm:col-span-3'>
          <h2
            className='font-lora text-2xl sm:text-3xl text-agro-charcoal leading-tight group-hover:text-agro-green transition-colors'
            dangerouslySetInnerHTML={{
              __html: formatHtml(featured.title.rendered),
            }}
          />
          {featured.excerpt?.rendered && (
            <div
              className='mt-4 text-base text-stone-600 max-w-[60ch] italic font-lora [&_p]:m-0'
              dangerouslySetInnerHTML={{
                __html: cleanWordPressExcerpt(featured.excerpt.rendered),
              }}
            />
          )}
          <span className='inline-block mt-5 text-sm text-agro-green'>
            {formatDate(featured.date)}
          </span>
        </div>
      </Link>

      {/* Grille des autres portraits */}
      <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10'>
        {rest.map((item) => {
          const img = getImage(item)
          return (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className='group block'
            >
              <div className='relative aspect-[4/5] overflow-hidden bg-agro-charcoal mb-3'>
                {img ? (
                  <Image
                    src={img}
                    alt=''
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                    style={{
                      objectPosition:
                        item._embedded?.['wp:featuredmedia']?.[0]?.focus_point
                          ?.object_position ?? '50% 50%',
                    }}
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center text-agro-white/40 font-lora text-3xl'>
                    {item.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
                  </div>
                )}
              </div>
              <h3
                className='text-base font-medium text-agro-charcoal leading-snug group-hover:text-agro-green transition-colors'
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
  const [featured, ...rest] = posts
  if (!featured) {
    return (
      <section className='mx-auto max-w-6xl px-4 py-16'>
        <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold'>
          Dossiers
        </h1>
      </section>
    )
  }
  const featuredImg = getImage(featured)

  return (
    <section className='mx-auto max-w-8xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold'>
        Dossiers
      </h1>

      {/* Dossier vedette, pleine largeur */}
      <Link
        href={`/article/${featured.slug}`}
        className='group relative block aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-agro-charcoal mb-14'
      >
        {featuredImg && (
          <Image
            src={featuredImg}
            alt=''
            fill
            className='object-cover opacity-80 transition-transform duration-500 group-hover:scale-105'
            priority
            style={{
              objectPosition:
                featured._embedded?.['wp:featuredmedia']?.[0]?.focus_point
                  ?.object_position ?? '50% 50%',
            }}
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-agro-charcoal/90 via-agro-charcoal/20 to-transparent' />
        <div className='absolute inset-x-0 bottom-0 p-6 sm:p-10 max-w-3xl'>
          <h2
            className='font-arial text-2xl sm:text-4xl text-agro-white leading-tight'
            dangerouslySetInnerHTML={{
              __html: formatHtml(featured.title.rendered),
            }}
          />
          <span className='inline-block mt-4 text-sm text-agro-orange'>
            {formatDate(featured.date)}
          </span>
        </div>
      </Link>

      {/* Les autres dossiers, en colonnes de presse */}
      <div className='grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-stone-200'>
        {rest.map((item) => {
          const itemImg = getImage(item)
          return (
            <Link
              key={item.id}
              href={`/article/${item.slug}`}
              className={cn(
                'group pt-6 sm:pt-0 sm:px-4',
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
                className='font-arial text-xl text-black mt-2 mb-3 group-hover:text-agro-green transition-colors line-clamp-2'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(item.title.rendered),
                }}
              />
              {item.excerpt?.rendered && (
                <div
                  className='text-sm text-stone-600 max-w-[45ch] [&_p]:m-0 line-clamp-3'
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
      return notFound()
  }
}

export async function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }))
}
