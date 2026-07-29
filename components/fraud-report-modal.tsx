"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Search } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import type { FraudReport } from "@/lib/types"
import { validatePiWalletAddress } from "@/lib/pi-blockchain-utils"

interface FraudReportModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
  piAccessToken: string | null
  prefilledWallet?: string
  onReportSubmitted?: () => void
  // Additional optional props used by various callers
  onWalletVerify?: (wallet: string) => void
  primaryColor?: string
}

export function FraudReportModal({
  isOpen,
  onClose,
  userId,
  username,
  piAccessToken,
  prefilledWallet,
  onReportSubmitted,
}: FraudReportModalProps) {
  const [reportType, setReportType] = useState<FraudReport["reportType"]>("scam")
  const [description, setDescription] = useState("")
  const [suspectWallet, setSuspectWallet] = useState(prefilledWallet || "")
  const [suspectLink, setSuspectLink] = useState("")
  const [evidence, setEvidence] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [walletValidation, setWalletValidation] = useState<{
    isValid: boolean
    message: string
  } | null>(null)

  const handleWalletChange = (value: string) => {
    setSuspectWallet(value)
    if (value.trim()) {
      const isValid = validatePiWalletAddress(value)
      setWalletValidation({
        isValid,
        message: isValid ? "Valid Pi wallet format" : "Invalid wallet address format",
      })
    } else {
      setWalletValidation(null)
    }
  }

  const handleSubmit = async () => {
    if (!description.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reports/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: userId,
          reporterUsername: username,
          reportType,
          description: description.trim(),
          evidence: evidence.trim() || undefined,
          suspectWallet: suspectWallet.trim() || undefined,
          suspectLink: suspectLink.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)

        if (onReportSubmitted) {
          onReportSubmitted()
        }

        setTimeout(() => {
          onClose()
          resetForm()
        }, 3000)
      } else {
        alert(data.error || "Failed to submit report")
      }
    } catch (error) {
      console.error("[P314] Failed to submit fraud report:", error)
      alert("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setReportType("scam")
    setDescription("")
    setSuspectWallet("")
    setSuspectLink("")
    setEvidence("")
    setSubmitted(false)
    setWalletValidation(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle size={24} style={{ color: COLORS.PRIMARY }} />
            Report Fraud or Scam
          </DialogTitle>
          <DialogDescription className="text-sm">
            Your report will be reviewed by 3 community validators for verification.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="text-green-600 text-xl font-semibold mb-2">Report Submitted!</div>
            <p className="text-sm text-gray-600">
              Your report has been sent to community validators for review. Thank you for helping keep Pi Network safe!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="reportType" className="text-sm font-semibold">
                Report Type
              </Label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as FraudReport["reportType"])}>
                <SelectTrigger id="reportType" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scam">Scam Attempt</SelectItem>
                  <SelectItem value="wallet">Suspicious Wallet</SelectItem>
                  <SelectItem value="link">Malicious Link</SelectItem>
                  <SelectItem value="behavior">Fraudulent Behavior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold">
                Description (Required)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the fraud or scam in detail..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            {(reportType === "wallet" || reportType === "scam") && (
              <div>
                <Label htmlFor="suspectWallet" className="text-sm font-semibold flex items-center justify-between">
                  <span>Suspect Wallet Address (Optional)</span>
                  <Search size={14} className="text-gray-400" />
                </Label>
                <Input
                  id="suspectWallet"
                  value={suspectWallet}
                  onChange={(e) => handleWalletChange(e.target.value)}
                  placeholder="Enter Pi wallet address (G...)"
                  className="mt-1"
                />
                {walletValidation && (
                  <p className={`text-xs mt-1 ${walletValidation.isValid ? "text-green-600" : "text-red-600"}`}>
                    {walletValidation.message}
                  </p>
                )}
              </div>
            )}

            {(reportType === "link" || reportType === "scam") && (
              <div>
                <Label htmlFor="suspectLink" className="text-sm font-semibold">
                  Suspect Link/URL (Optional)
                </Label>
                <Input
                  id="suspectLink"
                  value={suspectLink}
                  onChange={(e) => setSuspectLink(e.target.value)}
                  placeholder="Enter suspicious link..."
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="evidence" className="text-sm font-semibold">
                Additional Evidence (Optional)
              </Label>
              <Textarea
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Screenshots, chat logs, transaction details, etc."
                className="mt-1 resize-none"
                rows={2}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !description.trim()}
              className="w-full"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your report will be verified by 3 community validators. Fraudulent reports may affect your reputation.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
