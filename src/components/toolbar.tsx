'use cilent'

import { ElementRef, useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import TextareaAutosize from 'react-textarea-autosize'
import { X, Smile, ImageIcon } from 'lucide-react'

import { Doc } from '../../convex/_generated/dataModel'
import { api } from '../../convex/_generated/api'
import { useCoverImage } from '@/hooks/use-cover-image'
import IconPicker from './icon-picker'
import { Button } from './ui/button'

interface ToolbarProps {
  initialData: Doc<'documents'>
  preview?: boolean // true => guest, false => owner
}

const Toolbar = ({
  initialData,
  preview
}: ToolbarProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData.title)
  const inputRef = useRef<ElementRef<'textarea'>>(null)
  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)
  const coverImage = useCoverImage()

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => setIsEditing(false)

  const handleInput = (value: string) => {
    setValue(value)
    update({
      id: initialData._id,
      title: value || 'Untitled'
    })
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      disableInput()
    }
  }

  const handleSelectIcon = (icon: string) => {
    update({
      id: initialData._id,
      icon
    })
  }

  const handleRemoveIcon = () => {
    removeIcon({ id: initialData._id })
  }

  return (
    <div className="relative group pl-[54px]">
      {/* icon part for document owner */}
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={handleSelectIcon}>
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>

          <Button
            onClick={handleRemoveIcon}
            variant="outline"
            size="icon"
            className="rounded-full text-muted-foreground text-xs transition opacity-0 group-hover/icon:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* icon part for guests */}
      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl">
          {initialData.icon}
        </p>
      )}

      {/* add icon & cover */}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {/* add icon */}
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={handleSelectIcon}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground"
            >
              <Smile className="w-4 h-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}

        {/* add cover */}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            variant="outline"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>

      {/* edit title */}
      {(isEditing && !preview) ? (
        <TextareaAutosize
          ref={inputRef}
          onChange={e => handleInput(e.target.value)}
          onBlur={disableInput}
          onKeyDown={handleKeyDown}
          value={value}
          className="resize-zone bg-transparent font-bold text-5xl text-[#3F3F3F] dark:text-[#CFCFCF] break-words outline-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] font-bold text-5xl text-[#3F3F3F] dark:text-[#CFCFCF] break-words outline-none"
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}

export default Toolbar
