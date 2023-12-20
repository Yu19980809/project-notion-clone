'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/clerk-react'
import { File } from 'lucide-react'

import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useSearch } from '@/hooks/use-search'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command'

export const SearchCommand = () => {
  const [isMounted, setIsMounted] = useState(false)
  const {user} = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)

  const toggle = useSearch(store => store.toggle)
  const isOpen = useSearch(store => store.isOpen)
  const onClose = useSearch(store => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  if (!isMounted) return null

  const handleSelect = (documentId: Id<'documents'>) => {
    router.push(`/documents/${documentId}`)
    onClose()
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <CommandInput placeholder={`Search ${user?.fullName}'s Jotion...`} />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Documents">
          {documents?.map(document => (
            <CommandItem
              key={document._id}
              title={document.title}
              value={`${document._id}-${document.title}`}
              onSelect={() => handleSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="w-4 h-4 mr-2" />
              )}

              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
