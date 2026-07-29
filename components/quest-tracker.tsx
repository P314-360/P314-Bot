"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Sparkles, Target, Award } from "lucide-react"
import type { GameProgress } from "@/lib/types"
import { COLORS } from "@/lib/app-config"

interface QuestTrackerProps {
  gameProgress: GameProgress
  onMintNFT: () => void
  canMintNFT: boolean
}

export function QuestTracker({ gameProgress, onMintNFT, canMintNFT }: QuestTrackerProps) {
  const availableShards = gameProgress.shards.filter(
    (shard) => !gameProgress.nfts.some((nft) => nft.shardsUsed.some((s) => s.id === shard.id)),
  )

  const getQuestIcon = (type: string) => {
    switch (type) {
      case "ai_sharpening":
        return <Sparkles size={18} />
      case "app_explorer":
        return <Target size={18} />
      case "fraud_hunter":
        return <Award size={18} />
      default:
        return <Trophy size={18} />
    }
  }

  const getShardColor = (type: string) => {
    switch (type) {
      case "ai":
        return "bg-blue-500"
      case "explorer":
        return "bg-green-500"
      case "fraud":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* NFT Minting Card */}
      <Card className="border-2" style={{ borderColor: canMintNFT ? COLORS.PRIMARY : "#e5e7eb" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy size={20} style={{ color: COLORS.PRIMARY }} />
            NFT-P314 Proof of Contribution
          </CardTitle>
          <CardDescription className="text-sm">Collect 3 Shards to mint your NFT-P314 token</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    i <= availableShards.length ? getShardColor(availableShards[i - 1]?.type) : "bg-gray-200"
                  }`}
                >
                  {i <= availableShards.length ? (
                    <Sparkles size={20} className="text-white" />
                  ) : (
                    <span className="text-gray-400 text-xs">?</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: COLORS.PRIMARY }}>
                {availableShards.length}/3
              </p>
              <p className="text-xs text-gray-500">Shards Collected</p>
            </div>
          </div>

          <Button
            onClick={onMintNFT}
            disabled={!canMintNFT}
            className="w-full"
            style={{ backgroundColor: canMintNFT ? COLORS.PRIMARY : "#9ca3af" }}
          >
            {canMintNFT ? "Mint NFT-P314 Now!" : `Collect ${3 - availableShards.length} More Shards`}
          </Button>

          {gameProgress.nfts.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold text-gray-600 mb-2">Your NFTs ({gameProgress.nfts.length})</p>
              <div className="space-y-2">
                {gameProgress.nfts.map((nft) => (
                  <div key={nft.id} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                    <span className="font-mono">{nft.tokenId}</span>
                    <Badge variant="outline" className="text-xs">
                      {nft.status === "minted" ? "Minted" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quest Progress Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Quests</CardTitle>
          <CardDescription className="text-sm">Complete quests to earn Shards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {gameProgress.quests.map((quest) => {
            const progressPercent = (quest.current / quest.target) * 100

            return (
              <div key={quest.questId} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className="mt-1" style={{ color: COLORS.PRIMARY }}>
                      {getQuestIcon(quest.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{quest.questName}</p>
                      <p className="text-xs text-gray-600">{quest.description}</p>
                    </div>
                  </div>
                  {quest.completed && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Completed
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Contribution Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold" style={{ color: COLORS.PRIMARY }}>
              {gameProgress.totalContribution}
            </p>
            <p className="text-xs text-gray-600">Total Actions</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: COLORS.PRIMARY }}>
              {gameProgress.shards.length}
            </p>
            <p className="text-xs text-gray-600">Shards Earned</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: COLORS.PRIMARY }}>
              {gameProgress.nfts.length}
            </p>
            <p className="text-xs text-gray-600">NFTs Minted</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
