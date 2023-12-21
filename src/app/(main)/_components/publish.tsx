'use client'

import { useState } from 'react'
import { Check, Copy, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from 'convex/react'

import { useOrigin } from '@/hooks/use-origin'
import { Doc } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

interface PublishProps {
  initialData: Doc<'documents'>
}

const Publish = ({ initialData }: PublishProps) => {
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = useMutation(api.documents.update)
  const origin = useOrigin()
  const url = `${origin}/preview/${initialData._id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const handlePublish = () => {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: true
    })
      .finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: 'Publishing...',
      success: 'Note published!',
      error: 'Failed to publish note.'
    })
  }

  const handleUnpublish = () => {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: false
    })
      .finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Note unpublished!',
      error: 'Failed to unpublish note.'
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Publish
          {initialData.isPublished && (
            <Globe className="w-4 h-4 ml-2 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        alignOffset={8}
        forceMount
        className="w-72"
      >
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="w-4 h-4 text-sky-500 animate-pulse" />

              <p className="font-medium text-xs text-sky-500">
                This note is live on web.
              </p>
            </div>

            <div className="flex items-center">
              <input
                disabled
                value={url}
                className="flex-1 h-8 px-2 rounded-l-md border bg-muted text-xs truncate"
              />

              <Button
                onClick={handleCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <Button
              onClick={handleUnpublish}
              disabled={isSubmitting}
              size="sm"
              className="w-full text-xs"
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Globe className="w-8 h-8 mb-2 text-muted-foreground" />

            <p className="mb-2 font-medium text-sm">
              Publish this note
            </p>

            <span className="mb-4 text-xs text-muted-foreground">
              Share your work with others.
            </span>

            <Button
              onClick={handlePublish}
              disabled={isSubmitting}
              size="sm"
              className="w-full text-xs"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default Publish
