import { query, isDatabaseConfigured } from "./db"
import type { SupportedLanguage } from "./translations"

// Sync user activity to database
export async function syncUserActivity(userId: string, activityType: string, metadata?: any) {
  if (!isDatabaseConfigured()) {
    console.warn("[System Sync] Database not configured, skipping sync")
    return false
  }

  try {
    await query(
      `INSERT INTO reputation_activities (user_id, activity_type, points_change, description)
       VALUES ($1, $2, $3, $4)`,
      [userId, activityType, metadata?.points || 0, JSON.stringify(metadata)],
    )
    return true
  } catch (error) {
    console.error("[System Sync] Failed to sync user activity:", error)
    return false
  }
}

// Update user language preference in database
export async function syncLanguagePreference(userId: string, language: SupportedLanguage) {
  if (!isDatabaseConfigured()) {
    return false
  }

  try {
    await query(`UPDATE user_settings SET language = $1, updated_at = NOW() WHERE user_id = $2`, [language, userId])
    return true
  } catch (error) {
    console.error("[System Sync] Failed to sync language:", error)
    return false
  }
}

// Get user profile with all stats
export async function getUserProfile(userId: string) {
  if (!isDatabaseConfigured()) {
    return null
  }

  try {
    const result = await query(
      `SELECT u.*, us.language, us.theme
       FROM users u
       LEFT JOIN user_settings us ON us.user_id = u.id
       WHERE u.id = $1`,
      [userId],
    )
    return result.rows[0] || null
  } catch (error) {
    console.error("[System Sync] Failed to get user profile:", error)
    return null
  }
}

// Sync referral activity
export async function syncReferralActivity(referredUserId: string, activityType: string, amount: number) {
  if (!isDatabaseConfigured()) {
    return false
  }

  try {
    // Call the pay_referral_commission function
    await query(`SELECT pay_referral_commission($1, $2, $3)`, [referredUserId, activityType, amount])
    return true
  } catch (error) {
    console.error("[System Sync] Failed to sync referral:", error)
    return false
  }
}
