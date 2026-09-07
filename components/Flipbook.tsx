export function FlipbookViewer({ url }: { url?: string }) {
  if (!url) return null

  return (
    <div className='w-full max-w-4xl mx-auto mt-8'>
      <div className='relative w-full aspect-[4/3]  rounded-lg overflow-hidden shadow-lg border border-agro-border bg-agro-surface'>
        <iframe
          src={url}
          className='absolute inset-0 w-full h-full'
          seamless
          scrolling='no'
          frameBorder={0}
          allowFullScreen
          title='Lecteur du magazine'
        />
      </div>
    </div>
  )
}
