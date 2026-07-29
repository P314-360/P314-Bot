"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bug, Check, X, Trophy, Clock } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface BountyReport {
  id: string
  reporterUsername: string
  fraudMethodTitle: string
  description: string
  evidenceImageUrl: string | null
  keywords: string[]
  bountyAmount: number
  createdAt: string
}

interface BountyReviewPanelProps {
  adminId: string
  language?: "en" | "ar"
}

export function BountyReviewPanel({ adminId, language = "en" }: BountyReviewPanelProps) {
  const [reports, setReports] = useState<BountyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    loadPendingReports()
  }, [])

  const loadPendingReports = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/bounty/pending")
      const data = await response.json()
      if (data.success) {
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error("[P314] Failed to load bounty reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (reportId: string, action: "approve" | "reject") => {
    if (action === "reject" && !adminNotes.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    try {
      const response = await fetch("/api/bounty/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          adminId,
          action,
          notes: adminNotes.trim() || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Report ${action}d successfully!`)
        setReports((prev) => prev.filter((r) => r.id !== reportId))
        setReviewingId(null)
        setAdminNotes("")
      } else {
        alert(data.error || "Failed to review report")
      }
    } catch (error) {
      console.error("[P314] Failed to review report:", error)
      alert("Failed to submit review")
    }
  }

  const texts = {
    en: {
      title: "Bug Bounty Reviews",
      pending: "Pending Reports",
      noReports: "No pending reports",
      reporter: "Reporter",
      fraudPattern: "Fraud Pattern",
      description: "Description",
      keywords: "Keywords",
      evidence: "Evidence",
      reward: "Reward",
      submittedAt: "Submitted",
      adminNotes: "Admin Notes",
      approve: "Approve & Pay",
      reject: "Reject",
      reviewing: "Reviewing...",
    },
    ar: {
      title: "مراجعة مكافآت الثغرات",
      pending: "البلاغات المعلقة",
      noReports: "لا توجد بلاغات معلقة",
      reporter: "المبلغ",
      fraudPattern: "نمط الاحتيال",
      description: "الوصف",
      keywords: "الكلمات المفتاحية",
      evidence: "الدليل",
      reward: "المكافأة",
      submittedAt: "تاريخ الإرسال",
      adminNotes: "ملاحظات الإدارة",
      approve: "الموافقة والدفع",
      reject: "الرفض",
      reviewing: "جاري المراجعة...",
    },
  }

  const t = texts[language]

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
            style={{ borderColor: COLORS.PRIMARY }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Bug size={18} />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t.pending}</span>
          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
            {reports.length} reports
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy size={40} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{t.noReports}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 space-y-3 bg-gradient-to-br from-purple-50 to-blue-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-purple-900">{report.fraudMethodTitle}</div>
                    <div className="text-xs text-gray-600">
                      {t.reporter}: @{report.reporterUsername}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{report.bountyAmount} π</div>
                    <div className="text-xs text-gray-500">+ 50 rep</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">{t.description}:</div>
                  <div className="text-sm text-gray-800 bg-white p-2 rounded border">{report.description}</div>
                </div>

                {report.keywords && report.keywords.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">{t.keywords}:</div>
                    <div className="flex flex-wrap gap-1">
                      {report.keywords.map((kw, i) => (
                        <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {report.evidenceImageUrl && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">{t.evidence}:</div>
                    <a
                      href={report.evidenceImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      View Evidence →
                    </a>
                  </div>
                )}

                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(report.createdAt).toLocaleString()}
                </div>

                {reviewingId === report.id ? (
                  <div className="space-y-2 pt-2 border-t">
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder={t.adminNotes}
                      rows={2}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReview(report.id, "approve")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Check size={14} className="mr-1" />
                        {t.approve}
                      </Button>
                      <Button
                        onClick={() => handleReview(report.id, "reject")}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        <X size={14} className="mr-1" />
                        {t.reject}
                      </Button>
                      <Button onClick={() => setReviewingId(null)} variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setReviewingId(report.id)}
                    className="w-full"
                    size="sm"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                  >
                    {t.reviewing}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
