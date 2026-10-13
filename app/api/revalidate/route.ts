import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

function isValidSecret(received: string | null): boolean {
  const expected = process.env.WORDPRESS_WEBHOOK_SECRET ?? ''
  if (!received || !expected) return false
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  try {
    // 1. Vérification du secret
    if (!isValidSecret(request.headers.get('x-revalidate-secret'))) {
      return NextResponse.json(
        { message: 'Non autorisé : secret invalide ou manquant' },
        { status: 401 },
      )
    }

    // 2. Lecture du body envoyé par WordPress
    const body = await request.json().catch(() => null)
    const { slug, post_type } = (body ?? {}) as {
      slug?: string
      post_type?: string
    }

    if (!slug) {
      return NextResponse.json(
        { message: 'Paramètre "slug" manquant' },
        { status: 400 },
      )
    }

    // 3. Revalidation par tags (doivent être présents dans tes fetch)
    revalidateTag(`post-${slug}`, 'max')
    revalidateTag('posts', 'max')

    // 4. Revalidation par chemins
    revalidatePath(`/article/${slug}`)
    revalidatePath('/category/actualite')
    revalidatePath('/')

    // 5. Chemins spécifiques aux autres types de contenu
    // (adapte selon tes routes réelles)
    // if (post_type === 'event') revalidatePath(`/evenements/${slug}`)
    if (post_type === 'event') {
      revalidatePath('/events')
      revalidatePath(`/events/${slug}`)
    }
    // if (post_type === 'agromag') revalidatePath(`/agromag/${slug}`)
    if (post_type === 'agromag') {
      revalidatePath('/magazines')
      revalidatePath(`/magazines/${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      slug,
      post_type: post_type ?? 'post',
      now: Date.now(),
    })
  } catch (error) {
    console.error('Erreur de revalidation:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

// Optionnel : bloquer les requêtes GET sur cette route
export async function GET() {
  return NextResponse.json(
    { message: 'Méthode non autorisée, utilisez POST' },
    { status: 405 },
  )
}
