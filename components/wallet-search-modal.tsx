"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react"
import { COLORS } from "@/lib/app-config"
import { verifyPiWallet, searchPiBlockchain } from "@/lib/pi-blockchain-utils"
import type { WalletVerification, BlockchainSearchResult } from "@/lib/types"

interface WalletSearchModalProps {
  isOpen: boolean
  onClose: () => void
  piAccessToken: string | null
  onReportFraud?: (walletAddress: string) => void
}

export function WalletSearchModal({ isOpen, onClose, piAccessToken, onReportFraud }: WalletSearchModalProps) {
  const [walletAddress, setWalletAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [verification, setVerification] = useState<WalletVerification | null>(null)
  const [blockchainResult, setBlockchainResult] = useState<BlockchainSearchResult | null>(null)

  const handleSearch = async () => {
    if (!walletAddress.trim()) return

    setIsSearching(true)
    setVerification(null)
    setBlockchainResult(null)

    try {
      // Verify wallet
      const verifyResult = await verifyPiWallet(walletAddress, piAccessToken)
      setVerification(verifyResult)

      // Search blockchain
      const blockchainSearch = await searchPiBlockchain(walletAddress, piAccessToken)
      setBlockchainResult(blockchainSearch)
    } catch (error) {
      console.error("[P314] Wallet search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const getRiskColor = (score?: number) => {
    if (!score) return "text-gray-500"
    if (score >= 50) return "text-red-600"
    if (score >= 20) return "text-orange-500"
    return "text-green-600"
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "clean":
        return <CheckCircle size={20} className="text-green-600" />
      case "suspicious":
        return <AlertTriangle size={20} className="text-orange-500" />
      case "flagged":
        return <XCircle size={20} className="text-red-600" />
      default:
        return <Shield size={20} className="text-gray-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Search size={24} style={{ color: COLORS.PRIMARY }} />
            Pi Wallet Verification
          </DialogTitle>
          <DialogDescription className="text-sm">
            Search and verify Pi Network wallet addresses to detect potential fraud.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="walletAddress" className="text-sm font-semibold">
              Wallet Address
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Pi wallet address (G...)"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching || !walletAddress.trim()}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {verification && blockchainResult && (
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(blockchainResult.status)}
                    <span className="font-semibold text-sm">
                      Status: {blockchainResult.status.charAt(0).toUpperCase() + blockchainResult.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 break-all mb-2">{verification.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Format Valid:</span>
                  <span className={`ml-2 font-semibold ${verification.isValid ? "text-green-600" : "text-red-600"}`}>
                    {verification.isValid ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Risk Score:</span>
                  <span className={`ml-2 font-semibold ${getRiskColor(verification.riskScore)}`}>
                    {verification.riskScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Flagged:</span>
                  <span className={`ml-2 font-semibold ${verification.isFlagged ? "text-red-600" : "text-green-600"}`}>
                    {verification.isFlagged ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Reports:</span>
                  <span className="ml-2 font-semibold">{blockchainResult.fraudReports || 0}</span>
                </div>
              </div>

              {verification.flagReason && (
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-orange-800 mb-1">Warning</p>
                      <p className="text-xs text-orange-700">{verification.flagReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {verification.isFlagged && onReportFraud && (
                <Button
                  onClick={() => {
                    onReportFraud(verification.address)
                    onClose()
                  }}
                  variant="outline"
                  className="w-full text-sm"
                  style={{ borderColor: COLORS.PRIMARY }}
                >
                  Report Additional Fraud Evidence
                </Button>
              )}

              {blockchainResult.status === "clean" && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                    <p className="text-xs text-green-700">
                      This wallet appears to be legitimate with no fraud reports. Always verify transactions
                      independently.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> This verification checks wallet format, local fraud reports, and suspicious
              patterns. Full blockchain data requires Pi Block Explorer API integration.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
