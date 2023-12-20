'use client'

import { ButtonHTMLAttributes, forwardRef, useMemo } from 'react'
import { useDropzone, type DropzoneOptions } from 'react-dropzone'
import { twMerge } from 'tailwind-merge'
import { UploadCloudIcon, X } from 'lucide-react'

import { Spinner } from './spinner'

const variants = {
  base: 'relative rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
  image:
    'border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md',
  active: 'border-2',
  disabled:
    'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
  reject: 'border border-red-700 bg-red-700 bg-opacity-10',
}

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`
  },
  fileInvalidType() {
    return 'Invalid file type.'
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`
  },
  fileNotSupported() {
    return 'The file is not supported.'
  },
}

type InputProps = {
  width?: number
  height?: number
  className?: string
  value?: File | string
  onChange?: (file?: File) => void | Promise<void>
  disabled?: boolean
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>
}

const SingleImageDropzone = forwardRef<HTMLInputElement, InputProps>(
  (
    {dropzoneOptions, width, height, value, className, disabled, onChange},
    ref
  ) => {
    const imageUrl = useMemo(() => {
      if (typeof value === 'string') {
        return value
      } else if (value) {
        return URL.createObjectURL(value)
      }

      return null
    }, [value])

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      acceptedFiles,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject
    } = useDropzone({
      accept: {'image/*': []},
      multiple: false,
      disabled,
      onDrop: acceptedFiles => {
        const file = acceptedFiles[0]

        if (file) void onChange?.(file)
      },
      ...dropzoneOptions
    })

    // styling
    const dropzoneClassName = useMemo(() => {
      return twMerge(
        variants.base,
        isFocused && variants.active,
        disabled && variants.disabled,
        imageUrl && variants.image,
        (isDragReject ?? fileRejections[0]) && variants.reject,
        isDragAccept && variants.accept,
        className
      ).trim()
    }, [
      isFocused,
      disabled,
      imageUrl,
      isDragReject,
      isDragAccept,
      fileRejections,
      className
    ])

    // error validation messages
    const errorMessage = useMemo(() => {
      if (!fileRejections[0]) return undefined

      const {errors} = fileRejections[0]
      switch (errors[0]?.code) {
        case 'file-too-large':
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0)

        case 'file-invalid-type':
          return ERROR_MESSAGES.fileInvalidType()

        case 'too-many-files':
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0)

        default:
          return ERROR_MESSAGES.fileNotSupported()
      }
    }, [fileRejections, dropzoneOptions])

    return (
      <div className="relative">
        {disabled && (
          <div className="absolute inset-y-0 flex justify-center items-center w-full h-full bg-background/80 z-50">
            <Spinner />
          </div>
        )}

        <div
          {...getRootProps({
            className: dropzoneClassName,
            style: { width, height }
          })}
        >
          {/* Main File Input */}
          <input ref={ref} {...getInputProps} />

          {imageUrl ? (
            // Image Preview
            <img
              src={imageUrl}
              alt={acceptedFiles[0]?.name}
              className="w-full h-full rounded-md object-cover"
            />
          ) : (
            // Upload Icon
            <div className="flex flex-col justify-center items-center text-xs text-gray-400">
              <UploadCloudIcon className="w-7 h-7 mb-2" />

              <div className="text-gray-400">
                Click or drag file to this area to upload
              </div>
            </div>
          )}

          {/* Remove Image Icon */}
          {imageUrl && !disabled && (
            <div
              onClick={e => {
                e.stopPropagation()
                void onChange?.(undefined)
              }}
              className="group absolute top-0 right-0 transform -translate-x-1/4 -trannslate-y-1/4"
            >
              <div className="flex justify-center items-center w-5 h-5 rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:w-6 hover:h-6 dark:border-gray-400 dark:bg-black">
                <X
                  width={16}
                  height={16}
                  className="text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Text */}
        <div className="mt-1 text-xs text-red-500">{errorMessage}</div>
      </div>
    )
  }
)

SingleImageDropzone.displayName = 'SingleImageDropzone'

const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={twMerge(
        // base
        'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
        // color
        'border border-gray-400 text-gray-400 shadow hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
        // size
        'h-6 rounded-md px-2 text-xs',
        className,
      )}
    />
  )
})

Button.displayName = 'Button'

function formatFileSize(bytes?: number) {
  if (!bytes) return '0 Bytes'

  bytes = Number(bytes)
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k ,i)).toFixed(dm))} ${sizes[i]}`
}

export default SingleImageDropzone
