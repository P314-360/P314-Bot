"use client"

import { useState, useEffect } from "react"
import type { ChannelReputation, AchievementLog } from "@/lib/types"
import {
  createAchievementLog,
  generateNFTLog,
  calculateReputationScore,
  isReadyForNFTMinting,
  saveReputationData,
  loadReputationData,
} from "@/lib/nft-reputation-utils"

export const useChannelReputation = (channelId: string, ownerId: string, ownerUsername: string) => {
  const [reputation, setReputation] = useState<ChannelReputation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load reputation on mount
  useEffect(() => {
    if (channelId) {
      const loaded = loadReputationData(channelId)
      if (loaded) {
        setReputation(loaded)
      } else {
        // Initialize new reputation
        const newReputation: ChannelReputation = {
          channelId,
          ownerId,
          reputationScore: 0,
          achievements: [],
          nftLogs: [],
          lastUpdated: new Date(),
        }
        setReputation(newReputation)
        saveReputationData(newReputation)
      }
    }
  }, [channelId, ownerId])

  /**
   * Add achievement to channel reputation
   */
  const addAchievement = async (
    achievementType: AchievementLog["achievementType"],
    metadata: { description: string; value: number },
    additionalData?: { rating?: number; helpCount?: number },
  ) => {
    if (!reputation) return

    setIsLoading(true)

    try {
      const achievement = createAchievementLog(
        channelId,
        ownerId,
        ownerUsername,
        achievementType,
        metadata,
        additionalData,
      )

      const updatedAchievements = [...reputation.achievements, achievement]
      const newScore = calculateReputationScore(updatedAchievements)

      const updatedReputation: ChannelReputation = {
        ...reputation,
        achievements: updatedAchievements,
        reputationScore: newScore,
        lastUpdated: new Date(),
      }

      setReputation(updatedReputation)
      saveReputationData(updatedReputation)

      return achievement
    } catch (error) {
      console.error("[P314] Failed to add achievement:", error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Generate NFT proof and prepare for minting
   */
  const generateNFTProof = async () => {
    if (!reputation) return null

    setIsLoading(true)

    try {
      const nftLog = await generateNFTLog(channelId, ownerId, reputation.achievements, {
        totalRating: reputation.achievements.reduce((sum, a) => sum + (a.rating || 0), 0),
        totalHelps: reputation.achievements.filter((a) => a.achievementType === "milestone_helps").length,
        successRate: reputation.reputationScore / 10, // Convert to percentage
        verifiedChannel: reputation.achievements.some((a) => a.achievementType === "verified_channel"),
      })

      const updatedReputation: ChannelReputation = {
        ...reputation,
        nftLogs: [...reputation.nftLogs, nftLog],
        lastUpdated: new Date(),
      }

      setReputation(updatedReputation)
      saveReputationData(updatedReputation)

      return nftLog
    } catch (error) {
      console.error("[P314] Failed to generate NFT proof:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Check if ready for NFT minting
   */
  const checkMintingEligibility = () => {
    if (!reputation) return false
    return isReadyForNFTMinting(reputation)
  }

  return {
    reputation,
    isLoading,
    addAchievement,
    generateNFTProof,
    checkMintingEligibility,
  }
}
