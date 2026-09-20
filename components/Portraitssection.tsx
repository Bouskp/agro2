import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/lib/utils'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'

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

function PortraitCard({
  item,
  className = '',
}: {
  item: WPPost
  className?: string
}) {
  const img = getImage(item)
  return (
    <Link href={`/article/${item.slug}`} className={`group block ${className}`}>
      <div className='relative aspect-[4/5] overflow-hidden rounded-xl bg-agro-charcoal mb-3'>
        {img ? (
          <Image
            src={img}
            alt={formatHtml(item.title.rendered)}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            style={{
              objectPosition: item.focal_point.object_position ?? '50% 50%',
            }}
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center text-white/40 font-lora text-3xl'>
            {item.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
          </div>
        )}
      </div>
      <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
        {formatDate(item.date)}
      </span>
      <h3
        className='font-lora text-base font-bold text-black leading-snug mt-1 group-hover:text-agro-green transition-colors'
        dangerouslySetInnerHTML={{ __html: formatHtml(item.title.rendered) }}
      />
    </Link>
  )
}

export default async function PortraitsSection() {
  const category = categories.find((c) => c.slug === 'portrait-interview')
  if (!category) return null

  const { data: posts } = await getPostsByCategoryPaginated(category.id, 1, 7)
  if (!posts?.length) return null

  const allPosts = posts as WPPost[]
  const [featured, ...rest] = allPosts
  const featuredImg = getImage(featured)

  return (
    <section className='w-full bg-agro-background py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-end justify-between mb-10'>
          <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase'>
            Portraits
          </h2>
          <Link
            href='/category/portrait-interview'
            className='font-arial text-sm font-bold text-agro-green hover:underline whitespace-nowrap'
          >
            Voir tous les portraits →
          </Link>
        </div>

        {/* MOBILE — carrousel unique, tous les portraits traités de façon uniforme */}
        <div
          className='md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 pb-2 -mx-4 px-4
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        >
          {allPosts.map((item) => (
            <PortraitCard
              key={item.id}
              item={item}
              className='shrink-0 w-[44%] snap-start'
            />
          ))}
        </div>

        {/* DESKTOP — portrait vedette + grille */}
        <div className='hidden md:block'>
          <Link
            href={`/article/${featured.slug}`}
            className='group grid grid-cols-5 gap-10 items-center mb-16'
          >
            <div className='col-span-2 relative aspect-[4/5] overflow-hidden rounded-xl bg-agro-charcoal'>
              {featuredImg ? (
                <Image
                  src={featuredImg}
                  alt={formatHtml(featured.title.rendered)}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                  priority
                />
              ) : (
                <div className='absolute inset-0 flex items-center justify-center text-white/40 font-lora text-5xl'>
                  {featured.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
                </div>
              )}
            </div>

            <div className='col-span-3'>
              <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
                {formatDate(featured.date)}
              </span>
              <h3
                className='font-lora text-2xl font-bold text-agro-text  leading-tight mt-3 group-hover:text-agro-green transition-colors'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(featured.title.rendered),
                }}
              />
              {featured.excerpt?.rendered && (
                <div
                  className='mt-4 font-lora italic text-base text-agro-text-secondary [&_p]:m-0'
                  dangerouslySetInnerHTML={{
                    __html: formatHtml(featured.excerpt.rendered),
                  }}
                />
              )}
            </div>
          </Link>

          {rest.length > 0 && (
            <div className='grid grid-cols-3 gap-x-6 gap-y-10'>
              {rest.map((item) => (
                <PortraitCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
