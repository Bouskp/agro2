import NewsletterForm from '@/components/Newsletterform' // ⚠️ adapte le chemin réel

export default function NewsletterSection() {
  return (
    <section className='w-full bg-agro-charcoal py-16 md:py-20 border-b border-white'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-2 gap-10 md:gap-16 items-center'>
          <div>
            <span className='font-arial text-xs font-bold uppercase tracking-wider text-agro-green'>
              Newsletter
            </span>
            <h2 className='font-lora text-3xl sm:text-4xl font-bold text-white leading-tight mt-3'>
              Restez informé de l&apos;actualité agricole africaine
            </h2>
            <p className='font-arial text-base text-white/70 leading-relaxed mt-4 max-w-md'>
              Recevez nos dernières actualités, dossiers et invitations à nos
              événements, directement dans votre boîte mail.
            </p>
          </div>

          <div className='bg-white rounded-xl p-6 sm:p-8'>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  )
}
