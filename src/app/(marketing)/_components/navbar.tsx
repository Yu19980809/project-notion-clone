'use client'

import { useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'

import Logo from './logo'
import { cn } from '@/lib/utils'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Spinner } from '@/components/spinner'

const Navbar = () => {
  const scrolled = useScrollTop()
  const {isAuthenticated, isLoading} = useConvexAuth()

  return (
    <div className={cn(
      'fixed top-0 flex items-center w-full p-6 bg-background dark:bg-[#1F1F1F] z-50',
      scrolled && 'border-b shadow-sm dark:border-primary/10'
    )}>
      <Logo />

      <div className="flex justify-between items-center gap-x-2 w-full md:justify-end md:ml-auto">
        {isLoading && <Spinner />}

        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>

            <SignInButton mode="modal">
              <Button size="sm">
                Get Jotion free
              </Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Jotion</Link>
            </Button>

            <UserButton afterSignOutUrl="/" />
          </>
        )}
        
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar
