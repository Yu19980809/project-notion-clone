'use client'

import { useUser, SignOutButton } from '@clerk/clerk-react'
import { ChevronsLeftRight } from 'lucide-react'

import {
  Avatar,
  AvatarImage
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const UserItem = () => {
  const {user} = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center w-full p-3 text-sm hover:bg-primary/5"
        >
          <div className="flex items-center gap-x-2 max-w-[150px]">
            <Avatar className="w-5 h-5">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>

            <span className="font-medium text-start line-clamp-1">
              {user?.fullName}&apos;s Jotion
            </span>
          </div>

          <ChevronsLeftRight className="w-4 h-4 ml-2 text-muted-foreground rotate-90" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        alignOffset={11}
        forceMount
        className="w-80"
      >
        <div className="flex flex-col p-2 space-y-4">
          <p className="font-medium text-xs text-muted-foreground leading-none">
            {user?.emailAddresses[0].emailAddress}
          </p>

          <div className="flex items-center gap-x-2">
            <div className="p-1 rounded-md bg-secondary">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>

            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {user?.fullName}&apos;s Jotion
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="w-full text-muted-foreground cursor-pointer"
        >
          <SignOutButton>
            Log out
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserItem
