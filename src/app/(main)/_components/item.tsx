'use client'

import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash
} from 'lucide-react'

import { Id } from '../../../../convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '../../../../convex/_generated/api'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { useUser } from '@clerk/clerk-react'

interface ItemProps {
  label: string
  icon: LucideIcon
  id?: Id<'documents'>
  documentIcon?: string
  active?: boolean
  isSearch?: boolean
  level?: number
  expanded?: boolean
  onExpand?: () => void
  onClick?: () => void
}

const Item = ({
  label,
  icon: Icon,
  onClick,
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight
  const create = useMutation(api.documents.create)
  const router = useRouter()
  const {user} = useUser()
  const archive = useMutation(api.documents.archive)

  const handleExpand = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation()
    onExpand?.()
  }

  const handleCreate = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation()
    if (!id) return

    const promise = create({ title: 'Untitled', parentDocument: id })
      .then(documentId => {
        if (!expanded) onExpand?.()

        router.push(`/documents/${documentId}`)
      })

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.'
    })
  }

  const handleArchive = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation()
    if (!id) return

    const promise = archive({ id })
      .then(() => router.push('/documents'))

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.'
    })
  }

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : '12px'
      }}
      className={cn(
        'group flex items-center w-full min-h-[27px] py-1 pr-3 font-medium text-sm text-muted-foreground hover:bg-primary/5',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {!!id && (
        <div
          onClick={handleExpand}
          role="button"
          className="h-full mr-1 rounded-sm hover:neutral-300 dark:hover:bg-neutral-600"
        >
          <ChevronIcon className="shrink-0 w-4 h-4 text-muted-foreground/50" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}

      <span className="truncate">
        {label}
      </span>

      {isSearch && (
        <kbd className="inline-flex items-center gap-1 h-5 ml-auto px-1.5 rounded border bg-muted font-mono font-medium text-[10px] text-muted-foreground opacity-100 pointer-events-none select-none">
          <span className="text-xs">Ctrl + K</span>
        </kbd>
      )}

      {!!id && (
        <div className="flex items-center gap-x-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={e => e.stopPropagation()}
            >
              <div
                role="button"
                className="h-full ml-auto rounded-sm opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="right"
              forceMount
              className="w-60"
            >
              <DropdownMenuItem onClick={handleArchive}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <div className="p-2 text-xs text-muted-foreground">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            onClick={handleCreate}
            role="button"
            className="h-full ml-auto rounded-sm opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({
  level
}: {
  level?: number
}) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 12}px` : '12px'
      }}
      className="flex gap-x-2 py-[4px]"
    >
      <Skeleton className="w-4 h-4" />
      <Skeleton className="w-[30%] h-4" />
    </div>
  )
}

export default Item
