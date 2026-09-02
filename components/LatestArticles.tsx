import Link from 'next/link'
import Image from 'next/image'
import { getRecentPosts } from '@/lib/wordpressApi'
import { formatHtml, formatMediaDate } from '@/lib/utils'
import { Post } from '@/lib/wordpress'

export async function LatestArticles({
  excludeSlug,
}: {
  excludeSlug?: string
}) {
  const posts = await getRecentPosts()
  const filtered = posts.filter((p) => p.slug !== excludeSlug).slice(0, 5)

  if (filtered.length === 0) return null

  return (
    <section className='w-full bg-agro-background border-t border-agro-border py-14 md:py-20'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6'>
        <h2 className='font-lora text-xl md:text-2xl font-bold text-agro-text mb-8'>
          À lire aussi
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {filtered.map((post: Post) => {
            const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

            return (
              <Link
                key={post.id}
                href={`/article/${post.slug}`}
                className='group flex flex-col'
              >
                {image && (
                  <div className='relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-3'>
                    <Image
                      src={image}
                      alt={formatHtml(post.title.rendered)}
                      fill
                      sizes='(max-width: 768px) 100vw, 33vw'
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                )}

                <span className='font-arial text-xs text-agro-text-muted'>
                  {formatMediaDate(post.date)}
                </span>

                <h3
                  className='font-lora text-sm font-bold mt-1 text-agro-text leading-snug line-clamp-2 group-hover:text-agro-green-dark transition-colors'
                  dangerouslySetInnerHTML={{
                    __html: formatHtml(post.title.rendered),
                  }}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
