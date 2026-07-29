"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit2, DollarSign, Eye, MousePointer } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { useAdManagement } from "@/hooks/use-ad-management"
import { useAdminCheck } from "@/hooks/use-admin-check"

interface AdManagementPanelProps {
  language: "en" | "ar"
}

export function AdManagementPanel({ language }: AdManagementPanelProps) {
  const isRTL = language === "ar"
  const piUsername = localStorage.getItem("p314_pi_username")
  const { isAdmin } = useAdminCheck(piUsername)
  const { ads, isLoading, createAd, deleteAd, updateAd } = useAdManagement(null, isAdmin)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    targetUrl: "",
    displayType: "banner" as "banner" | "interstitial" | "native",
    priority: 1,
    isActive: true,
  })

  const texts = {
    en: {
      title: "Advertisement Management",
      addNew: "Add New Ad",
      adTitle: "Ad Title",
      description: "Description",
      targetUrl: "Target URL",
      displayType: "Display Type",
      priority: "Priority",
      active: "Active",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      noAds: "No ads created yet",
      impressions: "Impressions",
      clicks: "Clicks",
      revenue: "Revenue",
    },
    ar: {
      title: "إدارة الإعلانات",
      addNew: "إضافة إعلان جديد",
      adTitle: "عنوان الإعلان",
      description: "الوصف",
      targetUrl: "رابط الهدف",
      displayType: "نوع العرض",
      priority: "الأولوية",
      active: "نشط",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
      noAds: "لم يتم إنشاء إعلانات بعد",
      impressions: "مرات الظهور",
      clicks: "النقرات",
      revenue: "الدخل",
    },
  }

  const t = texts[language]

  const handleCreateAd = async () => {
    if (!newAd.title.trim() || !newAd.targetUrl.trim()) return

    const success = await createAd(newAd)
    if (success) {
      setNewAd({
        title: "",
        description: "",
        targetUrl: "",
        displayType: "banner",
        priority: 1,
        isActive: true,
      })
      setShowAddForm(false)
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-semibold text-sm sm:text-lg flex items-center gap-2">
          <DollarSign size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: COLORS.PRIMARY }} />
          <span className="truncate">{t.title}</span>
        </h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ backgroundColor: COLORS.PRIMARY }}
          className="text-white text-xs sm:text-sm flex-shrink-0 px-2 sm:px-3"
        >
          <Plus size={14} className={`sm:w-4 sm:h-4 ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}`} />
          <span className="hidden sm:inline">{t.addNew}</span>
          <span className="sm:hidden">{language === "ar" ? "إضافة" : "Add"}</span>
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-2" style={{ borderColor: COLORS.PRIMARY }}>
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.adTitle}</label>
              <Input
                value={newAd.title}
                onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                placeholder="Pi Network Feature"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t.description}</label>
              <Input
                value={newAd.description}
                onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                placeholder="Discover new features..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t.targetUrl}</label>
              <Input
                value={newAd.targetUrl}
                onChange={(e) => setNewAd({ ...newAd, targetUrl: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">{t.displayType}</label>
                <select
                  value={newAd.displayType}
                  onChange={(e) =>
                    setNewAd({ ...newAd, displayType: e.target.value as "banner" | "interstitial" | "native" })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="banner">Banner</option>
                  <option value="interstitial">Interstitial</option>
                  <option value="native">Native</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">{t.priority}</label>
                <Input
                  type="number"
                  value={newAd.priority}
                  onChange={(e) => setNewAd({ ...newAd, priority: Number.parseInt(e.target.value) })}
                  min="1"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newAd.isActive}
                onChange={(e) => setNewAd({ ...newAd, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">{t.active}</span>
            </label>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                {t.cancel}
              </Button>
              <Button
                size="sm"
                onClick={handleCreateAd}
                disabled={!newAd.title.trim() || !newAd.targetUrl.trim()}
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
        <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
      ) : ads.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">{t.noAds}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {ads.map((ad) => (
            <Card key={ad.adId} className="border hover:border-green-300 transition-colors">
              <CardContent className="p-2.5 sm:p-3">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate">{ad.title}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{ad.description}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 truncate">
                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {ad.targetUrl}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateAd(ad.adId, { isActive: !ad.isActive })}
                      className="text-blue-600 h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Edit2 size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAd(ad.adId)}
                      className="text-red-600 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye size={10} className="sm:w-3 sm:h-3" />
                    <span>
                      {ad.impressions} <span className="hidden sm:inline">{t.impressions}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MousePointer size={10} className="sm:w-3 sm:h-3" />
                    <span>
                      {ad.clicks} <span className="hidden sm:inline">{t.clicks}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign size={10} className="sm:w-3 sm:h-3" />
                    <span>${ad.revenue.toFixed(2)}</span>
                  </div>
                  <div
                    className={`ml-auto px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${ad.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {ad.isActive ? t.active : "Paused"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
