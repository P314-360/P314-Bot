"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface PendingReport {
  id: string
  reporterUsername: string
  reportType: string
  description: string
  evidence?: string
  suspectWallet?: string
  suspectLink?: string
  createdAt: string
}

interface ValidatorReviewPanelProps {
  userId: string
  username: string
}

export function ValidatorReviewPanel({ userId, username }: ValidatorReviewPanelProps) {
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingReports()
  }, [userId])

  const fetchPendingReports = async () => {
    try {
      const response = await fetch(`/api/reports/pending-reviews?validatorId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setPendingReports(data.reports || [])
      }
    } catch (error) {
      console.error("[P314] Failed to fetch pending reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (reportId: string, verdict: "fraud_confirmed" | "safe") => {
    setSubmitting(reportId)

    try {
      const response = await fetch("/api/reports/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          validatorId: userId,
          validatorUsername: username,
          verdict,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Remove reviewed report from list
        setPendingReports((prev) => prev.filter((r) => r.id !== reportId))

        // Show success message
        alert(data.message)
      } else {
        alert(data.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("[P314] Review submission error:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Clock className="animate-spin mr-2" size={20} />
            <span>Loading pending reviews...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (pendingReports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle size={20} style={{ color: COLORS.PRIMARY }} />
            Validator Review Panel
          </CardTitle>
          <CardDescription>No pending reports to review at this time</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Pending Reviews</h2>
        <Badge variant="secondary">{pendingReports.length} report(s)</Badge>
      </div>

      {pendingReports.map((report) => (
        <Card key={report.id} className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle size={18} style={{ color: COLORS.PRIMARY }} />
                  {report.reportType.toUpperCase()} Report
                </CardTitle>
                <CardDescription>
                  Reported by {report.reporterUsername} • {new Date(report.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="outline" style={{ borderColor: COLORS.PRIMARY }}>
                Needs Review
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Description:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{report.description}</p>
            </div>

            {report.suspectWallet && (
              <div>
                <h4 className="font-semibold mb-1">Suspect Wallet:</h4>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{report.suspectWallet}</code>
              </div>
            )}

            {report.suspectLink && (
              <div>
                <h4 className="font-semibold mb-1">Suspect Link:</h4>
                <a
                  href={report.suspectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 underline"
                >
                  {report.suspectLink}
                </a>
              </div>
            )}

            {report.evidence && (
              <div>
                <h4 className="font-semibold mb-1">Evidence:</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{report.evidence}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-3">Your Verdict:</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleSubmitReview(report.id, "fraud_confirmed")}
                  disabled={submitting === report.id}
                  className="flex-1"
                  variant="destructive"
                >
                  <XCircle size={16} className="mr-2" />
                  Fraud Confirmed
                </Button>
                <Button
                  onClick={() => handleSubmitReview(report.id, "safe")}
                  disabled={submitting === report.id}
                  className="flex-1"
                  style={{ backgroundColor: COLORS.SUCCESS }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Safe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Correct verdicts earn +1 Pi point • Incorrect verdicts lose -5 reputation
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
