'use client'

import { useSettings } from '@/hooks/use-settings'
import { Label } from '../ui/label'
import { ModeToggle } from '../mode-toggle'
import {
  Dialog,
  DialogContent,
  DialogHeader
} from '../ui/dialog'

const SettingsModal = () => {
  const {isOpen, onClose} = useSettings()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader className="pb-3 border-b">
          <h2 className="font-medium text-lg">My settings</h2>
        </DialogHeader>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>

            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Jotion looks on your device
            </span>
          </div>

          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
