'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useMutation } from 'convex/react'

import SingleImageDropzone from '../single-image-dropzone'
import { useCoverImage } from '@/hooks/use-cover-image'
import { api } from '../../../convex/_generated/api'
import {
  Dialog,
  DialogContent,
  DialogHeader
} from '../ui/dialog'

const CoverImageModal = () => {
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const params = useParams()
  const update = useMutation(api.documents.update)
  const {isOpen, onClose} = useCoverImage()

  const handleChange = () => {}

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
