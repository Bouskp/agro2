'use client'

export default function AdBanner() {
  return (
    <div className='w-full flex justify-center items-center bg-stone-100 border-y border-stone-200 h-[250px] md:h-[300px] mt-4'>
      {/* Format PC — 1000 x 300 */}
      <div className='hidden md:flex items-center justify-center w-[1000px] max-w-full h-[300px]'>
        {/*
          Insérer ici le tag/script publicitaire desktop (1000x300).
          Ex. AdSense : <ins className="adsbygoogle" style={{ display: 'inline-block', width: 1000, height: 300 }} data-ad-client="..." data-ad-slot="..." />
        */}
        <span className='text-xs text-stone-400'>Publicité 1000 × 300</span>
      </div>

      {/* Format mobile — 300 x 250 */}
      <div className='flex md:hidden items-center justify-center w-[300px] max-w-full h-[250px]'>
        {/*
          Insérer ici le tag/script publicitaire mobile (300x250).
        */}
        <span className='text-xs text-stone-400'>Publicité 300 × 250</span>
      </div>
    </div>
  )
}
