"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Bell, Download, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  language: "en" | "ar"
}

export function ProfileSettingsModal({ isOpen, onClose, userId, language }: ProfileSettingsModalProps) {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const isRTL = language === "ar"

  const texts = {
    en: {
      title: "Profile Settings",
      description: "Manage your notifications and data preferences",
      notifications: "Notifications",
      enableAll: "Enable All Notifications",
      email: "Email Notifications",
      push: "Push Notifications",
      dataManagement: "Data Management",
      exportData: "Export My Data",
      deleteAccount: "Delete Account",
      save: "Save Settings",
      cancel: "Cancel",
      saved: "Settings Saved",
      savedDesc: "Your preferences have been updated successfully",
      exportDesc: "Download all your data in JSON format",
      deleteDesc: "Permanently delete your account and all associated data",
    },
    ar: {
      title: "إعدادات الملف الشخصي",
      description: "إدارة الإشعارات وإعدادات البيانات",
      notifications: "الإشعارات",
      enableAll: "تفعيل جميع الإشعارات",
      email: "إشعارات البريد الإلكتروني",
      push: "الإشعارات الفورية",
      dataManagement: "إدارة البيانات",
      exportData: "تصدير بياناتي",
      deleteAccount: "حذف الحساب",
      save: "حفظ الإعدادات",
      cancel: "إلغاء",
      saved: "تم حفظ الإعدادات",
      savedDesc: "تم تحديث تفضيلاتك بنجاح",
      exportDesc: "تنزيل جميع بياناتك بصيغة JSON",
      deleteDesc: "حذف حسابك نهائياً وجميع البيانات المرتبطة",
    },
  }

  const t = texts[language]

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, settings }),
      })

      if (response.ok) {
        toast({
          title: t.saved,
          description: t.savedDesc,
        })
        onClose()
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/user/export?userId=${userId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `p314-data-${userId}.json`
        a.click()
      }
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t.notifications}
            </h3>

            <div className="space-y-3 px-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-all">{t.enableAll}</Label>
                <Switch
                  id="notifications-all"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, notificationsEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif">{t.email}</Label>
                <Switch
                  id="email-notif"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  disabled={!settings.notificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif">{t.push}</Label>
                <Switch
                  id="push-notif"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                  disabled={!settings.notificationsEnabled}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-medium">{t.dataManagement}</h3>

            <Button onClick={handleExportData} variant="outline" className="w-full justify-start bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              {t.exportData}
              <span className="text-xs text-gray-500 ml-2">({t.exportDesc})</span>
            </Button>

            <Button variant="destructive" className="w-full justify-start" disabled>
              <Trash2 className="h-4 w-4 mr-2" />
              {t.deleteAccount}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {t.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
