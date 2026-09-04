'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn, links } from '@/lib/utils'
import logo from '../app/images/logo.png'

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 bg-agro-charcoal w-full'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between'>
        {/* LOGO À GAUCHE — ratio réel ~3.1:1 après recadrage */}
        <Link href='/' className='relative h-12 w-12 sm:h-16 sm:w-52 shrink-0'>
          <Image
            src={logo}
            alt='logo Agromakers'
            className='object-contain object-left'
            fill
            priority
          />
        </Link>

        {/* LIENS + CTA À DROITE (Desktop) */}
        <div className='hidden md:flex items-center gap-6'>
          <NavigationMenu>
            <NavigationMenuList className='gap-1'>
              {links.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'hover:bg-agro-green hover:text-agro-white',
                    )}
                  >
                    <Link
                      href={item.path}
                      className='text-xl font-lora text-white font-medium'
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* NAVIGATION MOBILE */}
        <div className='flex md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                aria-label='Ouvrir le menu'
                className='text-white hover:bg-white/10'
              >
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-[300px] flex flex-col justify-between'
            >
              <div>
                <SheetTitle className='text-left font-georgia text-xl font-bold mb-6 mt-2 border-b pb-2 pt-2'>
                  <Link href='/' className='text-agro-green'>
                    AgroMakers
                  </Link>
                </SheetTitle>

                <nav className='flex flex-col gap-1 mt-4'>
                  {links.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className='block px-3 py-2.5 text-base font-medium rounded-md hover:bg-accent transition-colors'
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
