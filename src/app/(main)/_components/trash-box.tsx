'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery } from 'convex/react'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import ConfirmModal from '@/components/modals/confirm-modal'
import { api } from '../../../../convex/_generated/api'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { Id } from '../../../../convex/_generated/dataModel'

const TrashBox = () => {
  const [searchInput, setSearchInput] = useState('')
  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)
  const router = useRouter()
  const params = useParams()

  if (documents === undefined) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <Spinner size="lg" />
      </div>
    )
  }

  const filteredDocuments = documents?.filter(document => {
    return document.title.toLowerCase().includes(searchInput.toLowerCase())
  })

  const handleClick = (documentId: Id<'documents'>) => {
    router.push(`/documents/${documentId}`)
  }

  const handleRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>
  ) => {
    e.stopPropagation()
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.'
    })
  }

  const handleRemove = (documentId: Id<'documents'>) => {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.'
    })

    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4" />

        <Input
          onChange={e => setSearchInput(e.target.value)}
          value={searchInput}
          placeholder="Filter by page title..."
          className="h-7 px-2 bg-secondary focus-visible:ring-transparent"
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block pb-2 text-center text-xs text-muted-foreground">
          No documents found.
        </p>

        {filteredDocuments?.map(document => (
          <div
            key={document._id}
            role="button"
            onClick={() => handleClick(document._id)}
            className="flex justify-between items-center w-full rounded-sm hover:bg-primary/5 text-sm text-primary"
          >
            <span className="pl-2 truncate">{document.title}</span>

            <div className="flex items-center">
              <div
                onClick={e => handleRestore(e, document._id)}
                role="button"
                className="p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <Undo className="w-4 h-4 text-muted-foreground" />
              </div>

              <ConfirmModal onConfirm={() => handleRemove(document._id)}>
                <div
                  role="button"
                  className="p-2 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Trash className="w-4 h-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrashBox
