'use client'

import {
  ElementRef,
  useRef,
  useState,
  useEffect
} from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { usePathname } from 'next/navigation'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
  Plus,
  Trash
} from 'lucide-react'

import UserItem from './user-item'
import Item from './item'
import DocumentList from './document-list'
import TrashBox from './trash-box'
import { cn } from '@/lib/utils'
import { api } from '../../../../convex/_generated/api'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

const Navigation = () => {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const create = useMutation(api.documents.create)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [isMobile, pathname])

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return
    let newWidth = e.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100%-${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? '100%' : '240px'
      navbarRef.current.style.setProperty(
        'left',
        isMobile ? '100%' : '240px'
      )
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100%-240px)'
      )

      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('left', '0')
      navbarRef.current.style.setProperty('width', '100%')

      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const handleCreate = () => {
    const promise = create({ title: 'Untitled' })

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.'
    })
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'relative group/sidebar flex flex-col w-60 h-full bg-secondary overflow-y-auto z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        {/* collapse button */}
        <div
          onClick={collapse}
          role="button"
          className={cn(
            'absolute top-5 right-2 w-6 h-6 rounded-sm text-muted-foreground transition opacity-0 group-hover/sidebar:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className="w-6 h-6" />
        </div>

        {/* function buttons */}
        <div>
          <UserItem />

          <Item
            onClick={() => {}}
            label="Search"
            icon={Search}
            isSearch
          />

          <Item
            onClick={() => {}}
            label="Settings"
            icon={Settings}
          />

          <Item
            onClick={handleCreate}
            label="New page"
            icon={PlusCircle}
          />
        </div>

        {/* documents list */}
        <div className="mt-4">
          <DocumentList />

          <Item
            onClick={handleCreate}
            label="Add a page"
            icon={Plus}
          />

          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>

            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        {/* scroll bar */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute top-0 right-0 w-1 h-full bg-primary/10 opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 left-60 w-[calc(100%-240px)] z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        <nav className="w-full px-3 py-2 bg-transparent">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="w-6 h-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  )
}

export default Navigation
