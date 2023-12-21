'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const Error = () => (
  <div className="flex flex-col justify-center items-center space-y-4 h-full">
    <Image
      src="/error.png"
      alt="Error"
      width={300}
      height={300}
      className="dark:hidden"
    />

    <Image
      src="/error-dark.png"
      alt="Error"
      width={300}
      height={300}
      className="hidden dark:block"
    />

    <h2 className="font-medium text-xl">
      Something went wrong!
    </h2>

    <Button asChild>
      <Link href="/documents">
        Go back
      </Link>
    </Button>
  </div>
)

export default Error
