// Admin Revenue System for P314 Platform
// Handles platform commissions and treasury management

export interface AdminTreasury {
  totalBalance: number
  totalValidatorCommissions: number
  totalWithdrawalFees: number
  totalPremiumServices: number
  lastUpdated: Date
}

export interface RevenueConfig {
  validatorCommissionRate: number // 0.10 = 10%
  withdrawalFeeRate: number // 0.05 = 5%
  premiumServiceRate: number // 1.00 = 100%
}

export interface AdminTransaction {
  id: string
  transactionType: "validator_commission" | "withdrawal_fee" | "premium_service"
  amount: number
  sourceUserId?: string
  description?: string
  createdAt: Date
}

export const DEFAULT_REVENUE_CONFIG: RevenueConfig = {
  validatorCommissionRate: 0.1, // 10%
  withdrawalFeeRate: 0.05, // 5%
  premiumServiceRate: 1.0, // 100%
}

/**
 * Calculates commission amount for validator rewards
 */
export function calculateValidatorCommission(
  rewardAmount: number,
  commissionRate: number,
): {
  commission: number
  netReward: number
} {
  const commission = Number((rewardAmount * commissionRate).toFixed(6))
  const netReward = Number((rewardAmount - commission).toFixed(6))

  return { commission, netReward }
}

/**
 * Calculates withdrawal fee
 */
export function calculateWithdrawalFee(
  withdrawalAmount: number,
  feeRate: number,
): {
  fee: number
  netAmount: number
} {
  const fee = Number((withdrawalAmount * feeRate).toFixed(6))
  const netAmount = Number((withdrawalAmount - fee).toFixed(6))

  return { fee, netAmount }
}

/**
 * Adds commission to admin treasury
 */
export async function addAdminCommission(
  transactionType: "validator_commission" | "withdrawal_fee" | "premium_service",
  amount: number,
  sourceUserId?: string,
  description?: string,
): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/add-commission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionType,
        amount,
        sourceUserId,
        description,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to add commission")
    }

    return true
  } catch (error) {
    console.error("Error adding admin commission:", error)
    return false
  }
}

/**
 * Gets admin treasury stats
 */
export async function getAdminTreasury(): Promise<AdminTreasury | null> {
  try {
    const response = await fetch("/api/admin/treasury")

    if (!response.ok) {
      throw new Error("Failed to fetch treasury")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching admin treasury:", error)
    return null
  }
}

/**
 * Gets revenue configuration
 */
export async function getRevenueConfig(): Promise<RevenueConfig> {
  try {
    const response = await fetch("/api/admin/revenue-config")

    if (!response.ok) {
      throw new Error("Failed to fetch config")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching revenue config:", error)
    return DEFAULT_REVENUE_CONFIG
  }
}

/**
 * Updates revenue configuration
 */
export async function updateRevenueConfig(config: Partial<RevenueConfig>): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/revenue-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error("Failed to update config")
    }

    return true
  } catch (error) {
    console.error("Error updating revenue config:", error)
    return false
  }
}
