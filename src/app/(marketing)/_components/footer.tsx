import { Button } from '@/components/ui/button'
import Logo from './logo'

const Footer = () => (
  <div className="flex items-center w-full p-6 bg-background dark:bg-[#1F1F1F] z-50">
    <Logo />

    <div className="flex justify-between items-center gap-x-2 w-full text-muted-foreground md:justify-end md:ml-auto">
      <Button variant="ghost" size="sm">
        Privacy Policy
      </Button>

      <Button variant="ghost" size="sm">
        Terms & Condotions
      </Button>
    </div>
  </div>
)

export default Footer
