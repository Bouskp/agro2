import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import {
  getAgromagByNum,
  getAllAgromagSlug,
  getAgromagsPaginated, // ⚠️ adapte au nom réel de ta fonction
} from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'
import { FlipbookViewer } from '@/components/Flipbook'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Metadata } from 'next'
import { Agromag } from '@/lib/wordpress'

function NewsMagSchema({ mag }: { mag: Agromag }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: mag.magazine_meta.titre_magazine,
    image: [mag.magazine_meta.poster_url],
    datePublished: mag.date,
    dateModified: mag.date,
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
    description: mag.magazine_meta.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://agromakers.africa/magazines/${mag.magazine_meta.issue}`,
    },
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ---------------------------------------------------------- */
/* GRILLE — derniers numéros, en bas de page                   */
/* ---------------------------------------------------------- */
async function LatestMagazines({ excludeSlug }: { excludeSlug: string }) {
  const { data: magazines } = await getAgromagsPaginated(1, 5)
  const latest = (magazines as Agromag[])
    .filter((m) => m.magazine_meta.issue !== excludeSlug)
    .slice(0, 4)

  if (latest.length === 0) return null

  return (
    <div className='w-full border-t border-agro-border'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-14 sm:py-20'>
        <p className='font-arial text-xs font-bold uppercase tracking-wider text-agro-text-secondary mb-8'>
          Derniers numéros
        </p>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8'>
          {latest.map((mag) => (
            <Link
              key={mag.id}
              href={`/magazines/${mag.magazine_meta.issue}`}
              className='group block'
            >
              <div className='relative aspect-[3/4] w-full bg-agro-border overflow-hidden'>
                {mag.magazine_meta.poster_url && (
                  <Image
                    src={mag.magazine_meta.poster_url}
                    alt={formatHtml(mag.title.rendered)}
                    fill
                    sizes='(min-width: 640px) 25vw, 50vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function MagazinePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const magazine = await getAgromagByNum(slug)

  if (!magazine) {
    notFound()
  }

  const cover = magazine.magazine_meta?.poster_url
  const issue = magazine.magazine_meta?.issue
  const flipUrl = magazine.acf?.lien_flipbook

  return (
    <>
      <NewsMagSchema mag={magazine} />
      <article className='w-full bg-white'>
        {/* En-tête — fond clair continu, plus de bandeau sombre */}
        <div className='mx-auto max-w-5xl px-4 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16'>
          <Link
            href='/magazines'
            className='font-arial text-sm text-agro-text-secondary hover:text-agro-green transition-colors'
          >
            ← Tous les magazines
          </Link>

          <div className='grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 sm:gap-12 md:gap-16 mt-8 sm:mt-10 items-start'>
            {/* Couverture */}
            <div className='relative aspect-[3/4] w-full max-w-[180px] sm:max-w-[220px] mx-auto md:mx-0'>
              {cover ? (
                <Image
                  src={cover}
                  alt={formatHtml(magazine.title.rendered)}
                  fill
                  sizes='220px'
                  className='object-cover'
                  priority
                />
              ) : (
                <div className='absolute inset-0 bg-agro-border' />
              )}
            </div>

            {/* Titre + numéro */}
            <div className='text-center md:text-left'>
              {issue && (
                <span className='font-arial text-xs font-bold uppercase tracking-wider text-agro-green'>
                  Numéro {issue}
                </span>
              )}

              <h1
                className='font-lora text-2xl sm:text-3xl md:text-4xl font-bold text-agro-text leading-tight mt-2 max-w-2xl'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(magazine.magazine_meta?.titre_magazine),
                }}
              />

              {magazine.magazine_meta.description && (
                <>
                  {/* ─── DESKTOP / TABLETTE : description toujours visible ─── */}
                  <p
                    className='hidden md:block font-arial text-base text-agro-text-secondary leading-relaxed mt-4 max-w-xl'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(magazine.magazine_meta.description),
                    }}
                  />

                  {/* ─── MOBILE : description en accordéon ─── */}
                  <div className='md:hidden mt-5 text-left'>
                    <Accordion
                      type='single'
                      collapsible
                      defaultValue='description'
                    >
                      <AccordionItem value='description'>
                        <AccordionTrigger className='font-arial text-xs font-bold uppercase tracking-wider text-agro-text-secondary'>
                          Description
                        </AccordionTrigger>
                        <AccordionContent>
                          <p
                            className='font-arial text-sm text-agro-text-secondary leading-relaxed'
                            dangerouslySetInnerHTML={{
                              __html: formatHtml(
                                magazine.magazine_meta.description,
                              ),
                            }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </>
              )}

              {magazine.magazine_meta.pdf_url && (
                <a
                  href={magazine.magazine_meta?.pdf_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 mt-6 font-arial text-sm font-bold text-agro-green hover:text-agro-green-dark transition-colors'
                >
                  Télécharger le PDF
                  <ArrowDown className='h-3.5 w-3.5' />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Lecteur FlipHTML5 */}
        {flipUrl && (
          <div className='w-full border-t border-agro-border'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-10 sm:py-14'>
              <p className='font-arial text-xs font-bold uppercase tracking-wider text-agro-text-secondary mb-6'>
                Feuilleter le magazine
              </p>
              <FlipbookViewer url={flipUrl} />
            </div>
          </div>
        )}

        {/* Derniers numéros */}
        <LatestMagazines excludeSlug={issue} />
      </article>
    </>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllAgromagSlug()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const magazine = await getAgromagByNum(params.slug)

  if (!magazine) {
    return { title: 'Magazine introuvable' }
  }

  return {
    title:
      magazine.magazine_meta.titre_magazine ||
      `Magazine ${magazine.magazine_meta.issue}`,
    description: magazine.magazine_meta.description || '',
    openGraph: {
      title:
        magazine.magazine_meta.titre_magazine ||
        `Magazine ${magazine.magazine_meta.issue}`,
      description: magazine.magazine_meta.description || '',
      images: [
        {
          url: magazine.magazine_meta.poster_url ?? '',
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
      publishedTime: magazine.date,
      url: `https://agromakers.africa/magazines/${params.slug}`,
    },
    alternates: {
      canonical: `https://agromakers.africa/magazines/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title:
        magazine.magazine_meta.titre_magazine ||
        `Magazine ${magazine.magazine_meta.issue}`,
      images: [magazine.magazine_meta.poster_url ?? ''],
    },
  }
}
