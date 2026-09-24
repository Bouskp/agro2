import { notFound } from 'next/navigation'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpressApi'
import {
  categories as siteCategories,
  formatHtml,
  formatMediaDate,
  cleanWordPressExcerpt,
} from '@/lib/utils'
import { Metadata } from 'next'
import { Post } from '@/lib/wordpress'
import LatestArticles from '@/components/LatestArticles'
import { Link2 } from 'lucide-react'
import {
  FaFacebook as Facebook,
  FaLinkedin as Linkedin,
  FaTwitter as Twitter,
} from 'react-icons/fa6'
import publicite from '@/app/images/pub.png'

const readingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Coupe le HTML de l'article en deux moitiés, au niveau d'un paragraphe,
// pour pouvoir insérer un encart pub au milieu sur mobile.
function splitContentInHalf(html: string): [string, string] {
  const paragraphs = html.split(/(<\/p>)/i)

  // paragraphs alterne texte + "</p>" — on reconstruit une liste de blocs complets
  const blocks: string[] = []
  for (let i = 0; i < paragraphs.length; i += 2) {
    const block = paragraphs[i] + (paragraphs[i + 1] ?? '')
    if (block.trim()) blocks.push(block)
  }

  if (blocks.length < 2) {
    // Pas assez de paragraphes détectés pour couper proprement
    return [html, '']
  }

  const mid = Math.ceil(blocks.length / 2)
  return [blocks.slice(0, mid).join(''), blocks.slice(mid).join('')]
}

