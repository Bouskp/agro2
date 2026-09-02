import Link from 'next/link'
import { Home, Search, Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <section className='w-full min-h-[70vh] flex items-center justify-center bg-agro-background py-16 px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='flex justify-center mb-6'>
          <div className='rounded-full bg-agro-orange/10 p-5'>
            <Leaf className='h-10 w-10 text-agro-orange' />
          </div>
        </div>
        <span className='font-lora text-6xl font-bold text-agro-orange block mb-2'>
          404
        </span>

        <h1 className='font-lora text-2xl font-bold text-agro-orange mb-3'>
          Cette page n&apos;a pas poussé ici
        </h1>

        <p className='font-georgia text-sm sm:text-base text-agro-text-secondary leading-relaxed mb-8'>
          La page que vous cherchez a peut-être été déplacée, supprimée, ou
          n&apos;a jamais existé. Retournez à l&apos;accueil ou explorez nos
          derniers articles.
        </p>

        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Link
            href='/'
            className='inline-flex items-center justify-center gap-2 rounded-lg bg-agro-orange text-white font-arial text-sm font-bold px-6 py-3 transition-colors'
          >
            <Home className='h-4 w-4' />
            Retour à l&apos;accueil
          </Link>
          <Link
            href='/actualite'
            className='inline-flex items-center justify-center gap-2 rounded-lg border border-agro-border text-agro-text hover:bg-agro-surface font-arial text-sm font-bold px-6 py-3 transition-colors'
          >
            <Search className='h-4 w-4' />
            Voir les articles
          </Link>
        </div>
      </div>
    </section>
  )
}
