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
import { links } from '@/lib/utils'
import logo from '../app/images/logo.png'

// Découpage de tes liens en gauche/droite (adapte selon ta logique)
const leftNavItems = links.slice(0, Math.ceil(links.length / 2))
const rightNavItems = links.slice(Math.ceil(links.length / 2))

export default function Navbar() {
  return (
    <header className='border-b bg-agro-background w-full'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between md:grid md:grid-cols-3'>
        {/* BLOC GAUCHE (Desktop) */}
        <div className='hidden md:flex justify-center'>
          <NavigationMenu>
            <NavigationMenuList className='gap-1'>
              {leftNavItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      href={item.path}
                      className='text-xl font-lora text-agro-text font-bold'
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* BLOC CENTRAL : LOGO */}
        <div className='flex md:justify-center'>
          <Link
            href='/'
            className='relative h-25 w-25 whitespace-nowrap whitespace-nowrap'
          >
            <Image
              src={logo}
              alt='logo Agromakers'
              className='object-contain h-14 w-auto'
              fill
              priority
            />
          </Link>
        </div>

        {/* BLOC DROITE (Desktop) */}
        <div className='hidden md:flex items-center justify-start gap-4'>
          <NavigationMenu>
            <NavigationMenuList className='gap-1'>
              {rightNavItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      href={item.path}
                      className='text-xl font-lora text-agro-text'
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button asChild size='lg' className='font-lora text-lg'>
            <Link href='/newsletter'>Newsletter</Link>
          </Button>
        </div>

        {/* NAVIGATION MOBILE */}
        <div className='flex md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' aria-label='Ouvrir le menu'>
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

              <div className='border-t pt-4 mt-auto mb-4'>
                <Button asChild className='w-full text-xl py-5'>
                  <Link href='/newsletter'>Newsletter</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
