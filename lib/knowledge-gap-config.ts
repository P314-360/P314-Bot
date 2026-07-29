export const KNOWLEDGE_GAP_CONFIG = {
  ENDPOINT: "/v1/knowledge-gap/analyze",
  CACHE_DURATION: 300000, // 5 minutes in milliseconds
  MOCK_MODE: true, // Set to false when backend is ready
} as const

// Mock data generator for development
export const generateMockKnowledgeGap = (question: string) => {
  const categories = ["KYC Verification", "Mainnet", "Wallet", "Mining", "Account Settings", "Security"]
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const randomPopularity = Math.floor(Math.random() * 100)
  const randomAsked = Math.floor(Math.random() * 500) + 10

  return {
    questionCategory: randomCategory,
    popularityScore: randomPopularity,
    askedToday: randomAsked,
    trendingRank: randomPopularity >= 70 ? Math.floor(Math.random() * 5) + 1 : undefined,
    relatedQuestions: [
      `How to ${randomCategory.toLowerCase()}?`,
      `What is ${randomCategory.toLowerCase()}?`,
      `When will ${randomCategory.toLowerCase()} be available?`,
    ],
    // Required by KnowledgeGapData interface — mirrors popularityScore in mock mode
    community_awareness_score: randomPopularity,
  }
}
