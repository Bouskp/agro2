import { Fragment } from 'react'
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination' // ⚠️ adapte le chemin si besoin

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  pageParam = 'page',
}: {
  currentPage: number
  totalPages: number
  /** Chemin de base, sans query string, ex: '/category/actualite' ou '/events' */
  basePath: string
  /** Nom du paramètre de requête pour la page, 'page' par défaut */
  pageParam?: string
}) {
  if (totalPages <= 1) return null

  const hrefFor = (p: number) => `${basePath}?${pageParam}=${p}`

  const pagesToShow = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)

  return (
    <ShadcnPagination className='mt-12'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hrefFor(Math.max(1, currentPage - 1))}
            className={
              currentPage === 1 ? 'pointer-events-none opacity-40' : undefined
            }
            aria-disabled={currentPage === 1}
            text='Précédent'
          />
        </PaginationItem>

        {pagesToShow.map((p, idx, arr) => (
          <Fragment key={p}>
            {idx > 0 && arr[idx - 1] !== p - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={hrefFor(p)} isActive={p === currentPage}>
                {p}
              </PaginationLink>
            </PaginationItem>
          </Fragment>
        ))}

        <PaginationItem>
          <PaginationNext
            href={hrefFor(Math.min(totalPages, currentPage + 1))}
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-40'
                : undefined
            }
            aria-disabled={currentPage === totalPages}
            text='Suivant'
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  )
}
