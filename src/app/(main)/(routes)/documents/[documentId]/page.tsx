'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useMutation, useQuery } from 'convex/react'

import { Id } from '../../../../../../convex/_generated/dataModel'
import { api } from '../../../../../../convex/_generated/api'
import Toolbar from '@/components/toolbar'
import Cover from '@/components/cover'

interface DocumentDetailPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

const DocumentDetailPage = ({ params }: DocumentDetailPageProps) => {
  // const Editor = useMemo(() => dynamic(
  //   () => import('@/components/editor')
  // ), [])

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  })

  const update = useMutation(api.documents.update)

  const handleChange = (content: string) => {}

  if (document === undefined) {
    return (
      <p>Loading...</p>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />

      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />

        {/* <Editor
          onChange={handleChange}
          initialData={document.content}
        /> */}
      </div>
    </div>
  )
}

export default DocumentDetailPage
