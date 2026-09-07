import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, BookOpen } from 'lucide-react'
import { getAgromagByNum, getAllAgromagSlug } from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'
import { FlipbookViewer } from '@/components/Flipbook'
import { LatestArticles } from '@/components/LatestArticles'

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
      <article className='w-full bg-white'>
        {/* En-tête */}
        <div className='w-full bg-agro-charcoal'>
          <div className='mx-auto max-w-5xl px-6 sm:px-8 pt-10 pb-16 md:pt-14 md:pb-24'>
            <Link
              href='/magazines'
              className='font-arial text-sm text-white/50 hover:text-white transition-colors'
            >
              ← Tous les magazines
            </Link>

            <div className='grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 md:gap-16 mt-10 items-start'>
              {/* Couverture */}
              <div className='relative aspect-[3/4] w-full max-w-[240px] mx-auto md:mx-0'>
                {cover ? (
                  <Image
                    src={cover}
                    alt={formatHtml(magazine.title.rendered)}
                    fill
                    sizes='240px'
                    className='object-cover'
                    priority
                  />
                ) : (
                  <div className='absolute inset-0 bg-white/5' />
                )}
              </div>

              {/* Titre + numéro */}
              <div>
                {issue && (
                  <span className='font-lora text-6xl md:text-7xl font-bold text-agro-green leading-none'>
                    {issue}
                  </span>
                )}

                <h1
                  className='font-lora text-2xl md:text-4xl font-bold text-white leading-tight mt-4 max-w-2xl'
                  dangerouslySetInnerHTML={{
                    __html: formatHtml(magazine.magazine_meta?.titre_magazine),
                  }}
                />

                {magazine.magazine_meta.description && (
                  <p
                    className='font-arial text-base text-white/70 leading-relaxed mt-5'
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(magazine.magazine_meta.description),
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Corps : sommaire + téléchargement */}
        <div className='mx-auto max-w-5xl px-6 sm:px-8 py-14 md:py-20'>
          <div className='grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 md:gap-16 items-start'>
            <div className='hidden md:block' aria-hidden='true' />

            <div className='max-w-2xl'>
              {magazine.magazine_meta.sommaire_html && (
                <div>
                  <p className='font-georgia text-lg text-agro-text mb-4'>
                    Au sommaire de cette édition
                  </p>
                  <div className='h-px bg-agro-text/10 mb-6' />
                  <div
                    className='font-georgia text-agro-text text-base leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-3 [&_li]:pl-1'
                    dangerouslySetInnerHTML={{
                      __html: magazine.magazine_meta.sommaire_html,
                    }}
                  />
                </div>
              )}

              {magazine.magazine_meta.pdf_url && (
                <a
                  href={magazine.magazine_meta?.pdf_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 mt-10 font-arial text-sm font-bold text-agro-green hover:text-agro-green-dark transition-colors border-b border-agro-green/40 hover:border-agro-green-dark pb-0.5'
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
          <div className='w-full border-t border-agro-text/10'>
            <div className='mx-auto max-w-5xl px-6 sm:px-8 py-14 md:py-20'>
              <p className='font-lora text-xl md:text-2xl font-bold text-agro-text mb-6'>
                Feuilleter le magazine
              </p>
              <FlipbookViewer url={flipUrl} />
            </div>
          </div>
        )}
      </article>
    </>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllAgromagSlug()
  return slugs.map(({ slug }) => ({ slug }))
}
