'use client'
import {
  SignInButton,
  
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from '@clerk/nextjs'
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn }: any = useAuth()
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-8 border-b border-gray-300">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">VT</span>
            <h1>VT</h1>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm/6 font-semibold text-gray-900">
            <SignedOut>
              <SignInButton>
                <button className=' cursor-pointer'>
                  Log in <span aria-hidden="true">&rarr;</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
              />
            </SignedIn>
          </a>
          {
            isSignedIn ? (<Link href={'/dashboard'}><Button className="mx-5 px-4 py-2 text-sm cursor-pointer font-semibold ">
      Dashboard <span aria-hidden="true">&rarr;</span>
    </Button></Link>) :(<></>)
          }

        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">VT</span>
             <h1>VT</h1>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6 flex justify-center items-center">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  <SignedOut>
                    <SignInButton>
                      <button className=' cursor-pointer'>
                        Log in <span aria-hidden="true">&rarr;</span>
                      </button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <UserButton
                    />
                  </SignedIn>
                </a>
                {
            isSignedIn ? (<Link href={'/dashboard'}><Button  className="my-5 px-4 py-2 text-sm cursor-pointer font-semibold ">
    Dashboard <span aria-hidden="true">&rarr;</span>
    </Button></Link>) :(<></>)
          }
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
