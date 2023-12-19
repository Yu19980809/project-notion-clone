'use client'

import Image from 'next/image'
import { PlusCircle } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'

import { Button } from '@/components/ui/button'

const DocumentsPage = () => {
  const {user} = useUser()

  const handleCreate = () => {
    // const promise = create({ title: 'Untitled' })
  }

  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <Image
        src="/empty.png"
        alt="Empty"
        width={300}
        height={300}
        className="dark:hidden"
      />

      <Image
        src="/empty-dark.png"
        alt="Empty"
        width={300}
        height={300}
        className="hidden dark:block"
      />

      <h2 className="font-medium text-lg">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>

      <Button onClick={handleCreate}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentsPage
