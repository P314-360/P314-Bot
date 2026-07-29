"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Tv } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { useLanguage } from "@/hooks/use-language"

interface CreateChannelModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateChannel?: (name: string, description: string, piUsername: string) => Promise<boolean>
  onChannelCreated?: (name: string, description: string, creatorUsername: string) => Promise<boolean>
  isAuthenticated?: boolean
  piUsername?: string | null
  // Additional optional props used by callers
  userId?: string
  username?: string
  primaryColor?: string
}

export function CreateChannelModal({
  isOpen,
  onClose,
  onCreateChannel,
  isAuthenticated,
  piUsername,
}: CreateChannelModalProps) {
  const { t } = useLanguage()
  const [channelName, setChannelName] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!channelName.trim() || !description.trim()) return

    setIsCreating(true)
    const success = await onCreateChannel(channelName, description, piUsername || "Guest")
    setIsCreating(false)

    if (success) {
      setChannelName("")
      setDescription("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader style={{ backgroundColor: COLORS.PRIMARY }} className="text-white rounded-t-lg p-4 -m-6 mb-4">
          <DialogTitle className="flex items-center gap-2">
            <Tv size={24} />
            {t.createChannel}
          </DialogTitle>
          <DialogDescription className="text-white/90">{t.createChannelDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
            <Shield size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">{t.aiModeratedWarning}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              {t.channelOwner}: <span className="font-semibold">@{piUsername || "Guest"}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.channelName}</label>
            <Input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder={t.channelNamePlaceholder}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.channelDescription}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.channelDescriptionPlaceholder}
              rows={4}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/200</p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !channelName.trim() || !description.trim()}
              style={{ backgroundColor: COLORS.PRIMARY }}
              className="text-white"
            >
              {isCreating ? t.creating : t.createChannel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