function NewsArticleSchema({ post }: { post: Post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    image: [post._embedded?.['wp:featuredmedia']?.[0].source_url],
    datePublished: post.date,
    dateModified: post.modified,
    author: [
      {
        '@type': 'Person',
        name: 'La Rédaction',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Agromakers-africa',
      logo: {
        '@type': 'ImageObject',
        url: 'https://agromakers.africa/logo.png',
      },
    },
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://agromakers.africa/article/${post.slug}`,
    },
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function AdSlot({
  label,
  size,
  className = '',
  imageUrl,
  href,
  alt,
}: {
  label: string
  size: string
  className?: string
  imageUrl?: string | StaticImageData
  href?: string
  alt?: string
}) {
  const content = imageUrl ? (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={imageUrl}
        alt={alt || label}
        fill
        className='object-cover'
        sizes='(min-width: 1024px) 200px, 320px'
      />
      <span className='absolute top-2 right-2 font-arial text-[9px] font-bold uppercase tracking-widest text-white/90 bg-black/40 px-1.5 py-0.5 rounded select-none'>
        Publicité
      </span>
    </div>
  ) : (
    <div
      className={`bg-agro-bg border border-dashed border-agro-border rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden ${className}`}
    >
      <span className='absolute top-2 right-2 font-arial text-[9px] font-bold uppercase tracking-widest text-agro-text-muted select-none'>
        Publicité
      </span>
      <div className='font-arial text-xs text-agro-text-muted space-y-1'>
        <p className='font-bold'>{label}</p>
        <p className='text-[10px] opacity-70'>{size}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        target='_blank'
        rel='noopener sponsored'
        className='block'
      >
        {content}
      </Link>
    )
  }

  return content
}

function ShareButtons() {
  return (
    <div className='flex items-center gap-2'>
      <button
        aria-label='Partager sur Facebook'
        className='w-8 h-8 rounded-full border border-agro-border flex items-center justify-center text-agro-text-secondary hover:border-agro-green hover:text-agro-green transition-colors shrink-0'
      >
        <Facebook className='h-3.5 w-3.5' />
      </button>
      <button
        aria-label='Partager sur LinkedIn'
        className='w-8 h-8 rounded-full border border-agro-border flex items-center justify-center text-agro-text-secondary hover:border-agro-green hover:text-agro-green transition-colors shrink-0'
      >
        <Linkedin className='h-3.5 w-3.5' />
      </button>
      <button
        aria-label='Copier le lien'
        className='w-8 h-8 rounded-full border border-agro-border flex items-center justify-center text-agro-text-secondary hover:border-agro-green hover:text-agro-green transition-colors shrink-0'
      >
        <Link2 className='h-3.5 w-3.5' />
      </button>
    </div>
  )
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
  const category = siteCategories.find((item) => item.id == post.categories[0])

  const authorName = post.content?.rendered?.includes('Thom Biakpa')
    ? 'Thomas Biakpa'
    : 'La Rédaction'

  const isModified =
    new Date(post.modified).getTime() - new Date(post.date).getTime() >
    1000 * 60 * 60 * 12
  const timeToRead = readingTime(post.content.rendered)

  const cleanedContent = formatHtml(
    post.content.rendered.replaceAll('Thom Biakpa', ''),
  )
  const [contentFirstHalf, contentSecondHalf] =
    splitContentInHalf(cleanedContent)

  const proseClassName =
    'prose prose-sm sm:prose-base lg:prose-lg prose-neutral max-w-none font-arial leading-[1.7] text-black prose-headings:font-lora prose-headings:my-4 prose-headings:font-bold prose-headings:uppercase prose-a:text-agro-green hover:prose-a:underline prose-img:rounded-md prose-blockquote:border-agro-green prose-blockquote:font-lora prose-blockquote:not-italic prose-blockquote:text-lg sm:prose-blockquote:text-xl [&_p]:my-6'

  return (
    <>
      <NewsArticleSchema post={post} />
      <article className='w-full bg-white'>
        <div className='max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12'>
          <div className='grid grid-cols-1 lg:grid-cols-[160px_1fr_160px] xl:grid-cols-[200px_1fr_200px] gap-6 lg:gap-8'>
            {/* Encart pub gauche — visible uniquement à partir de lg */}
            <aside className='hidden lg:block'>
              <div className='sticky top-24'>
                <AdSlot
                  label='Format Gratte-ciel'
                  size='160 x 600px'
                  className='w-full h-[600px]'
                  imageUrl={publicite}
                  alt='publicité'
                />
              </div>
            </aside>

            {/* Colonne centrale : article */}
            <div className='min-w-0'>
              {/* Fil d'ariane / catégorie */}
              <div className='flex items-center gap-3 font-arial text-xs'>
                {category && (
                  <Link
                    href={`/category/${category.slug.toLocaleLowerCase()}`}
                    className='font-bold uppercase tracking-wide text-agro-green'
                  >
                    {formatHtml(category.name)}
                  </Link>
                )}
              </div>

              {/* Titre */}
              <h1
                className='font-lora text-xl sm:text-2xl md:text-4xl md:leading-[1.30] font-bold text-agro-text mt-3'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(post.title.rendered),
                }}
              />
              {/* Auteur / date / partage */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5 sm:mt-6 py-4 border-y border-agro-border'>
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-9 h-9 rounded-full bg-agro-green/10 flex items-center justify-center shrink-0'>
                    <span className='font-lora text-sm font-bold text-agro-green'>
                      {authorName.charAt(0)}
                    </span>
                  </div>
                  <div className='font-arial text-sm leading-tight min-w-0'>
                    <p className='font-bold text-agro-text truncate'>
                      {authorName}
                    </p>
                    <p className='text-agro-text-muted text-xs'>
                      {isModified ? 'Mis à jour le ' : 'Publié le '}
                      {formatMediaDate(isModified ? post.modified : post.date)}
                      {' · '}
                      {timeToRead} min de lecture
                    </p>
                  </div>
                </div>

                <ShareButtons />
              </div>

              {/* Image de couverture */}
              {featuredImage && (
                <div className='mt-5 sm:mt-6'>
                  <div className='relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-md overflow-hidden'>
                    <Image
                      src={featuredImage}
                      alt={formatHtml(post.title.rendered)}
                      fill
                      priority
                      sizes='(min-width: 1024px) 896px, 100vw'
                      className='object-cover'
                      style={{
                        objectPosition:
                          post.focal_point.object_position ?? '50% 50%',
                      }}
                    />
                  </div>
                  {caption && (
                    <p
                      className='font-arial text-xs text-agro-text-muted italic mt-2'
                      dangerouslySetInnerHTML={{ __html: formatHtml(caption) }}
                    />
                  )}
                </div>
              )}

              {/* Chapô / extrait, si disponible */}
              {post.excerpt?.rendered && (
                <div
                  className='font-arial text-sm sm:text-base md:text-lg text-agro-text-secondary mt-3 sm:mt-4 [&_p]:m-0'
                  dangerouslySetInnerHTML={{
                    __html: cleanWordPressExcerpt(post.excerpt.rendered),
                  }}
                />
              )}

              {/* Contenu de l'article */}
              <div className='pb-12 sm:pb-16 pt-6 sm:pt-8'>
                {contentSecondHalf ? (
                  <>
                    {/* Première moitié */}
                    <div
                      className={proseClassName}
                      dangerouslySetInnerHTML={{ __html: contentFirstHalf }}
                    />

                    {/* Encart pub mobile/tablette, au milieu de l'article */}
                    <div className='lg:hidden my-8 flex justify-center'>
                      <AdSlot
                        label='Format Bannière'
                        size='320 x 100 px'
                        className='w-full max-w-[320px] h-[100px]'
                        imageUrl={publicite}
                      />
                    </div>

                    {/* Deuxième moitié */}
                    <div
                      className={proseClassName}
                      dangerouslySetInnerHTML={{ __html: contentSecondHalf }}
                    />
                  </>
                ) : (
                  // Repli si le contenu n'a pas pu être coupé (peu de paragraphes)
                  <div
                    className={proseClassName}
                    dangerouslySetInnerHTML={{ __html: contentFirstHalf }}
                  />
                )}

                {/* Tags / partage bas de page */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 sm:mt-10 pt-6 border-t border-agro-border'>
                  {category && (
                    <Link
                      href={`/category/${category.slug}`}
                      className='self-start font-arial text-xs font-bold uppercase tracking-wide text-agro-green-dark bg-agro-green/10 px-3 py-1.5 rounded-full'
                    >
                      {category.name}
                    </Link>
                  )}
                  <ShareButtons />
                </div>
              </div>
            </div>

            {/* Encart pub droite — visible uniquement à partir de lg */}
            <aside className='hidden lg:block'>
              <div className='sticky top-24 space-y-6'>
                <AdSlot
                  label='Format Gratte-ciel'
                  size='160 x 600 px'
                  className='w-full h-[600px]'
                  imageUrl={publicite}
                />
                <AdSlot
                  label='Format Pavé'
                  size='160 x 250 px'
                  className='w-full h-[250px]'
                  imageUrl={publicite}
                />
              </div>
            </aside>
          </div>
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Article introuvable' }
  }

  return {
    title: formatHtml(post.title.rendered) || `Article ${post.slug}`,
    description: formatHtml(post.excerpt.rendered) || '',
    openGraph: {
      title: formatHtml(post.title.rendered) || `Article ${post.slug}`,
      description: formatHtml(post.excerpt.rendered) || '',
      images: [
        {
          url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '',
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
      publishedTime: post.date_gmt,
      url: `https://agromakers.africa/article/${slug}`,
    },
    alternates: {
      canonical: `https://agromakers.africa/article/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered || `Article ${post.slug}`,
      images: [post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''],
    },
  }
}

export const dynamicParams = true

export const revalidate = 3600
