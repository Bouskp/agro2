import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpressApi'
import { formatHtml, formatMediaDate } from '@/lib/utils'
import { LatestArticles } from '@/components/LatestArticles'

const readingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const caption = post._embedded?.['wp:featuredmedia']?.[0]?.caption?.rendered
  const authorName = post.content?.rendered?.includes('Thom Biakpa')
    ? 'Thomas Biakpa'
    : 'la Rédaction'

  const isModified =
    new Date(post.modified).getTime() - new Date(post.date).getTime() >
    1000 * 60 * 60 * 12
  const timeToRead = readingTime(post.content.rendered)

  return (
    <>
      <article className='w-full bg-agro-background'>
        {/* Image de couverture */}
        {featuredImage && (
          <div className='relative w-full aspect-[16/9] md:aspect-[21/9]'>
            <Image
              src={featuredImage}
              alt={formatHtml(post.title.rendered)}
              fill
              priority
              sizes='100vw'
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-agro-charcoal/70 via-transparent to-transparent' />
          </div>
        )}
        {/* Légende de l'image, si fournie par WordPress */}
        {caption && (
          <p
            className='font-arial text-xs text-agro-text-muted text-center italic mt-2 max-w-3xl mx-auto px-4'
            dangerouslySetInnerHTML={{ __html: formatHtml(caption) }}
          />
        )}

        <div className='max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16'>
          {/* Fil d'ariane simple */}
          <Link
            href='/actualite'
            className='font-arial text-sm text-agro-text-secondary hover:text-agro-green-dark transition-colors'
          >
            ← Tous les articles
          </Link>

          {/* Titre */}
          <h1
            className='font-lora text-xl md:text-4xl font-bold text-agro-text leading-tight mt-4'
            dangerouslySetInnerHTML={{
              __html: formatHtml(post.title.rendered),
            }}
          />

          {/* Métadonnées auteur / date */}
          <div className='flex items-center gap-3 mt-4 font-arial text-sm text-agro-text-muted flex-wrap'>
            <span>{authorName}</span>
            <span className='w-1 h-1 rounded-full bg-agro-text-muted' />
            <span>
              {isModified ? 'Mis à jour le ' : 'Publié le '}
              {formatMediaDate(isModified ? post.modified : post.date)}
            </span>
            <span className='w-1 h-1 rounded-full bg-agro-text-muted' />
            <span>{timeToRead} min de lecture</span>
          </div>

          {/* Contenu de l'article */}
          <div
            className='prose prose-neutral max-w-none mt-10 font-georgia text-lg text-agro-text prose-headings:font-lora prose-a:text-agro-green-dark prose-img:rounded-lg [&_p]:my-6'
            dangerouslySetInnerHTML={{
              __html: formatHtml(
                post.content.rendered.replaceAll('Thom Biakpa', ''),
              ),
            }}
          />
        </div>
      </article>
      <LatestArticles excludeSlug={post.slug} />
    </>
  )
}

// Génère toutes les pages articles en statique au build
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}
