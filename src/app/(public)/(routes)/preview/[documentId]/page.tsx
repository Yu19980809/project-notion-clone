'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useMutation, useQuery } from 'convex/react'

import { Id } from '../../../../../../convex/_generated/dataModel'
import { api } from '../../../../../../convex/_generated/api'
import Toolbar from '@/components/toolbar'
import Cover from '@/components/cover'
import { Skeleton } from '@/components/ui/skeleton'

interface DocumentPreviewPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

const DocumentPreviewPage = ({ params }: DocumentPreviewPageProps) => {
  const Editor = useMemo(() => dynamic(
    () => import('@/components/editor'),
    {ssr: false}
  ), [])

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  })

  const update = useMutation(api.documents.update)

  const handleChange = (content: string) => {
    update({
      id: params.documentId,
      content
    })
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />

        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pt-4 pl-8">
            <Skeleton className="w-[50%] h-14" />
            <Skeleton className="w-[80%] h-4" />
            <Skeleton className="w-[40%] h-4" />
            <Skeleton className="w-[60%] h-4" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className="pb-40 dark:bg-[#1F1F1F]">
      <Cover preview url={document.coverImage} />

      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar preview initialData={document} />

        <Editor
          onChange={handleChange}
          initialContent={document.content}
          editable={false}
        />
      </div>
    </div>
  )
}

export default DocumentPreviewPage

