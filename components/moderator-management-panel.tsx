"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, CheckCircle, XCircle, Shield } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { useModeratorManagement } from "@/hooks/use-moderator-management"
import { useAdminCheck } from "@/hooks/use-admin-check"

interface ModeratorManagementPanelProps {
  language: "en" | "ar"
}

export function ModeratorManagementPanel({ language }: ModeratorManagementPanelProps) {
  const isRTL = language === "ar"
  const piUsername = localStorage.getItem("p314_pi_username")
  const { isAdmin } = useAdminCheck(piUsername)
  const { moderators, isLoading, addModerator, removeModerator } = useModeratorManagement(null, isAdmin)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newModUsername, setNewModUsername] = useState("")
  const [permissions, setPermissions] = useState({
    canModerateChat: true,
    canReviewReports: true,
    canManageContent: false,
    canAccessAnalytics: true,
  })

  const texts = {
    en: {
      title: "Verified Moderators",
      addNew: "Add Moderator",
      username: "Pi Username",
      permissions: "Permissions",
      moderateChat: "Moderate Chat",
      reviewReports: "Review Reports",
      manageContent: "Manage Content",
      accessAnalytics: "Access Analytics",
      cancel: "Cancel",
      save: "Save",
      remove: "Remove",
      active: "Active",
      inactive: "Inactive",
      noModerators: "No moderators added yet",
    },
    ar: {
      title: "المشرفون المعتمدون",
      addNew: "إضافة مشرف",
      username: "اسم المستخدم Pi",
      permissions: "الصلاحيات",
      moderateChat: "إدارة الدردشة",
      reviewReports: "مراجعة البلاغات",
      manageContent: "إدارة المحتوى",
      accessAnalytics: "الوصول للإحصائيات",
      cancel: "إلغاء",
      save: "حفظ",
      remove: "إزالة",
      active: "نشط",
      inactive: "غير نشط",
      noModerators: "لم يتم إضافة مشرفين بعد",
    },
  }

  const t = texts[language]

  const handleAddModerator = async () => {
    if (!newModUsername.trim()) return

    const success = await addModerator(newModUsername, permissions)
    if (success) {
      setNewModUsername("")
      setShowAddForm(false)
      setPermissions({
        canModerateChat: true,
        canReviewReports: true,
        canManageContent: false,
        canAccessAnalytics: true,
      })
    }
  }

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Shield size={18} style={{ color: COLORS.PRIMARY }} />
          {t.title}
        </h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ backgroundColor: COLORS.PRIMARY }}
          className="text-white"
        >
          <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
          {t.addNew}
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-2" style={{ borderColor: COLORS.PRIMARY }}>
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.username}</label>
              <Input
                value={newModUsername}
                onChange={(e) => setNewModUsername(e.target.value)}
                placeholder="pioneer123"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t.permissions}</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canModerateChat}
                    onChange={(e) => setPermissions({ ...permissions, canModerateChat: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t.moderateChat}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canReviewReports}
                    onChange={(e) => setPermissions({ ...permissions, canReviewReports: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t.reviewReports}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canManageContent}
                    onChange={(e) => setPermissions({ ...permissions, canManageContent: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t.manageContent}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canAccessAnalytics}
                    onChange={(e) => setPermissions({ ...permissions, canAccessAnalytics: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t.accessAnalytics}</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                {t.cancel}
              </Button>
              <Button
                size="sm"
                onClick={handleAddModerator}
                disabled={!newModUsername.trim()}
                style={{ backgroundColor: COLORS.PRIMARY }}
                className="text-white"
              >
                {t.save}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : moderators.length === 0 ? (
        <div className="text-center py-8 text-gray-400">{t.noModerators}</div>
      ) : (
        <div className="space-y-2">
          {moderators.map((mod) => (
            <Card key={mod.moderatorId} className="border hover:border-purple-300 transition-colors">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">@{mod.piUsername}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: mod.isActive ? "#10b981" : "#ef4444",
                          color: "white",
                        }}
                      >
                        {mod.isActive ? (
                          <>
                            <CheckCircle size={10} className="inline" /> {t.active}
                          </>
                        ) : (
                          <>
                            <XCircle size={10} className="inline" /> {t.inactive}
                          </>
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      {mod.specialization && (
                        <div>
                          <span className="font-medium">Specialization:</span> {mod.specialization.join(", ")}
                        </div>
                      )}
                      {mod.language && (
                        <div>
                          <span className="font-medium">Languages:</span> {mod.language.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeModerator(mod.moderatorId)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
