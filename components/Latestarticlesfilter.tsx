'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export type ArticleItem = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  categoryId: number
  categorySlug: string
  categoryTitle: string
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
  }
}

type CategoryLite = { id: number; slug: string; name: string }

function getImage(item: ArticleItem) {
  return item._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function LatestArticlesFilter({
  articles,
  categories,
}: {
  articles: ArticleItem[]
  categories: CategoryLite[]
}) {
  const [active, setActive] = useState<number | 'all'>('all')

  const filtered =
    active === 'all'
      ? articles
      : articles.filter((item) => item.categoryId === active)

  return (
    <section className='mx-auto max-w-7xl px-4 py-12 sm:py-16'>
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10'>
        <h2 className='font-lora text-2xl sm:text-4xl text-black uppercase font-bold'>
          Derniers articles
        </h2>

        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setActive('all')}
            className={
              active === 'all'
                ? 'px-4 py-1.5 text-sm rounded-full bg-agro-green text-white transition-colors'
                : 'px-4 py-1.5 text-sm rounded-full border border-stone-300 text-agro-charcoal hover:border-agro-green transition-colors'
            }
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={
                active === cat.id
                  ? 'px-4 py-1.5 text-sm rounded-full bg-agro-green text-white transition-colors'
                  : 'px-4 py-1.5 text-sm rounded-full border border-stone-300 text-agro-charcoal hover:border-agro-green transition-colors'
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className='text-stone-500 text-sm'>
          Aucun article dans cette rubrique.
        </p>
      ) : (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
          {filtered.map((item) => {
            const img = getImage(item)
            return (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className='group block'
              >
                <div className='relative aspect-[16/10] overflow-hidden bg-agro-charcoal mb-4'>
                  {img ? (
                    <Image
                      src={img}
                      alt=''
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center text-black font-arial text-3xl'>
                      {item.title.rendered.replace(/<[^>]+>/g, '').charAt(0)}
                    </div>
                  )}
                  <span className='absolute top-3 left-3 bg-agro-charcoal/80 text-agro-white text-xs px-2.5 py-1'>
                    {item.categoryTitle}
                  </span>
                </div>
                <span className='text-xs text-stone-500'>
                  {formatDate(item.date)}
                </span>
                <h3
                  className='font-lora text-lg text-agro-charcoal leading-snug mt-1 group-hover:text-agro-green transition-colors'
                  dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                />
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
