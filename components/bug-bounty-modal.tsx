"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Bug, Trophy, Upload } from "lucide-react"
import { COLORS } from "@/lib/app-config"

interface BugBountyModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
}

export function BugBountyModal({ isOpen, onClose, userId, username }: BugBountyModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [evidenceUrl, setEvidenceUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bounty/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterId: userId,
          reporterUsername: username,
          title: title.trim(),
          description: description.trim(),
          evidenceUrl: evidenceUrl.trim() || null,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          resetForm()
        }, 3000)
      } else {
        alert(data.error || "Failed to submit report")
      }
    } catch (error) {
      console.error("[P314] Failed to submit bug bounty:", error)
      alert("Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setKeywords("")
    setEvidenceUrl("")
    setSubmitted(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Bug size={24} style={{ color: COLORS.PRIMARY }} />
            Report Novel Fraud Pattern
          </DialogTitle>
          <DialogDescription className="text-sm">
            Discover a new scam method? Report it and earn <strong>10 π + 50 reputation points</strong> if approved!
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <Trophy size={48} className="mx-auto mb-4" style={{ color: COLORS.PRIMARY }} />
            <div className="text-green-600 text-xl font-semibold mb-2">Report Submitted!</div>
            <p className="text-sm text-gray-600">
              Your novel fraud pattern has been sent to admin for review. You'll be notified once it's reviewed!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Trophy size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-purple-800">
                  <strong>Bug Bounty Rewards:</strong>
                  <br />• 10 π if your pattern is approved
                  <br />• 50 reputation points instant boost
                  <br />• Your discovery helps protect the entire Pi Network community
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-semibold">
                Fraud Pattern Title (Required)
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fake KYC Verification Site"
                className="mt-1"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold">
                Detailed Description (Required)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how this scam works, what makes it unique, and how users can identify it..."
                className="mt-1 resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/1000 characters</p>
            </div>

            <div>
              <Label htmlFor="keywords" className="text-sm font-semibold">
                Keywords (Optional)
              </Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="fake kyc, phishing, identity theft (comma separated)"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">These help train our AI detection system</p>
            </div>

            <div>
              <Label htmlFor="evidence" className="text-sm font-semibold flex items-center gap-2">
                <Upload size={14} />
                Evidence Image URL (Optional)
              </Label>
              <Input
                id="evidence"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://example.com/screenshot.png"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Screenshot or proof of the fraud pattern</p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="w-full"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Admin will review your submission within 24-48 hours. You'll receive a notification with the decision.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
