import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { getAgromagByNum, getAllAgromagSlug } from '@/lib/wordpressApi'
import { formatHtml } from '@/lib/utils'
import { FlipbookViewer } from '@/components/Flipbook'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
          <div className='mx-auto max-w-5xl px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-10 md:pt-14 md:pb-24'>
            <Link
              href='/magazines'
              className='font-arial text-sm text-white/50 hover:text-white transition-colors'
            >
              ← Tous les magazines
            </Link>

            <div className='grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 sm:gap-10 md:gap-16 mt-8 sm:mt-10 items-start'>
              {/* Couverture */}
              <div className='relative aspect-[3/4] w-full max-w-[160px] sm:max-w-[240px] mx-auto md:mx-0'>
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
              <div className='text-center md:text-left'>
                {issue && (
                  <span className='font-lora text-5xl sm:text-6xl md:text-7xl font-bold text-agro-green leading-none'>
                    {issue}
                  </span>
                )}

                <h1
                  className='font-lora text-xl sm:text-2xl md:text-4xl font-bold text-white leading-tight mt-3 sm:mt-4 max-w-2xl'
                  dangerouslySetInnerHTML={{
                    __html: formatHtml(magazine.magazine_meta?.titre_magazine),
                  }}
                />

                {magazine.magazine_meta.description && (
                  <>
                    {/* ─── DESKTOP / TABLETTE : description toujours visible ─── */}
                    <p
                      className='hidden md:block font-arial text-base text-white/70 leading-relaxed mt-5'
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
                        <AccordionItem
                          value='description'
                          className='border-white/15'
                        >
                          <AccordionTrigger className='font-arial text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white'>
                            Description
                          </AccordionTrigger>
                          <AccordionContent>
                            <p
                              className='font-arial text-sm text-white/70 leading-relaxed'
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
              </div>
            </div>
          </div>
        </div>

        {/* Corps : sommaire + téléchargement */}
        <div className='mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20'>
          <div className='grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 sm:gap-10 md:gap-16 items-start'>
            <div className='hidden md:block' aria-hidden='true' />

            <div className='max-w-2xl w-full'>
              {magazine.magazine_meta.sommaire_html && (
                <>
                  {/* ─── DESKTOP / TABLETTE : sommaire toujours visible ─── */}
                  <div className='hidden md:block'>
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

                  {/* ─── MOBILE : sommaire en accordéon ─── */}
                  <div className='md:hidden'>
                    <Accordion
                      type='single'
                      collapsible
                      defaultValue='sommaire'
                    >
                      <AccordionItem value='sommaire'>
                        <AccordionTrigger className='font-georgia text-base font-bold text-black uppercase'>
                          sommaire
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className='font-georgia text-agro-text text-sm leading-relaxed [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-3 [&_li]:pl-1'
                            dangerouslySetInnerHTML={{
                              __html: magazine.magazine_meta.sommaire_html,
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
                  className='inline-flex items-center gap-2 mt-8 sm:mt-10 font-arial text-sm font-bold text-agro-green hover:text-agro-green-dark transition-colors border-b border-agro-green/40 hover:border-agro-green-dark pb-0.5'
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
            <div className='mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20'>
              <p className='font-lora text-lg sm:text-xl md:text-2xl font-bold text-agro-text mb-5 sm:mb-6'>
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
