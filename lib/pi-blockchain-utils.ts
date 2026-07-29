/**
 * Pi Network Blockchain Integration Utilities
 * For wallet verification and fraud detection
 */

import type { WalletVerification, BlockchainSearchResult } from "./types"

// Pi Network wallet address validation pattern
const PI_WALLET_PATTERN = /^G[A-Z0-9]{55}$/

/**
 * Validates Pi Network wallet address format
 */
export function validatePiWalletAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false
  return PI_WALLET_PATTERN.test(address.trim().toUpperCase())
}

/**
 * Checks if wallet address contains suspicious patterns
 */
export function detectSuspiciousPatterns(address: string): {
  isSuspicious: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  // Check for too many repeated characters
  if (/(.)\1{10,}/.test(address)) {
    reasons.push("Excessive character repetition")
  }

  // Check for common scam patterns
  const scamPatterns = ["SCAM", "FAKE", "TEST", "FRAUD"]
  for (const pattern of scamPatterns) {
    if (address.toUpperCase().includes(pattern)) {
      reasons.push(`Contains suspicious keyword: ${pattern}`)
    }
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  }
}

/**
 * Verifies wallet against local fraud database
 */
export function checkLocalFraudDatabase(address: string): {
  isFlagged: boolean
  reportCount: number
  lastReportDate?: Date
} {
  try {
    const reports = localStorage.getItem("p314_fraud_reports")
    if (!reports) return { isFlagged: false, reportCount: 0 }

    const reportsArray = JSON.parse(reports)
    const walletReports = reportsArray.filter((r: any) => r.suspectWallet?.toUpperCase() === address.toUpperCase())

    return {
      isFlagged: walletReports.length > 0,
      reportCount: walletReports.length,
      lastReportDate: walletReports[0]?.timestamp ? new Date(walletReports[0].timestamp) : undefined,
    }
  } catch {
    return { isFlagged: false, reportCount: 0 }
  }
}

/**
 * Calculates risk score for a wallet (0-100)
 */
export function calculateWalletRiskScore(verification: Partial<WalletVerification>): number {
  let riskScore = 0

  // Invalid format adds 50 points
  if (!verification.isValid) riskScore += 50

  // Flagged in local database adds 30 points
  if (verification.isFlagged) riskScore += 30

  // Low transaction count adds 10 points
  if (verification.transactionCount !== undefined && verification.transactionCount < 5) {
    riskScore += 10
  }

  // Recent activity reduces risk by 5 points
  if (verification.lastActivity) {
    const daysSinceActivity = (Date.now() - verification.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActivity < 7) riskScore -= 5
  }

  return Math.max(0, Math.min(100, riskScore))
}

/**
 * Performs comprehensive wallet verification
 */
export async function verifyPiWallet(address: string, piAccessToken?: string | null): Promise<WalletVerification> {
  const cleanAddress = address.trim().toUpperCase()

  // Step 1: Format validation
  const isValid = validatePiWalletAddress(cleanAddress)

  // Step 2: Check suspicious patterns
  const suspiciousCheck = detectSuspiciousPatterns(cleanAddress)

  // Step 3: Check local fraud database
  const fraudCheck = checkLocalFraudDatabase(cleanAddress)

  // Step 4: Build verification result
  const verification: WalletVerification = {
    address: cleanAddress,
    isValid,
    isFlagged: fraudCheck.isFlagged || suspiciousCheck.isSuspicious,
    flagReason:
      [...suspiciousCheck.reasons, fraudCheck.isFlagged ? `Reported ${fraudCheck.reportCount} time(s)` : null]
        .filter(Boolean)
        .join("; ") || undefined,
    transactionCount: 0, // Would be populated from blockchain API
    firstSeen: undefined, // Would be populated from blockchain API
    lastActivity: fraudCheck.lastReportDate,
  }

  // Step 5: Calculate risk score
  verification.riskScore = calculateWalletRiskScore(verification)

  // Step 6: Attempt blockchain lookup (if token provided)
  if (piAccessToken && isValid) {
    try {
      // This would call Pi Block Explorer API
      // For now, we simulate the check
      console.log("[P314] Blockchain verification for:", cleanAddress)
    } catch (error) {
      console.error("[P314] Blockchain lookup failed:", error)
    }
  }

  return verification
}

/**
 * Searches Pi blockchain for wallet information
 */
export async function searchPiBlockchain(
  address: string,
  piAccessToken?: string | null,
): Promise<BlockchainSearchResult> {
  const verification = await verifyPiWallet(address, piAccessToken)

  return {
    address: verification.address,
    exists: verification.isValid,
    balance: "0.00", // Would be from blockchain API
    verified: verification.isValid && !verification.isFlagged,
    fraudReports: verification.flagReason ? 1 : 0,
    status: verification.riskScore > 50 ? "flagged" : verification.riskScore > 20 ? "suspicious" : "clean",
  }
}
