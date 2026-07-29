// Reputation System Logic
// Handles automatic reputation calculations and level management

export type UserLevel = "beginner" | "investigator" | "expert" | "master"
export type ActivityType =
  | "accurate_report"
  | "false_report"
  | "validated_report"
  | "helpful_answer"
  | "referral_bonus"
  | "daily_login"
  | "quest_completed"
  | "level_up"

export interface ReputationConfig {
  accurate_report: { points: number; balance: number }
  false_report: { points: number; balance: number }
  validated_report: { points: number; balance: number }
  helpful_answer: { points: number; balance: number }
  referral_bonus: { points: number; balance: number }
  daily_login: { points: number; balance: number }
  quest_completed: { points: number; balance: number }
  level_up: { points: number; balance: number }
}

// Reputation rewards configuration
export const REPUTATION_REWARDS: ReputationConfig = {
  accurate_report: { points: 10.0, balance: 0.5 }, // 10 reputation + 0.5 Pi
  false_report: { points: -5.0, balance: 0.0 }, // Penalty: -5 reputation
  validated_report: { points: 5.0, balance: 0.3 }, // Validator reward
  helpful_answer: { points: 3.0, balance: 0.1 }, // Community help
  referral_bonus: { points: 5.0, balance: 1.0 }, // Referral reward
  daily_login: { points: 1.0, balance: 0.0 }, // Daily activity
  quest_completed: { points: 15.0, balance: 2.0 }, // Quest completion
  level_up: { points: 20.0, balance: 0.0 }, // Level up bonus
}

// Level thresholds
export const LEVEL_THRESHOLDS = {
  beginner: { min: 0, max: 99.99 },
  investigator: { min: 100, max: 499.99 },
  expert: { min: 500, max: 1999.99 },
  master: { min: 2000, max: Number.POSITIVE_INFINITY },
}

// Level bonus multipliers
export const LEVEL_BONUSES = {
  beginner: 1.0,
  investigator: 1.1, // 10% bonus
  expert: 1.25, // 25% bonus
  master: 1.5, // 50% bonus
}

export function calculateLevel(reputationPoints: number): UserLevel {
  if (reputationPoints >= LEVEL_THRESHOLDS.master.min) return "master"
  if (reputationPoints >= LEVEL_THRESHOLDS.expert.min) return "expert"
  if (reputationPoints >= LEVEL_THRESHOLDS.investigator.min) return "investigator"
  return "beginner"
}

export function getLevelBonus(level: UserLevel): number {
  return LEVEL_BONUSES[level]
}

export function calculateReward(activityType: ActivityType, userLevel: UserLevel): { points: number; balance: number } {
  const baseReward = REPUTATION_REWARDS[activityType]
  const bonus = getLevelBonus(userLevel)

  return {
    points: Number.parseFloat((baseReward.points * bonus).toFixed(2)),
    balance: Number.parseFloat((baseReward.balance * bonus).toFixed(2)),
  }
}

export function canValidateReports(level: UserLevel): boolean {
  return level === "investigator" || level === "expert" || level === "master"
}

export function canCreateNFT(level: UserLevel): boolean {
  return level === "expert" || level === "master"
}

export function canVoteOnGovernance(level: UserLevel): boolean {
  return level === "master"
}

export function getUnlockedFeatures(level: UserLevel): string[] {
  switch (level) {
    case "beginner":
      return ["chat", "basic_reports"]
    case "investigator":
      return ["chat", "basic_reports", "validate_reports", "community_voting"]
    case "expert":
      return ["chat", "basic_reports", "validate_reports", "community_voting", "create_channels", "nft_staking"]
    case "master":
      return [
        "chat",
        "basic_reports",
        "validate_reports",
        "community_voting",
        "create_channels",
        "nft_staking",
        "governance_voting",
        "priority_support",
      ]
  }
}

export function getLevelBadge(level: UserLevel): string {
  switch (level) {
    case "beginner":
      return "🌱"
    case "investigator":
      return "🔍"
    case "expert":
      return "⭐"
    case "master":
      return "👑"
  }
}

export function getLevelColor(level: UserLevel): string {
  switch (level) {
    case "beginner":
      return "text-gray-500"
    case "investigator":
      return "text-blue-500"
    case "expert":
      return "text-purple-500"
    case "master":
      return "text-yellow-500"
  }
}
