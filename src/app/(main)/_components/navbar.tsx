'use client'

import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { MenuIcon } from 'lucide-react'
import Title from './title'
import Banner from './banner'
import Menu from './menu'
import Publish from './publish'

interface NavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

const Navbar = ({
  isCollapsed,
  onResetWidth
}: NavbarProps) => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>
  })

  if (document === undefined) {
    return (
      <nav className="flex justify-between items-center w-full px-3 py-2 bg-background dark:bg-[#1F1F1F]">
        <Title.Skeleton />

        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (document === null) {
    return null
  }

  return (
    <>
      <nav className="flex items-center w-full px-3 py-2 gap-x-4 bg-background dark:bg-[#1F1F1F]">
        {isCollapsed && (
          <MenuIcon
            onClick={onResetWidth}
            role="button"
            className="w-6 h-6 text-muted-foreground"
          />
        )}

        <div className="flex justify-between items-center w-full">
          <Title initialData={document} />

          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>

      {document.isArchived && (
        <Banner documentId={document._id} />
      )}
    </>
  )
}

export default Navbar
