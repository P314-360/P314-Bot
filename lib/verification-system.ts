// Verification System for P314 Digital Investigator
// Handles crowdsourced fraud report verification

export type VerificationVerdict = "fraud_confirmed" | "safe"

export type VerificationStatus = "awaiting_validators" | "in_review" | "verified" | "rejected"

export interface FraudReportForReview {
  id: string
  reportId: string
  reporterUsername: string
  reportType: string
  description: string
  evidence?: string
  suspectWallet?: string
  suspectLink?: string
  createdAt: Date
  assignedValidators: string[]
}

export interface VerificationReview {
  reportId: string
  validatorId: string
  validatorUsername: string
  verdict: VerificationVerdict
  reviewedAt: Date
}

export const VERIFICATION_REWARDS = {
  CORRECT_REVIEW: 1.0, // Pi points for correct verdict
  INCORRECT_PENALTY: -5, // Reputation penalty for wrong verdict
  REPUTATION_REQUIRED: 100, // Minimum reputation to become validator
} as const

export const VALIDATOR_POOL_SIZE = 3 // Number of validators per report

/**
 * Assigns random validators to a fraud report
 * Excludes the reporter to ensure impartiality
 */
export async function assignValidators(
  reportId: string,
  reporterId: string,
  availableValidators: string[],
): Promise<string[]> {
  // Filter out the reporter
  const eligibleValidators = availableValidators.filter((id) => id !== reporterId)

  // Shuffle and select first N validators
  const shuffled = [...eligibleValidators].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, VALIDATOR_POOL_SIZE)
}

/**
 * Calculates consensus from validator reviews
 */
export function calculateConsensus(reviews: VerificationReview[]): {
  hasConsensus: boolean
  finalVerdict?: VerificationVerdict
  correctValidators: string[]
  incorrectValidators: string[]
} {
  const fraudCount = reviews.filter((r) => r.verdict === "fraud_confirmed").length
  const safeCount = reviews.filter((r) => r.verdict === "safe").length

  // Consensus requires 2 out of 3 validators to agree
  if (fraudCount >= 2) {
    return {
      hasConsensus: true,
      finalVerdict: "fraud_confirmed",
      correctValidators: reviews.filter((r) => r.verdict === "fraud_confirmed").map((r) => r.validatorId),
      incorrectValidators: reviews.filter((r) => r.verdict === "safe").map((r) => r.validatorId),
    }
  } else if (safeCount >= 2) {
    return {
      hasConsensus: true,
      finalVerdict: "safe",
      correctValidators: reviews.filter((r) => r.verdict === "safe").map((r) => r.validatorId),
      incorrectValidators: reviews.filter((r) => r.verdict === "fraud_confirmed").map((r) => r.validatorId),
    }
  }

  return {
    hasConsensus: false,
    correctValidators: [],
    incorrectValidators: [],
  }
}

import { calculateValidatorCommission, addAdminCommission, getRevenueConfig } from "./admin-revenue"
import { ReferralSystem } from "./referral-system"

/**
 * Distributes rewards and penalties based on consensus
 * Now includes 10% commission deduction for admin treasury
 * AND 5% referral commission for referrers
 */
export async function processVerificationRewards(
  correctValidators: string[],
  incorrectValidators: string[],
): Promise<void> {
  const revenueConfig = await getRevenueConfig()
  const grossReward = VERIFICATION_REWARDS.CORRECT_REVIEW

  const { commission, netReward } = calculateValidatorCommission(grossReward, revenueConfig.validatorCommissionRate)

  for (const validatorId of correctValidators) {
    await fetch("/api/reputation/add-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: validatorId,
        activityType: "correct_verification",
        points: netReward,
      }),
    })

    await addAdminCommission(
      "validator_commission",
      commission,
      validatorId,
      `Validator commission from correct verification`,
    )

    // This does NOT deduct from validator, it's a platform bonus
    await ReferralSystem.distributeCommission(validatorId, netReward, "validation_reward")

    await ReferralSystem.activateReferral(validatorId)
  }

  for (const validatorId of incorrectValidators) {
    await fetch("/api/reputation/add-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: validatorId,
        activityType: "incorrect_verification",
        points: VERIFICATION_REWARDS.INCORRECT_PENALTY,
      }),
    })
  }
}
