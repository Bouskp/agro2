import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 1. Vérification du secret (header, pas query param)
    const secret = request.headers.get('x-revalidate-secret')

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Non autorisé : secret invalide ou manquant' },
        { status: 401 },
      )
    }

    // 2. Récupération du body envoyé par WordPress
    const body = await request.json()
    const { slug, post_type } = body as { slug?: string; post_type?: string }

    if (!slug) {
      return NextResponse.json(
        { message: 'Paramètre "slug" manquant' },
        { status: 400 },
      )
    }

    // 3. Revalidation ciblée (l'article précis)
    revalidateTag(`post-${slug}`, 'max')

    // 4. Revalidation de la liste (page d'accueil du blog, listing, etc.)
    revalidateTag('posts', 'max')

    // 5. Optionnel : revalider aussi le chemin exact si vous n'utilisez pas
    // les tags partout, ou en complément
    revalidatePath('/actualite')

    return NextResponse.json({
      revalidated: true,
      slug,
      post_type: post_type ?? 'post',
      now: Date.now(),
    })
  } catch (error) {
    console.error('Erreur de revalidation:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: String(error) },
      { status: 500 },
    )
  }
}

// Optionnel : bloquer les requêtes GET sur cette route
export async function GET() {
  return NextResponse.json(
    { message: 'Méthode non autorisée, utilisez POST' },
    { status: 405 },
  )
}
