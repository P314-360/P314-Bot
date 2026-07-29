"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { QuestTracker } from "@/components/quest-tracker"
import { useQuestSystem } from "@/hooks/use-quest-system"
import { COLORS } from "@/lib/app-config"
import { usePiSession } from "@/hooks/use-pi-session"
import { LoginPage } from "@/components/login-page"

export default function QuestsPage() {
  const router = useRouter()

  const {
    isSessionValid,
    isCheckingSession,
    sessionData,
    needsAuth,
    authMessage,
    isAuthenticating,
    startAuthentication,
  } = usePiSession()

  const userId = sessionData?.userId ?? "guest"
  const piAccessToken = sessionData?.piAccessToken || null

  const { gameProgress, mintNFT, canMintNFT } = useQuestSystem(userId || "")

  const handleMintNFT = async () => {
    await mintNFT(piAccessToken)
  }

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: COLORS.PRIMARY }} />
      </div>
    )
  }

  if (!isSessionValid || needsAuth) {
    return <LoginPage onStartAuth={startAuthentication} authMessage={authMessage} isAuthenticating={isAuthenticating} />
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4" style={{ color: COLORS.PRIMARY }}>
            <ArrowLeft size={20} className="mr-2" />
            Back to Chat
          </Button>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.PRIMARY }}>
            P314 Consensus Quests
          </h1>
          <p className="text-gray-600">Complete quests to earn Shards and mint NFT-P314 Proof of Contribution tokens</p>
        </div>

        <QuestTracker gameProgress={gameProgress} onMintNFT={handleMintNFT} canMintNFT={canMintNFT} />
      </div>
    </div>
  )
}
