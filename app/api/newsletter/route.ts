import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { firstName, lastName, phone, email } = body

  if (!firstName || !lastName || !phone || !email) {
    return NextResponse.json({ message: 'Champs manquants.' }, { status: 400 })
  }

  // ⚠️ adapte WORDPRESS_API_URL au nom réel de la variable d'environnement
  // utilisée ailleurs dans wordpressApi.ts (ex: NEXT_PUBLIC_WORDPRESS_URL)
  const res = await fetch(
    `${process.env.WORDPRESS_API_URL}/wp-json/agro/v1/newsletter`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, phone, email }),
    },
  )

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message || "Erreur lors de l'inscription." },
      { status: res.status },
    )
  }

  return NextResponse.json({ success: true })
}
