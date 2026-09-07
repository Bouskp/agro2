import { clsx, type ClassValue } from 'clsx'
import { decode } from 'html-entities'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const links = [
  {
    title: 'Accueil',
    path: '/',
  },

  {
    title: 'Actualité',
    path: '/actualite',
  },
  {
    title: 'Magazines',
    path: '/magazines',
  },
  {
    title: 'Événements',
    path: '/events',
  },
]

export function formatHtml(contenuBrut: string): string {
  if (!contenuBrut) return ''

  const premierDecodage = decode(contenuBrut)
  const htmlPur = decode(premierDecodage)

  return htmlPur
    .replace(/<br\s*\/?>/gi, '') // Supprime les sauts de ligne inutiles
    .replace(/<p>&nbsp;<\/p>/gi, '') // Supprime les paragraphes d'espaces vides
    .replace(/>\s+</g, '><') // Supprime les grands espaces blancs inter-balises
    .trim()
}

export function calculateReadingTime(htmlContent: string): number {
  if (!htmlContent) return 1
  // Supprime les balises HTML pour ne garder que le texte brut
  const text = htmlContent.replace(/<\/?[^>]+(>|$)/g, '')
  // Compte le nombre de mots
  const wordsCount = text.trim().split(/\s+/).length
  // Base moyenne de lecture : 200 mots par minute
  const minutes = Math.ceil(wordsCount / 200)
  return minutes > 0 ? minutes : 1
}

export function formatMediaDate(dateString: string): string {
  if (!dateString) return ''

  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short', // 'short' donne 'juil.' ou 'août', 'long' donne 'juillet'
    year: 'numeric',
  })
}

export function cleanWordPressExcerpt(excerpt: string): string {
  if (!excerpt) return ''

  return excerpt
    .replace(/<[^>]*>/g, '') // 1. Supprime toutes les balises HTML
    .replace(/\[\.\.\.\]/g, '') // 2. Supprime explicitement "[...]"
    .replace(/\[&hellip;\]/g, '') // 3. Supprime la variante encodée HTML "[&hellip;]"
    .trim() // 4. Nettoie les espaces vides restants au début et à la fin
}
