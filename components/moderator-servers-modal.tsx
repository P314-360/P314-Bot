"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Globe, Clock } from "lucide-react"
import { useModeratorServers } from "@/hooks/use-moderator-servers"
import { COLORS } from "@/lib/app-config"
import { useLanguage } from "@/hooks/use-language"

interface ModeratorServersModalProps {
  isOpen: boolean
  onClose: () => void
  piAccessToken: string | null
}

export function ModeratorServersModal({ isOpen, onClose, piAccessToken }: ModeratorServersModalProps) {
  const { servers, isLoading } = useModeratorServers(piAccessToken)
  const { t } = useLanguage()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
        <DialogHeader style={{ backgroundColor: COLORS.PRIMARY }} className="text-white rounded-t-lg p-4 -m-6 mb-4">
          <DialogTitle className="flex items-center gap-2">
            <Shield size={24} />
            {t.moderatorServers}
          </DialogTitle>
          <DialogDescription className="text-white/90">{t.moderatorServersDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">{t.loading}</p>
            </div>
          )}

          {!isLoading && servers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Shield size={48} className="mx-auto mb-3 text-gray-300" />
              <p>{t.noModeratorsAvailable}</p>
            </div>
          )}

          {servers.map((server) => (
            <div key={server.serverId} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                  >
                    {server.moderatorUsername.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{server.moderatorUsername}</h3>
                    {server.isVerified && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <Shield size={12} className="mr-1" />
                        {t.verified}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {server.specialization && server.specialization.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users size={16} className="text-gray-400 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {server.specialization.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {server.language && server.language.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={16} className="text-gray-400" />
                    <span>{server.language.join(", ")}</span>
                  </div>
                )}

                {server.availableHours && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>{server.availableHours}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
