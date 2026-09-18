import Image from 'next/image'
import Link from 'next/link'
import { categories, cleanWordPressExcerpt, formatHtml } from '@/lib/utils'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi'
import { notFound } from 'next/navigation'

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string; alt_text?: string }[]
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
function ActualiteLayout({ posts, slug }: { posts: WPPost[]; slug: string }) {
  return (
    <section className='mx-auto max-w-5xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-3xl sm:text-4xl text-agro-charcoal mb-10'>
        Actualité
      </h1>

      <ol className='flex flex-col'>
        {posts.map((item) => {
          const { day, month } = formatDateShort(item.date)
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
                  <span className='font-lora text-xl text-agro-charcoal leading-none'>
                    {day}
                  </span>
                  <span className='text-xs text-stone-500 lowercase mt-1'>
                    {month}
                  </span>
                </div>

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
    </section>
  )
}

/* ---------------------------------------------------------- */
/* PORTRAIT / INTERVIEW — le visage et la parole en avant      */
/* ---------------------------------------------------------- */
function PortraitInterviewLayout({
  posts,
  slug,
}: {
  posts: WPPost[]
  slug: string
}) {
  const [featured, ...rest] = posts
  if (!featured) {
    return (
      <section className='mx-auto max-w-8xl px-4 py-16'>
        <h1 className='font-lora text-3xl text-agro-charcoal'>
          Portraits &amp; interviews
        </h1>
      </section>
    )
  }
  const featuredImg = getImage(featured)

  return (
    <section className='mx-auto max-w-8xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-3xl sm:text-4xl text-agro-charcoal mb-10'>
        Portraits &amp; interviews
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
    </section>
  )
}

/* ---------------------------------------------------------- */
/* DOSSIER — enquête de fond, un vedette + colonnes de presse  */
/* ---------------------------------------------------------- */
function DossierLayout({ posts, slug }: { posts: WPPost[]; slug: string }) {
  const [featured, ...rest] = posts
  if (!featured) {
    return (
      <section className='mx-auto max-w-6xl px-4 py-16'>
        <h1 className='font-lora text-3xl text-agro-charcoal'>
          Dossier & Analyse
        </h1>
      </section>
    )
  }
  const featuredImg = getImage(featured)

  return (
    <section className='mx-auto max-w-8xl px-4 py-12 sm:py-16'>
      <h1 className='font-lora text-3xl sm:text-4xl text-agro-charcoal mb-10'>
        Dossier & Analyse
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
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-agro-charcoal/90 via-agro-charcoal/20 to-transparent' />
        <div className='absolute inset-x-0 bottom-0 p-6 sm:p-10 max-w-3xl'>
          <h2
            className='font-lora text-2xl sm:text-4xl text-agro-white leading-tight'
            dangerouslySetInnerHTML={{
              __html: formatHtml(featured.title.rendered),
            }}
          />
          <span className='inline-block mt-4 text-sm text-agro-green'>
            {formatDate(featured.date)}
          </span>
        </div>
      </Link>

      {/* Les autres dossiers, en colonnes de presse */}
      <div className='grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-stone-200'>
        {rest.map((item) => (
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
            <span className='text-sm text-stone-500'>
              {formatDate(item.date)}
            </span>
            <h3
              className='font-lora text-xl text-agro-charcoal leading-snug mt-2 mb-3 group-hover:text-agro-green transition-colors line-clamp-2'
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
        ))}
      </div>
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
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const findCategory = categories.find(
    (item) => item.slug == slug.toLocaleLowerCase(),
  )

  if (!findCategory) {
    return notFound()
  }

  const { data: posts } = await getPostsByCategoryPaginated(
    findCategory.id,
    1,
    15,
  )

  switch (slug) {
    case 'actualite':
      return <ActualiteLayout posts={posts as WPPost[]} slug={slug} />
    case 'portrait-interview':
      return <PortraitInterviewLayout posts={posts as WPPost[]} slug={slug} />
    case 'dossier':
      return <DossierLayout posts={posts as WPPost[]} slug={slug} />
    default:
      return notFound()
  }
}
