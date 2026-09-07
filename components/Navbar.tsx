'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

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
  SheetClose,
} from '@/components/ui/sheet'
import { cn, links } from '@/lib/utils'
import logo from '../app/images/logo.png'

export default function Navbar() {
  const pathname = usePathname()
  return (
    <header className='sticky top-0 z-50 bg-agro-charcoal w-full'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between'>
        {/* LOGO À GAUCHE */}
        <Link href='/' className='relative h-10 w-36 sm:h-16 sm:w-52 shrink-0'>
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
              {links.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (item.path !== '/' && pathname.startsWith(item.path))
                return (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink
                      asChild
                      active={isActive}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'relative bg-transparent hover:bg-agro-green hover:text-white focus:bg-agro-green focus:text-white',
                      )}
                    >
                      <Link
                        href={item.path}
                        className={cn(
                          'text-xl font-lora font-medium',
                          'text-white hover:text-agro-white',
                          isActive && 'text-agro-green',
                        )}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
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
              className='w-[300px] flex flex-col justify-between bg-black text-white uppercase py-6 text-center'
            >
              <div>
                <SheetTitle className='flex justify-center border-b pb-4 pt-2 mb-6'>
                  <SheetClose asChild>
                    <Link href='/' className='relative h-14 w-40 shrink-0'>
                      <Image
                        src={logo}
                        alt='logo Agromakers'
                        className='object-contain'
                        fill
                        priority
                      />
                    </Link>
                  </SheetClose>
                </SheetTitle>

                <nav className='flex flex-col gap-1 mt-4'>
                  {links.map((item) => (
                    <SheetClose key={item.path} asChild>
                      <Link
                        key={item.path}
                        href={item.path}
                        className='block px-3 py-2.5 text-base font-medium rounded-md hover:bg-accent transition-colors'
                      >
                        {item.title}
                      </Link>
                    </SheetClose>
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
