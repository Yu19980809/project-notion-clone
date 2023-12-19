'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { api } from '../../../../convex/_generated/api'
import Item from './item'
import { FileIcon } from 'lucide-react'

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>
  level?: number
  data?: Doc<'documents'>[]
}

const DocumentList = ({
  parentDocumentId,
  level = 0
}: DocumentListProps) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const handleExpand = (documentId: string) => {
    setExpanded(prev => ({
      ...prev,
      [documentId]: !prev[documentId]
    }))
  }

  const documents = useQuery(
    api.documents.getSidebar,
    { parenDocument: parentDocumentId }
  )

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />

        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  const handleRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
        }}
        className={cn(
          'hidden pt-1 pb-3 font-medium text-sm text-muted-foreground',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
      >
        No pages inside
      </p>

      {documents.map(document => (
        <div key={document._id}>
          <Item
            onClick={() => handleRedirect(document._id)}
            onExpand={() => handleExpand(document._id)}
            id={document._id}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            expanded={expanded[document._id]}
          />

          {expanded[document._id] && (
            <DocumentList
              parentDocumentId={document._id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  )
}

export default DocumentList
