'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const MEILI_URL = process.env.NEXT_PUBLIC_MEILI_URL
const MEILI_KEY = process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY

// Marqueurs de surbrillance : on évite d'injecter du HTML venant de l'API
const PRE = '\uE000'
const POST = '\uE001'

type Hit = {
  id: string
  type: string
  title: string
  type_label?: string
  link: string
  image: string | null
  _formatted?: { title?: string; content?: string }
}

const TYPE_LABELS: Record<string, string> = { post: 'Article', page: 'Page' }

// ⚠️ À adapter aux routes de votre front
function hitHref(hit: Hit) {
  const slug = new URL(hit.link).pathname.split('/').filter(Boolean).pop() ?? ''
  const base: Record<string, string> = {
    post: '/article',
    agromag: '/magazines',
    event: '/events/type/',
  }
  return `${base[hit.type] ?? `/${hit.type}`}/${slug}`
}

// WordPress renvoie des entités HTML (&#8217;, &amp;…) : on les décode
function decode(s = '') {
  const el = document.createElement('textarea')
  el.innerHTML = s
  return el.value
}

function Highlight({ text = '' }: { text?: string }) {
  const parts = decode(text).split(new RegExp(`(${PRE}.*?${POST})`, 'g'))
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith(PRE) ? (
          <mark key={i} className='rounded-sm bg-agro-green/25 text-inherit'>
            {p.slice(1, -1)}
          </mark>
        ) : (
          p
        ),
      )}
    </>
  )
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Raccourci Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Recherche avec délai (debounce) et annulation de la requête précédente
  useEffect(() => {
    const q = query.trim()
    if (!q) return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(
          `${MEILI_URL}/indexes/agromakers_content/search`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${MEILI_KEY}`,
            },
            body: JSON.stringify({
              q,
              limit: 8,
              attributesToRetrieve: [
                'id',
                'type',
                'title',
                'link',
                'image',
                'content',
                'type_label',
              ],
              attributesToHighlight: ['title', 'content'],
              attributesToCrop: ['content'],
              cropLength: 20,
              highlightPreTag: PRE,
              highlightPostTag: POST,
            }),
          },
        )
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        setHits(data.hits)
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError(true)
          setHits([])
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const handleChange = (value: string) => {
    setQuery(value)
    if (!value.trim()) {
      setHits([])
      setError(false)
    }
  }

  const close = () => {
    setOpen(false)
    setHits([])
    setQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Rechercher'
          className='text-white hover:bg-white/10'
        >
          <Search className='h-5 w-5' />
        </Button>
      </DialogTrigger>

      <DialogContent className='top-[12%] translate-y-0 gap-0 p-0 sm:max-w-xl'>
        <DialogTitle className='sr-only'>Rechercher sur le site</DialogTitle>
        <DialogDescription className='sr-only'>
          Saisissez un mot pour chercher dans les articles et les pages.
        </DialogDescription>

        <div className='flex items-center gap-2 border-b px-4'>
          <Search className='h-4 w-4 shrink-0 opacity-50' />
          <input
            autoFocus
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder='Rechercher un article, une page…'
            className='h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground'
          />
          {loading && (
            <Loader2 className='h-4 w-4 shrink-0 animate-spin opacity-60' />
          )}
        </div>

        <div className='max-h-[60vh] overflow-y-auto'>
          {error && (
            <p className='p-6 text-center text-sm text-muted-foreground'>
              La recherche est momentanément indisponible.
            </p>
          )}

          {!error && query.trim() && !loading && hits.length === 0 && (
            <p className='p-6 text-center text-sm text-muted-foreground'>
              Aucun résultat pour « {query.trim()} ».
            </p>
          )}

          <ul>
            {hits.map((hit) => (
              <li key={hit.id}>
                <Link
                  href={hitHref(hit)}
                  onClick={close}
                  className='flex gap-3 px-4 py-3 transition-colors hover:bg-accent'
                >
                  {hit.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hit.image}
                      alt=''
                      className='h-14 w-14 shrink-0 rounded-md object-cover'
                    />
                  )}
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>
                      <Highlight text={hit._formatted?.title ?? hit.title} />
                    </p>
                    <p className='line-clamp-2 text-sm text-muted-foreground'>
                      <Highlight text={hit._formatted?.content} />
                    </p>
                    <span className='mt-1 inline-block text-xs uppercase tracking-wide text-agro-green'>
                      {hit.type_label ?? TYPE_LABELS[hit.type] ?? hit.type}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
