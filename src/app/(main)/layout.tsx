'use client'

import { ReactNode } from 'react'
import { useConvexAuth } from 'convex/react'
import { redirect } from 'next/navigation'

import { Spinner } from '@/components/spinner'
import Navigation from './_components/navigation'

const MainLayout = ({
  children
}: {
  children: ReactNode
}) => {
  const {isAuthenticated, isLoading} = useConvexAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    redirect('/')
  }

  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      <Navigation />

      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
