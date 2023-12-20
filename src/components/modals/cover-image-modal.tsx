'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useMutation } from 'convex/react'

import SingleImageDropzone from '../single-image-dropzone'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import {
  Dialog,
  DialogContent,
  DialogHeader
} from '../ui/dialog'

const CoverImageModal = () => {
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams()
  const {edgestore} = useEdgeStore()
  const {url, isOpen, onClose} = useCoverImage()
  const update = useMutation(api.documents.update)

  const handleClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    onClose()
  }

  const handleChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: url
        }
      })

      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url
      })

      handleClose()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <h2 className="font-semibold text-center text-lg">
            Cover Image
          </h2>
        </DialogHeader>

        <SingleImageDropzone
          onChange={handleChange}
          disabled={isSubmitting}
          value={file}
          className="w-full outline-none"
        />
      </DialogContent>
    </Dialog>
  )
}

export default CoverImageModal
