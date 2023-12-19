'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useConvexAuth } from 'convex/react'
import { SignInButton } from '@clerk/clerk-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'

const Header = () => {
  const {isAuthenticated, isLoading} = useConvexAuth()

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl">
        Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
        <span className="underline">Jotion</span>
      </h1>

      <h3 className="font-medium text-base sm:text-xl md:text-2xl">
        Jotion is the connected workspace where <br />
        better, faster work happens.
      </h3>

      {isLoading && (
        <div className="flex justify-center items-center w-full">
          <Spinner size="lg" />
        </div>
      )}

      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Jotion free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </SignInButton>
      )}

      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Jotion
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  )
}

export default Header
