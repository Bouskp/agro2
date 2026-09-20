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
  focal_point: {
    object_position: string
  }
}

function getImage(item: WPPost) {
  return item._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
}

function formatDateShort(dateString: string) {
  const d = new Date(dateString)
  return {
    day: d.toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }),
  }
}

export default async function ActualiteSection() {
  // ⚠️ adapte 'actualite' si le slug de la rubrique diffère chez toi
  const category = categories.find((c) => c.slug === 'actualite')
  if (!category) return notFound()

  const { data: posts } = await getPostsByCategoryPaginated(category.id, 1, 8)
  if (!posts?.length) return notFound()

  return (
    <section className='w-full bg-agro-background py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-10'>
          <h2 className='font-lora text-xl sm:text-2xl font-bold text-black uppercase'>
            Actualités
          </h2>
          <Link
            href='/category/actualite'
            className='font-arial text-base font-bold text-agro-green hover:underline whitespace-nowrap'
          >
            Tout voir →
          </Link>
        </div>

        {/* MOBILE — cartes empilées, image en pleine largeur */}
        <div className='sm:hidden flex flex-col divide-y divide-agro-border'>
          {(posts as WPPost[]).map((item) => {
            const img = getImage(item)
            const { day, month } = formatDateShort(item.date)
            return (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className='group block py-6 first:pt-0'
              >
                <div className='relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-agro-charcoal mb-3'>
                  {img ? (
                    <Image
                      src={img}
                      alt={formatHtml(item.title.rendered)}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                      style={{
                        objectPosition: item.focal_point.object_position,
                      }}
                    />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center text-white/40 font-lora text-2xl'>
                      {item.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
                    </div>
                  )}
                </div>

                <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange'>
                  {day} {month}
                </span>

                <h3
                  className='font-lora text-lg font-bold text-black uppercase leading-snug mt-1 line-clamp-3 group-hover:text-agro-green transition-colors'
                  dangerouslySetInnerHTML={{
                    __html: formatHtml(item.title.rendered),
                  }}
                />
                {item.excerpt?.rendered && (
                  <div
                    className='mt-2 font-arial text-sm text-agro-text-secondary line-clamp-2 [&_p]:m-0'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(item.excerpt.rendered),
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* DESKTOP — liste dense, date + miniature en ligne */}
        <ol className='hidden sm:flex sm:flex-col'>
          {(posts as WPPost[]).map((item) => {
            const { day, month } = formatDateShort(item.date)
            const img = getImage(item)
            return (
              <li
                key={item.id}
                className='border-t border-agro-border first:border-t-0'
              >
                <Link
                  href={`/article/${item.slug}`}
                  className='group flex gap-8 py-6'
                >
                  <div className='flex shrink-0 flex-col items-center w-12 pt-1'>
                    <span className='font-lora text-xl font-bold text-agro-orange leading-none'>
                      {day}
                    </span>
                    <span className='font-arial text-xs uppercase text-agro-orange mt-1'>
                      {month}
                    </span>
                  </div>

                  <div className='relative shrink-0 w-28 aspect-[4/3] overflow-hidden rounded-lg bg-agro-charcoal'>
                    {img ? (
                      <Image
                        src={img}
                        alt={formatHtml(item.title.rendered)}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center text-white/40 font-lora text-lg'>
                        {item.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className='flex-1 min-w-0 border-l-2 border-transparent group-hover:border-agro-green pl-5 transition-colors'>
                    <h3
                      className='font-lora text-lg sm:text-xl font-bold text-black leading-snug line-clamp-3 group-hover:text-agro-green transition-colors'
                      dangerouslySetInnerHTML={{
                        __html: formatHtml(item.title.rendered),
                      }}
                    />
                    {item.excerpt?.rendered && (
                      <div
                        className='mt-2 font-arial text-base text-agro-text-secondary line-clamp-2 [&_p]:m-0'
                        dangerouslySetInnerHTML={{
                          __html: formatHtml(item.excerpt.rendered),
                        }}
                      />
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
