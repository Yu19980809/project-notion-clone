'use client'

import Logo from './logo'
import { cn } from '@/lib/utils'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { ModeToggle } from '@/components/mode-toggle'

const Navbar = () => {
  const scrolled = useScrollTop()

  return (
    <div className={cn(
      'fixed top-0 flex items-center w-full p-6 bg-background dark:bg-[#1F1F1F] z-50',
      scrolled && 'border-b shadow-sm'
    )}>
      <Logo />

      <div className="flex justify-between items-center gap-x-2 w-full md:justify-end md:ml-auto">
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar
