export default async function EventsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  console.log('searchParams:', params)

  return <h1>Hello from Events Archive Page</h1>
}
