'use client'

import Image from 'next/image'
import mobileImage from '../app/images/banner_agriculture_300x250.png'
import desktopImage from '../app/images/banner_agriculture_1000x300.png'

export default function AdBanner() {
  return (
    <div className='w-full flex justify-center items-center bg-stone-100 border-y border-stone-200 h-[250px] md:h-[300px] mt-4'>
      {/* Format PC — 1000 x 300 */}
      <div className='hidden md:flex items-center justify-center w-[1000px] max-w-full h-[300px] relative'>
        <Image
          src={desktopImage}
          alt='Publicité AgroMakers'
          fill
          className='object-cover'
          sizes='1000px'
          priority
        />
      </div>

      {/* Format mobile — 300 x 250 */}
      <div className='flex md:hidden items-center justify-center w-[300px] max-w-full h-[250px] relative'>
        <Image
          src={mobileImage}
          alt='Publicité AgroMakers'
          fill
          className='object-contain'
          sizes='300px'
        />
      </div>
    </div>
  )
}
