"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Moon, Sun, Shield, Languages } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import type { UserSettings } from "@/lib/types"

interface SettingsPanelProps {
  settings: UserSettings
  onUpdateSettings: (settings: Partial<UserSettings>) => void
}

export function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  const isRTL = settings.language === "ar"

  const texts = {
    en: {
      title: "Settings",
      theme: "Dark Mode",
      themeDesc: "Switch between light and dark theme",
      security: "Security Alerts",
      securityDesc: "Show warnings for sensitive data",
      language: "Language",
      languageDesc: "Switch between English and Arabic",
    },
    ar: {
      title: "الإعدادات",
      theme: "الوضع الليلي",
      themeDesc: "التبديل بين الوضع النهاري والليلي",
      security: "التنبيهات الأمنية",
      securityDesc: "عرض تحذيرات للبيانات الحساسة",
      language: "اللغة",
      languageDesc: "التبديل بين الإنجليزية والعربية",
    },
  }

  const t = texts[settings.language]

  return (
    <Card className="w-full">
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-lg flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <Settings size={20} />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              {settings.theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              {t.theme}
            </Label>
            <div className="text-sm text-gray-500">{t.themeDesc}</div>
          </div>
          <Switch
            checked={settings.theme === "dark"}
            onCheckedChange={(checked) => onUpdateSettings({ theme: checked ? "dark" : "light" })}
          />
        </div>

        {/* Security Alerts Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Shield size={16} />
              {t.security}
            </Label>
            <div className="text-sm text-gray-500">{t.securityDesc}</div>
          </div>
          <Switch
            checked={settings.securityAlerts}
            onCheckedChange={(checked) => onUpdateSettings({ securityAlerts: checked })}
          />
        </div>

        {/* Language Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Languages size={16} />
              {t.language}
            </Label>
            <div className="text-sm text-gray-500">{t.languageDesc}</div>
          </div>
          <Switch
            checked={settings.language === "ar"}
            onCheckedChange={(checked) => onUpdateSettings({ language: checked ? "ar" : "en" })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
