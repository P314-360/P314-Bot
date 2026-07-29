export interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  rating?: number
  feedback?: string
  knowledgeGap?: KnowledgeGapData
  sourceConfidence?: SourceConfidenceData
}

export interface PiUser {
  uid: string
  username: string
  roles?: string[]
  kycVerified?: boolean
}

import type { SupportedLanguage } from "./translations"

export interface UserSettings {
  theme: "light" | "dark"
  securityAlerts: boolean
  language: SupportedLanguage
  voiceSettings?: VoiceSettings
}

export interface ChatHistory {
  sessionId: string
  messages: Message[]
  timestamp: Date
}

export interface CommunityMessage {
  id: string
  text: string
  sender: "user" | "moderator" | "ai_moderator"
  username: string
  userId: string
  timestamp: Date
  flagged?: boolean
  flagReason?: string
}

export interface FraudReport {
  id: string
  reporterId: string
  reporterUsername: string
  reportType: "wallet" | "link" | "behavior" | "scam"
  description: string
  evidence?: string
  suspectWallet?: string
  suspectLink?: string
  timestamp: Date
  status: "pending" | "reviewed" | "escalated"
}

export interface RatingAnalytics {
  messageId: string
  rating: number
  feedback?: string
  timestamp: Date
  userId: string
}

export interface WalletVerification {
  address: string
  isValid: boolean
  isFlagged: boolean
  flagReason?: string
  transactionCount?: number
  firstSeen?: Date
  lastActivity?: Date
  riskScore?: number
}

export interface BlockchainSearchResult {
  address: string
  exists: boolean
  balance?: string
  verified: boolean
  fraudReports?: number
  status: "clean" | "suspicious" | "flagged"
}

export interface QuestProgress {
  questId: string
  questName: string
  description: string
  type: "ai_sharpening" | "app_explorer" | "fraud_hunter"
  current: number
  target: number
  completed: boolean
  shardEarned: boolean
  completedAt?: Date
}

export interface Shard {
  id: string
  type: "ai" | "explorer" | "fraud"
  earnedAt: Date
  questId: string
}

export interface NFTProofOfContribution {
  id: string
  tokenId: string
  mintedAt: Date
  shardsUsed: Shard[]
  status: "minted" | "pending"
  metadata: {
    totalInteractions: number
    totalReviews: number
    totalReports: number
  }
}

export interface GameProgress {
  userId: string
  quests: QuestProgress[]
  shards: Shard[]
  nfts: NFTProofOfContribution[]
  totalContribution: number
}

export interface VoiceSettings {
  enabled: boolean
  voice: "lia" | "jaki"
}

export interface ImageAnalysisRequest {
  imageData: string
  question: string
}

export interface ImageAnalysisResponse {
  analysis: string
  suggestions: string[]
}

export interface KnowledgeGapData {
  questionCategory: string
  popularityScore: number // 0-100
  askedToday: number
  trendingRank?: number
  relatedQuestions: string[]
  community_awareness_score: number // 0-100 from backend API
  justification?: string // Short text explanation from backend
}

export interface SourceConfidenceData {
  score: number // 0-100
  isVerified: boolean
  isRumor: boolean
  officialStatement?: string
  sources?: string[]
  explanation: string
  confidence_score_justification?: string // Short text from backend API
}

export interface MessageWithKnowledgeGap extends Message {
  knowledgeGap?: KnowledgeGapData
}

export interface AnonymizedQuestionData {
  questionHash: string // Hashed question for anonymity
  category: string
  timestamp: number
  count: number // Aggregated count only
}

export interface PrivacyConfig {
  enableAnonymization: boolean
  retainPersonalData: boolean
  aggregationOnly: boolean
}

export interface ModeratorServer {
  serverId: string
  moderatorId: string
  moderatorUsername: string
  isVerified: boolean
  specialization: string[]
  availableHours?: string
  language: string[]
  joinedAt: Date
}

export interface UserChannel {
  channelId: string
  ownerId: string
  ownerUsername: string
  channelName: string
  description: string
  isVerified: boolean
  subscribers: number
  createdAt: Date
  isActive: boolean
  moderatedByAI: boolean
  helpStats: {
    totalHelps: number
    successRate: number
    averageRating: number
  }
}

export interface ShareData {
  title: string
  text: string
  url: string
}

export interface EncryptedMessage extends CommunityMessage {
  encrypted: boolean
  encryptedContent?: string
  senderPublicKey?: string
  e2eeMetadata?: {
    algorithm: string
    keyExchanged: boolean
    verified: boolean
  }
}

export interface EphemeralMessageConfig {
  ttlSeconds: number // Time to live in seconds
  autoDelete: boolean
  ramOnly: boolean
}

export interface E2EEConfig {
  enabled: boolean
  keyExchangeComplete: boolean
  publicKey?: string
  ephemeralConfig: EphemeralMessageConfig
}

export interface AchievementLog {
  achievementId: string
  channelId: string
  ownerId: string
  ownerUsername: string
  achievementType: "high_rating" | "milestone_helps" | "verified_channel" | "community_star"
  rating?: number
  helpCount?: number
  timestamp: Date
  metadata: {
    description: string
    value: number
  }
}

export interface NFTGeneratorLog {
  logId: string
  channelId: string
  ownerId: string
  achievements: AchievementLog[]
  proofHash: string // SHA-256 hash of aggregated achievements
  generatedAt: Date
  readyForMinting: boolean
  metadata: {
    totalRating: number
    totalHelps: number
    successRate: number
    verifiedChannel: boolean
  }
}

export interface ChannelReputation {
  channelId: string
  ownerId: string
  reputationScore: number // 0-1000
  achievements: AchievementLog[]
  nftLogs: NFTGeneratorLog[]
  lastUpdated: Date
}

export interface JoinedChannel {
  channelId: string
  channelName: string
  ownerUsername: string
  joinedAt: Date
  unreadCount: number
  lastMessageAt?: Date
}

export interface ChannelNotification {
  id: string
  channelId: string
  channelName: string
  message: string
  senderUsername: string
  timestamp: Date
  read: boolean
}

export interface VerifiedModerator {
  moderatorId: string
  piUsername: string
  addedBy: string
  addedAt: Date
  permissions: ModeratorPermissions
  isActive: boolean
  specialization?: string[]
  language?: string[]
}

export interface ModeratorPermissions {
  canModerateChat: boolean
  canReviewReports: boolean
  canManageContent: boolean
  canAccessAnalytics: boolean
}

export interface Advertisement {
  adId: string
  title: string
  description: string
  imageUrl?: string
  targetUrl: string
  isActive: boolean
  displayType: "banner" | "interstitial" | "native"
  priority: number
  impressions: number
  clicks: number
  revenue: number
  createdAt: Date
  updatedAt: Date
}

export interface AdSettings {
  userId: string
  adsEnabled: boolean
  earnedRevenue: number
  revenueSharePercentage: number
  features: string[]
  lastUpdated: Date
}

export interface AdminConfig {
  isAdmin: boolean
  canManageModerators: boolean
  canManageAds: boolean
  canAccessAllSections: boolean
}
