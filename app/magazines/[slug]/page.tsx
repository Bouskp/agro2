import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Calendar } from 'lucide-react'
import { getAgromagByNum, getAllAgromagSlug } from '@/lib/wordpressApi'
import { formatHtml, formatMediaDate } from '@/lib/utils'
import { FlipbookViewer } from '@/components/Flipbook'

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
    <article className='w-full bg-agro-background'>
      {/* Lecteur FlipHTML5 */}
      {flipUrl && (
        <div className='mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-20'>
          <h2 className='font-lora text-xl md:text-2xl font-bold text-agro-text mb-6 text-center'>
            Feuilleter le magazine
          </h2>
          <FlipbookViewer url={flipUrl} />
        </div>
      )}
      {/* En-tête : couverture + infos côte à côte */}
      <div className='w-full bg-agro-charcoal'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20'>
          <Link
            href='/magazines'
            className='font-arial text-sm text-white/60 hover:text-white transition-colors'
          >
            ← Tous les magazines
          </Link>

          <div className='grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 mt-6 items-start'>
            {/* Couverture */}
            <div className='relative aspect-[3/4] w-full max-w-[280px] mx-auto md:mx-0 rounded-lg overflow-hidden shadow-2xl border border-white/10'>
              {cover ? (
                <Image
                  src={cover}
                  alt={formatHtml(magazine.title.rendered)}
                  fill
                  sizes='280px'
                  className='object-cover'
                  priority
                />
              ) : (
                <div className='absolute inset-0 bg-black/30' />
              )}
            </div>

            {/* Infos */}
            <div className='flex flex-col justify-center'>
              {issue && (
                <span className='font-arial text-xs font-bold uppercase tracking-wide text-agro-orange bg-agro-orange/10 px-2.5 py-1 rounded-full w-fit'>
                  Numéro {issue}
                </span>
              )}

              <h1
                className='font-lora text-2xl md:text-4xl font-bold text-white leading-tight mt-4'
                dangerouslySetInnerHTML={{
                  __html: formatHtml(magazine.magazine_meta?.titre_magazine),
                }}
              />
              {magazine.magazine_meta.description && (
                <p
                  className='font-georgia text-sm md:text-base text-white leading-relaxed mt-4 max-w-xl'
                  dangerouslySetInnerHTML={{
                    __html: formatHtml(magazine.magazine_meta.description),
                  }}
                />
              )}

              {magazine.magazine_meta.sommaire_html && (
                <div className='mb-8 py-4'>
                  <p className='text-sm font-georgia font-bold uppercase tracking-[0.14em] text-white mb-3'>
                    Au sommaire de cette édition
                  </p>
                  <div
                    className='font-serif font-light text-white text-base leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2 transition-colors'
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
                  className='inline-flex items-center gap-2 mt-8 w-fit rounded-lg bg-agro-green hover:bg-agro-green-dark text-white font-arial text-sm font-bold px-6 py-3 transition-colors'
                >
                  <Download className='h-4 w-4' />
                  Télécharger le PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllAgromagSlug()
  return slugs.map(({ slug }) => ({ slug }))
}
