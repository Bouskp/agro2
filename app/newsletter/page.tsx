import { Metadata } from 'next'
import NewsletterForm from '@/components/Newsletterform'

export default function NewsletterPage() {
  return (
    <section className='w-full bg-agro-background py-12 md:py-20'>
      <div className='mx-auto max-w-xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-10'>
          <h1 className='font-lora text-3xl md:text-4xl font-bold text-agro-text'>
            Restez informé
          </h1>
          <p className='font-arial text-base text-agro-text-secondary mt-3'>
            Recevez nos dernières actualités, dossiers et invitations à nos
            événements directement par email.
          </p>
        </div>

        <div className='rounded-xl border border-agro-border bg-agro-surface p-6 sm:p-8'>
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'AgroMakers - Newsletter',
  description:
    'Abonnez-vous à la newsletter Agromakers pour recevoir nos actualités, dossiers et événements.',
}
