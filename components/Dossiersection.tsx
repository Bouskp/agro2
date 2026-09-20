import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/lib/utils'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'
import { notFound } from 'next/navigation'

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
  }
}

function getImage(item: WPPost) {
  return item._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default async function DossierSection() {
  const category = categories.find((c) => c.slug === 'dossier')
  if (!category) return notFound()

  const { data: posts } = await getPostsByCategoryPaginated(category.id, 1, 7)
  if (!posts?.length) return notFound()

  const [featured, ...rest] = posts as WPPost[]
  const featuredImg = getImage(featured)

  return (
    <section className='w-full bg-agro-background py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-10'>
          <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase'>
            Dossiers
          </h2>
          <Link
            href='/category/dossier'
            className='font-arial text-sm font-bold text-agro-green hover:underline whitespace-nowrap'
          >
            Voir tous les dossiers →
          </Link>
        </div>

        {/* Dossier vedette, pleine largeur */}
        <Link
          href={`/article/${featured.slug}`}
          className='group relative block aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-xl bg-agro-charcoal mb-14'
        >
          {featuredImg && (
            <Image
              src={featuredImg}
              alt={formatHtml(featured.title.rendered)}
              fill
              className='object-cover opacity-80 transition-transform duration-500 group-hover:scale-105'
              priority
            />
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-agro-charcoal/90 via-agro-charcoal/20 to-transparent' />
          <div className='absolute inset-x-0 bottom-0 p-6 sm:p-10 max-w-3xl'>
            <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
              {formatDate(featured.date)}
            </span>
            <h3
              className='font-lora text-xl sm:text-2xl text-white uppercase leading-tight mt-3'
              dangerouslySetInnerHTML={{
                __html: formatHtml(featured.title.rendered),
              }}
            />
          </div>
        </Link>

        {/* Les autres dossiers, en colonnes de presse */}
        {rest.length > 0 && (
          <div className='grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-agro-border'>
            {rest.map((item) => {
              const img = getImage(item)
              return (
                <Link
                  key={item.id}
                  href={`/article/${item.slug}`}
                  className={cn(
                    'group pt-6 sm:pt-0 sm:px-4 pb-6',
                    'sm:[&:nth-child(2n)]:border-l sm:[&:nth-child(2n)]:border-agro-border',
                    'lg:[&:nth-child(3n+1)]:border-l-0',
                    'lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(3n+1))]:border-agro-border',
                  )}
                >
                  <div className='relative aspect-[16/10] overflow-hidden rounded-lg bg-agro-charcoal mb-4'>
                    {img ? (
                      <Image
                        src={img}
                        alt={formatHtml(item.title.rendered)}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center text-white/40 font-lora text-xl'>
                        {item.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
                      </div>
                    )}
                  </div>

                  <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
                    {formatDate(item.date)}
                  </span>
                  <h3
                    className='font-lora text-lg font-bold text-agro-text leading-snug mt-2 mb-3 group-hover:text-agro-green transition-colors line-clamp-2'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(item.title.rendered),
                    }}
                  />
                  {item.excerpt?.rendered && (
                    <div
                      className='font-arial text-sm text-agro-text-secondary [&_p]:m-0 line-clamp-3'
                      dangerouslySetInnerHTML={{
                        __html: formatHtml(item.excerpt.rendered),
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
