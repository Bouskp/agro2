import { categories } from '@/lib/utils'
import { getPostsByCategoryPaginated } from '@/lib/wordpressApi'
import LatestArticlesFilter, { type ArticleItem } from './Latestarticlesfilter'

export default async function LatestArticles({
  excludeSlug,
}: {
  excludeSlug?: string
}) {
  const results = await Promise.all(
    categories.map(async (cat) => {
      const { data } = await getPostsByCategoryPaginated(cat.id, 1, 6)
      return data.map((item) => ({
        ...item,
        categoryId: cat.id,
        categorySlug: cat.slug,
        categoryTitle: cat.name,
      }))
    }),
  )

  const merged: ArticleItem[] = results
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((p) => p.slug != excludeSlug)
    .slice(0, 9)

  return (
    <section className='w-full py-12 md:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <LatestArticlesFilter articles={merged} categories={categories} />
      </div>
    </section>
  )
}
