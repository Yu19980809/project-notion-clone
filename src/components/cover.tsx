'use client'

import { useMutation } from 'convex/react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { ImageIcon, X } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import ConfirmModal from './modals/confirm-modal'

interface CoverProps {
  url?: string
  preview?: boolean
}

const Cover = ({
  url,
  preview
}: CoverProps) => {
  const {edgestore} = useEdgeStore()
  const params = useParams()
  const {onReplace} = useCoverImage()
  const removeCoverImage = useMutation(api.documents.removeCoverImage)


  const handleRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ url })
    }

    removeCoverImage({
      id: params.documentId as Id<'documents'>
    })
  }

  return (
    <div className={cn(
      'relative group w-full h-[35vh]',
      !url && 'h-[12vh]',
      url && 'bg-muted'
    )}>
      {!!url && (
        <Image
          src={url}
          alt="Cover"
          fill
          className="object-cover"
        />
      )}

      {url && !preview && (
        <div className="absolute right-4 bottom-4 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => onReplace(url)}
            variant="outline"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Change cover
          </Button>

          <ConfirmModal onConfirm={handleRemove}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </ConfirmModal>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return (
    <Skeleton className="w-full h-[12vh]" />
  )
}

export default Cover
