import type { AchievementLog, NFTGeneratorLog, ChannelReputation } from "@/lib/types"

/**
 * Generate SHA-256 Proof Hash from achievement data
 * This hash will be used for NFT minting on Pi Network
 */
export async function generateProofHash(achievements: AchievementLog[]): Promise<string> {
  // Sort achievements by timestamp for consistent hashing
  const sortedAchievements = [...achievements].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  })

  // Create deterministic string from achievements
  const dataString = sortedAchievements
    .map((a) => {
      return `${a.achievementId}|${a.channelId}|${a.ownerId}|${a.achievementType}|${a.metadata.value}|${new Date(a.timestamp).getTime()}`
    })
    .join("||")

  // Generate SHA-256 hash
  const encoder = new TextEncoder()
  const data = encoder.encode(dataString)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}

/**
 * Create Achievement Log entry
 */
export function createAchievementLog(
  channelId: string,
  ownerId: string,
  ownerUsername: string,
  achievementType: AchievementLog["achievementType"],
  metadata: { description: string; value: number },
  additionalData?: { rating?: number; helpCount?: number },
): AchievementLog {
  return {
    achievementId: `ach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    channelId,
    ownerId,
    ownerUsername,
    achievementType,
    rating: additionalData?.rating,
    helpCount: additionalData?.helpCount,
    timestamp: new Date(),
    metadata,
  }
}

/**
 * Generate NFT Generator Log from achievements
 */
export async function generateNFTLog(
  channelId: string,
  ownerId: string,
  achievements: AchievementLog[],
  metadata: {
    totalRating: number
    totalHelps: number
    successRate: number
    verifiedChannel: boolean
  },
): Promise<NFTGeneratorLog> {
  const proofHash = await generateProofHash(achievements)

  return {
    logId: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    channelId,
    ownerId,
    achievements,
    proofHash,
    generatedAt: new Date(),
    readyForMinting: true,
    metadata,
  }
}

/**
 * Calculate Reputation Score (0-1000)
 */
export function calculateReputationScore(achievements: AchievementLog[]): number {
  let score = 0

  achievements.forEach((achievement) => {
    switch (achievement.achievementType) {
      case "high_rating":
        score += achievement.metadata.value * 10 // Max 50 points per high rating
        break
      case "milestone_helps":
        score += achievement.metadata.value * 5 // 5 points per help milestone
        break
      case "verified_channel":
        score += 200 // Verification bonus
        break
      case "community_star":
        score += 100 // Community star bonus
        break
    }
  })

  return Math.min(score, 1000) // Cap at 1000
}

/**
 * Check if channel is ready for NFT minting
 */
export function isReadyForNFTMinting(reputation: ChannelReputation): boolean {
  return (
    reputation.reputationScore >= 500 && // Minimum reputation score
    reputation.achievements.length >= 10 && // Minimum achievements
    reputation.achievements.some((a) => a.achievementType === "verified_channel") // Must be verified
  )
}

/**
 * Save reputation data to localStorage (encrypted)
 */
export function saveReputationData(reputation: ChannelReputation): void {
  try {
    const key = `p314_reputation_${reputation.channelId}`
    localStorage.setItem(key, JSON.stringify(reputation))
  } catch (error) {
    console.error("[P314] Failed to save reputation data:", error)
  }
}

/**
 * Load reputation data from localStorage
 */
export function loadReputationData(channelId: string): ChannelReputation | null {
  try {
    const key = `p314_reputation_${channelId}`
    const data = localStorage.getItem(key)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("[P314] Failed to load reputation data:", error)
  }
  return null
}

/**
 * Export NFT metadata for Pi Network minting
 */
export function exportNFTMetadata(nftLog: NFTGeneratorLog) {
  return {
    name: `P314 Reputation Badge`,
    description: `Proof of Contribution for Channel ${nftLog.channelId}`,
    attributes: [
      {
        trait_type: "Total Rating",
        value: nftLog.metadata.totalRating,
      },
      {
        trait_type: "Total Helps",
        value: nftLog.metadata.totalHelps,
      },
      {
        trait_type: "Success Rate",
        value: `${nftLog.metadata.successRate}%`,
      },
      {
        trait_type: "Verified Channel",
        value: nftLog.metadata.verifiedChannel ? "Yes" : "No",
      },
      {
        trait_type: "Proof Hash",
        value: nftLog.proofHash,
      },
      {
        trait_type: "Generated At",
        value: new Date(nftLog.generatedAt).toISOString(),
      },
    ],
    proof_hash: nftLog.proofHash,
    ready_for_minting: nftLog.readyForMinting,
  }
}
