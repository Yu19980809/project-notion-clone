'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Id } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/modals/confirm-modal'

interface BannerProps {
  documentId: Id<'documents'>
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter()
  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)

  const handleRemove = () => {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.'
    })

    router.push('/documents')
  }

  const handleRestore = () => {
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.'
    })
  }

  return (
    <div className="flex justify-center items-center gap-x-2 w-full p-2 bg-rose-500 text-center text-sm text-white">
      <p>This page is in the Trash.</p>

      <Button
        onClick={handleRestore}
        variant="outline"
        size="sm"
        className="h-auto p-1 px-2 border-white bg-transparent hover:bg-primary/5 font-normal text-white hover:text-white"
      >
        Restore page
      </Button>

      <ConfirmModal onConfirm={handleRemove}>
        <Button
          variant="outline"
          size="sm"
          className="h-auto p-1 px-2 border-white bg-transparent hover:bg-primary/5 font-normal text-white hover:text-white"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default Banner
