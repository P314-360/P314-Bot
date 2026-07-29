import { getCollection } from "./mongodb-server"
import type { SupportedLanguage } from "./translations"

// Sync user activity to MongoDB
export async function syncUserActivity(userId: string, activityType: string, metadata?: Record<string, unknown>) {
  try {
    const col = await getCollection("userActivityLog")
    await col.insertOne({
      userId,
      activityType,
      points: metadata?.points ?? 0,
      metadata: metadata ?? {},
      createdAt: new Date(),
    })
    return true
  } catch (error) {
    console.error("[System Sync] Failed to sync user activity:", error)
    return false
  }
}

// Update user language preference in MongoDB
export async function syncLanguagePreference(userId: string, language: SupportedLanguage) {
  try {
    const col = await getCollection("userSettings")
    await col.updateOne(
      { userId },
      { $set: { language, updatedAt: new Date() } },
      { upsert: true },
    )
    return true
  } catch (error) {
    console.error("[System Sync] Failed to sync language:", error)
    return false
  }
}

// Get user profile with all stats
export async function getUserProfile(userId: string) {
  try {
    const users = await getCollection("users")
    const settings = await getCollection("userSettings")

    const user = await users.findOne({ piUid: userId })
    if (!user) return null

    const userSettings = await settings.findOne({ userId })

    return {
      ...user,
      language: userSettings?.language ?? "en",
      theme: userSettings?.theme ?? "dark",
    }
  } catch (error) {
    console.error("[System Sync] Failed to get user profile:", error)
    return null
  }
}

// Sync referral activity
export async function syncReferralActivity(referredUserId: string, activityType: string, amount: number) {
  try {
    const col = await getCollection("referralCommissions")
    await col.insertOne({
      sourceUserId: referredUserId,
      activityType,
      amount,
      createdAt: new Date(),
    })
    return true
  } catch (error) {
    console.error("[System Sync] Failed to sync referral:", error)
    return false
  }
}
