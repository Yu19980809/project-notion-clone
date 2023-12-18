'use client'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Header = () => {
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

      <Button>
        Enter Jotion
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}

export default Header
