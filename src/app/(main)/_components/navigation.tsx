'use client'

import {
  ElementRef,
  useRef,
  useState,
  useEffect
} from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { usePathname } from 'next/navigation'
import { useQuery } from 'convex/react'
import { ChevronsLeft, MenuIcon } from 'lucide-react'

import UserItem from './user-item'
import { cn } from '@/lib/utils'
import { api } from '../../../../convex/_generated/api'

const Navigation = () => {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const documents = useQuery(api.documents.get)

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

        <div>
          <UserItem />
        </div>

        <div className="mt-4">
          {documents?.map(document => (
            <p key={document._id}>
              {document.title}
            </p>
          ))}
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute top-0 right-0 w-1 h-full bg-primary opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize"
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
