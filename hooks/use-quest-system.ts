"use client"

import { useState, useEffect } from "react"
import type { QuestProgress, Shard, NFTProofOfContribution, GameProgress } from "@/lib/types"

const INITIAL_QUESTS: QuestProgress[] = [
  {
    questId: "ai_sharpening",
    questName: "AI Sharpening",
    description: "Complete 50 interactions to improve P314's AI training data",
    type: "ai_sharpening",
    current: 0,
    target: 50,
    completed: false,
    shardEarned: false,
  },
  {
    questId: "app_explorer",
    questName: "App Explorer",
    description: "Submit 2 app reviews via App Discovery",
    type: "app_explorer",
    current: 0,
    target: 2,
    completed: false,
    shardEarned: false,
  },
  {
    questId: "fraud_hunter",
    questName: "Fraud Hunter",
    description: "Submit 1 verified fraud report",
    type: "fraud_hunter",
    current: 0,
    target: 1,
    completed: false,
    shardEarned: false,
  },
]

export const useQuestSystem = (userId: string) => {
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    userId,
    quests: INITIAL_QUESTS,
    shards: [],
    nfts: [],
    totalContribution: 0,
  })

  const [showQuestNotification, setShowQuestNotification] = useState<string | null>(null)
  const [canMintNFT, setCanMintNFT] = useState(false)

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`p314_quest_progress_${userId}`)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setGameProgress(parsed)
      } catch (error) {
        console.error("[P314] Failed to load quest progress:", error)
      }
    }
  }, [userId])

  // Save progress to localStorage
  useEffect(() => {
    if (gameProgress.totalContribution > 0) {
      localStorage.setItem(`p314_quest_progress_${userId}`, JSON.stringify(gameProgress))
    }
  }, [gameProgress, userId])

  // Check if user can mint NFT (has 3 shards)
  useEffect(() => {
    const availableShards = gameProgress.shards.filter(
      (shard) => !gameProgress.nfts.some((nft) => nft.shardsUsed.some((s) => s.id === shard.id)),
    )
    setCanMintNFT(availableShards.length >= 3)
  }, [gameProgress])

  const incrementQuest = (questType: QuestProgress["type"]) => {
    setGameProgress((prev) => {
      const updatedQuests = prev.quests.map((quest) => {
        if (quest.type === questType && !quest.completed) {
          const newCurrent = quest.current + 1
          const isCompleted = newCurrent >= quest.target

          if (isCompleted && !quest.shardEarned) {
            // Award shard
            const newShard: Shard = {
              id: `shard_${Date.now()}`,
              type: questType === "ai_sharpening" ? "ai" : questType === "app_explorer" ? "explorer" : "fraud",
              earnedAt: new Date(),
              questId: quest.questId,
            }

            setShowQuestNotification(`Quest Completed: ${quest.questName}! You earned a Shard! 🎉`)
            setTimeout(() => setShowQuestNotification(null), 5000)

            return {
              ...quest,
              current: newCurrent,
              completed: true,
              shardEarned: true,
              completedAt: new Date(),
            }
          }

          return {
            ...quest,
            current: newCurrent,
            completed: isCompleted,
          }
        }
        return quest
      })

      const completedQuest = updatedQuests.find(
        (q) =>
          q.type === questType &&
          q.completed &&
          q.shardEarned &&
          !prev.quests.find((pq) => pq.type === q.type)?.shardEarned,
      )

      const newShards = completedQuest
        ? [
            ...prev.shards,
            {
              id: `shard_${Date.now()}`,
              type: questType === "ai_sharpening" ? "ai" : questType === "app_explorer" ? "explorer" : "fraud",
              earnedAt: new Date(),
              questId: completedQuest.questId,
            } as Shard,
          ]
        : prev.shards

      return {
        ...prev,
        quests: updatedQuests,
        shards: newShards,
        totalContribution: prev.totalContribution + 1,
      }
    })
  }

  const mintNFT = async (piAccessToken: string): Promise<boolean> => {
    const availableShards = gameProgress.shards.filter(
      (shard) => !gameProgress.nfts.some((nft) => nft.shardsUsed.some((s) => s.id === shard.id)),
    )

    if (availableShards.length < 3) {
      return false
    }

    const shardsToUse = availableShards.slice(0, 3)

    const newNFT: NFTProofOfContribution = {
      id: `nft_${Date.now()}`,
      tokenId: `P314-${gameProgress.userId.slice(0, 8)}-${gameProgress.nfts.length + 1}`,
      mintedAt: new Date(),
      shardsUsed: shardsToUse,
      status: "pending",
      metadata: {
        totalInteractions: gameProgress.quests.find((q) => q.type === "ai_sharpening")?.current || 0,
        totalReviews: gameProgress.quests.find((q) => q.type === "app_explorer")?.current || 0,
        totalReports: gameProgress.quests.find((q) => q.type === "fraud_hunter")?.current || 0,
      },
    }

    setGameProgress((prev) => ({
      ...prev,
      nfts: [...prev.nfts, newNFT],
    }))

    setShowQuestNotification("NFT-P314 Minted! 🏆 Proof of Contribution unlocked!")
    setTimeout(() => setShowQuestNotification(null), 5000)

    // TODO: Implement actual NFT minting via Pi Network backend
    // This would call a backend API that interacts with Pi Blockchain

    return true
  }

  return {
    gameProgress,
    incrementQuest,
    mintNFT,
    canMintNFT,
    showQuestNotification,
    clearNotification: () => setShowQuestNotification(null),
  }
}
