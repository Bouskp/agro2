import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cleanWordPressExcerpt, formatHtml } from '@/lib/utils'
import { getTagBySlug, getPostsByTagPaginated } from '@/lib/wordpressApi'
import Pagination from '@/components/Pagination'

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug: rawSlug } = await params
  const { page } = await searchParams

  const slug = decodeURIComponent(rawSlug)
  const parsedPage = parseInt(page || '1', 10)
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage)

  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const { data, headers } = await getPostsByTagPaginated(
    tag.id,
    currentPage,
    PER_PAGE,
  )
  const posts = data as WPPost[]
  const { totalPages } = headers

  return (
    <section className='mx-auto max-w-7xl px-4 py-12 sm:py-16'>
      <p className='font-arial text-xs font-bold uppercase tracking-wide text-agro-text-muted mb-2'>
        Tag
      </p>
      <h1 className='font-lora text-xl sm:text-2xl text-black mb-10 uppercase font-bold break-words hyphens-auto'>
        {formatHtml(tag.name)}
      </h1>

      {posts.length === 0 ? (
        <p className='text-stone-600'>
          Aucun article avec ce tag pour le moment.
        </p>
      ) : (
        <div className='grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((item) => {
            const media = item._embedded?.['wp:featuredmedia']?.[0]
            const imageUrl = media?.source_url
            const objectPosition =
              media?.focus_point?.object_position ?? '50% 50%'

            return (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className='group min-w-0'
              >
                {imageUrl && (
                  <div className='relative aspect-[16/10] w-full overflow-hidden rounded-md bg-stone-100 mb-4'>
                    <Image
                      src={imageUrl}
                      alt=''
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                      style={{ objectPosition }}
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
        basePath={`/tag/${slug}`}
      />
    </section>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const tag = await getTagBySlug(slug)

  if (!tag) return { title: 'Tag introuvable' }

  const title = `#${formatHtml(tag.name)}`

  return {
    title,
    description: `Tous les articles avec le tag ${title}`,
    alternates: {
      canonical: `https://agromakers.africa/tag/${slug}`,
    },
  }
}

export const dynamicParams = true

export const revalidate = 3600
