export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  console.log('event slug:', slug)

  return <h1>Hello from Event Page: {slug}</h1>
}
