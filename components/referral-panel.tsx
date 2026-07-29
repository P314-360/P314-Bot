"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, Users, TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReferralPanelProps {
  userId: string
  username: string
}

export function ReferralPanel({ userId, username }: ReferralPanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [referralLink, setReferralLink] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [referredUsers, setReferredUsers] = useState<any[]>([])
  const [commissionHistory, setCommissionHistory] = useState<any[]>([])

  useEffect(() => {
    loadReferralData()
  }, [userId])

  const loadReferralData = async () => {
    try {
      setLoading(true)

      const [linkResponse, statsResponse] = await Promise.all([
        fetch("/api/referral/get-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }),
        fetch("/api/referral/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }),
      ])

      if (linkResponse.ok) {
        const linkData = await linkResponse.json()
        setReferralLink(linkData.referralLink)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
        setReferredUsers(statsData.referredUsers || [])
        setCommissionHistory(statsData.commissionHistory || [])
      }
    } catch (error) {
      console.error("Error loading referral data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (referralLink?.referralUrl) {
      navigator.clipboard.writeText(referralLink.referralUrl)
      toast({
        title: "تم النسخ!",
        description: "تم نسخ رابط الإحالة إلى الحافظة",
      })
    }
  }

  const shareLink = async () => {
    if (referralLink?.referralUrl && navigator.share) {
      try {
        await navigator.share({
          title: "انضم إلى P314",
          text: `استخدم رابط الإحالة الخاص بي للانضمام إلى P314 - منصة الأمان الذكية لشبكة Pi`,
          url: referralLink.referralUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      copyToClipboard()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Referral Link Card */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Share2 className="h-5 w-5" />
            رابط الإحالة الخاص بك
          </CardTitle>
          <CardDescription>شارك هذا الرابط واربح 5% من مكافآت أصدقائك مدى الحياة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink?.referralUrl || ""} readOnly className="font-mono text-sm" />
            <Button onClick={copyToClipboard} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareLink} className="bg-purple-600 hover:bg-purple-700">
              <Share2 className="h-4 w-4 mr-2" />
              مشاركة
            </Button>
          </div>

          <div className="bg-purple-100 rounded-lg p-4 text-sm text-purple-900">
            <strong>كود الإحالة:</strong> <span className="font-mono text-lg">{referralLink?.referralCode}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإحالات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats?.totalReferrals || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الإحالات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{stats?.activatedReferrals || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">النقرات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{stats?.clicksCount || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الأرباح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{stats?.totalCommissionsEarned?.toFixed(2) || "0.00"} Pi</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referred Users */}
      <Card>
        <CardHeader>
          <CardTitle>المستخدمون المحالون</CardTitle>
          <CardDescription>قائمة الأشخاص الذين انضموا عبر رابطك</CardDescription>
        </CardHeader>
        <CardContent>
          {referredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد إحالات بعد. شارك رابطك لتبدأ!</div>
          ) : (
            <div className="space-y-3">
              {referredUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {user.isActivated ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        المستوى: {user.userLevel} | السمعة: {user.reputationPoints}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">{user.totalCommissionEarned.toFixed(2)} Pi</div>
                    <div className="text-xs text-gray-500">إجمالي العمولات</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <CardTitle>سجل العمولات</CardTitle>
          <CardDescription>آخر 20 عمولة حصلت عليها من إحالاتك</CardDescription>
        </CardHeader>
        <CardContent>
          {commissionHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد عمولات بعد</div>
          ) : (
            <div className="space-y-2">
              {commissionHistory.map((commission, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div>
                    <div className="font-medium text-sm">{commission.activityType}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(commission.paidAt).toLocaleDateString("ar-SA")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+{commission.commissionAmount.toFixed(2)} Pi</div>
                    <div className="text-xs text-gray-500">
                      {commission.commissionRate}% من {commission.originalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
