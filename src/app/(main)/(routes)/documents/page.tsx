'use client'

import Image from 'next/image'
import { PlusCircle } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { api } from '../../../../../convex/_generated/api'

const DocumentsPage = () => {
  const router = useRouter()
  const {user} = useUser()
  const create = useMutation(api.documents.create)

  const handleCreate = () => {
    const promise = create({ title: 'Untitled' })
      .then(documentId => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.'
    })
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
