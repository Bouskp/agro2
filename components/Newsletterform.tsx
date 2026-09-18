'use client'

import { useState, FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('') // anti-spam, doit rester vide
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  function isValidPhone(value: string) {
    return /^[+]?[\d\s().-]{8,20}$/.test(value)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage('')

    if (honeypot) return // bot détecté, on ignore silencieusement

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Merci de renseigner votre nom et prénom.')
      return
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Adresse email invalide.')
      return
    }
    if (!isValidPhone(phone)) {
      setErrorMessage('Numéro de téléphone invalide.')
      return
    }
    if (!consent) {
      setErrorMessage("Merci d'accepter de recevoir la newsletter.")
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone, email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Une erreur est survenue.')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Une erreur est survenue.',
      )
    }
  }

  if (status === 'success') {
    return (
      <div className='flex flex-col items-center text-center py-6'>
        <div className='rounded-full bg-agro-green/10 p-4 mb-4'>
          <CheckCircle2 className='h-8 w-8 text-agro-green' />
        </div>
        <h3 className='font-lora text-xl font-bold text-agro-text'>
          Inscription confirmée !
        </h3>
        <p className='font-arial text-sm text-agro-text-secondary mt-2 max-w-sm'>
          Merci {firstName}, vous recevrez bientôt nos prochaines actualités,
          événements et dossiers directement par email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      {/* Honeypot — champ invisible pour les bots, ne jamais l'afficher aux humains */}
      <input
        type='text'
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        name='website'
        tabIndex={-1}
        autoComplete='off'
        className='absolute -left-[9999px] w-px h-px opacity-0'
        aria-hidden='true'
      />

      <div className='grid sm:grid-cols-2 gap-5'>
        <div>
          <label
            htmlFor='firstName'
            className='block font-arial text-sm font-bold text-agro-text mb-1.5'
          >
            Prénom
          </label>
          <input
            id='firstName'
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className='w-full rounded-lg border border-agro-border px-4 py-2.5 font-arial text-sm text-agro-text focus:outline-none focus:ring-2 focus:ring-agro-green/40 focus:border-agro-green'
            placeholder='Aïcha'
          />
        </div>

        <div>
          <label
            htmlFor='lastName'
            className='block font-arial text-sm font-bold text-agro-text mb-1.5'
          >
            Nom
          </label>
          <input
            id='lastName'
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className='w-full rounded-lg border border-agro-border px-4 py-2.5 font-arial text-sm text-agro-text focus:outline-none focus:ring-2 focus:ring-agro-green/40 focus:border-agro-green'
            placeholder='Koné'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='email'
          className='block font-arial text-sm font-bold text-agro-text mb-1.5'
        >
          Email
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full rounded-lg border border-agro-border px-4 py-2.5 font-arial text-sm text-agro-text focus:outline-none focus:ring-2 focus:ring-agro-green/40 focus:border-agro-green'
          placeholder='aicha.kone@email.com'
        />
      </div>

      <div>
        <label
          htmlFor='phone'
          className='block font-arial text-sm font-bold text-agro-text mb-1.5'
        >
          Téléphone
        </label>
        <input
          id='phone'
          type='tel'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className='w-full rounded-lg border border-agro-border px-4 py-2.5 font-arial text-sm text-agro-text focus:outline-none focus:ring-2 focus:ring-agro-green/40 focus:border-agro-green'
          placeholder='+225 07 00 00 00 00'
        />
      </div>

      <label className='flex items-start gap-2.5 font-arial text-xs text-agro-text-secondary'>
        <input
          type='checkbox'
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className='mt-0.5 h-4 w-4 rounded border-agro-border text-agro-green focus:ring-agro-green/40'
        />
        J&apos;accepte de recevoir la newsletter Agromakers par email et SMS. Je
        peux me désinscrire à tout moment.
      </label>

      {errorMessage && (
        <p className='font-arial text-sm text-red-600'>{errorMessage}</p>
      )}

      <button
        type='submit'
        disabled={status === 'loading'}
        className='inline-flex items-center justify-center gap-2 font-arial text-sm font-bold text-white bg-agro-green hover:bg-agro-green-dark transition-colors px-6 py-3 rounded-full disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {status === 'loading' ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            Envoi en cours...
          </>
        ) : (
          "S'abonner à la newsletter"
        )}
      </button>
    </form>
  )
}
