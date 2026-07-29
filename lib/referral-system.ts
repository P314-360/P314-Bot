// Smart Referral System - MongoDB Version
// Handles referral link generation, tracking, and commission distribution

import { getDatabase } from "./mongodb"

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export interface ReferralLink {
  referralCode: string
  referralUrl: string
  totalReferrals: number
  activatedReferrals: number
  totalEarnings: number
}

export interface ReferralStats {
  userId: string
  referralCode: string
  clicksCount: number
  successfulSignups: number
  activatedReferrals: number
  totalReferrals: number
  activeReferrals: number
  totalCommissionsEarned: number
  avgReferralValue: number
  createdAt: Date
}

export interface ReferralCommission {
  id: string
  referrerId: string
  referredUserId: string
  activityType: string
  originalAmount: number
  commissionAmount: number
  commissionRate: number
  paidAt: Date
}

export class ReferralSystem {
  // Generate or get existing referral link for user
  static async getOrCreateReferralLink(userId: string): Promise<ReferralLink | null> {
    try {
      const db = await getDatabase()
      const referralCollection = db.collection("referrals")

      let referral = await referralCollection.findOne({ referrerId: userId })

      if (!referral) {
        const referralCode = generateReferralCode()
        const referralDoc = {
          referrerId: userId,
          referralCode,
          referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/referral?code=${referralCode}`,
          totalReferrals: 0,
          activatedReferrals: 0,
          totalEarnings: 0,
          createdAt: new Date().toISOString(),
        }
        await referralCollection.insertOne(referralDoc)
        referral = await referralCollection.findOne({ referrerId: userId })
      }

      if (!referral) return null

      return {
        referralCode: referral.referralCode as string,
        referralUrl: referral.referralUrl as string,
        totalReferrals: (referral.totalReferrals as number) || 0,
        activatedReferrals: (referral.activatedReferrals as number) || 0,
        totalEarnings: (referral.totalEarnings as number) || 0,
      }
    } catch (error) {
      console.error("Error getting referral link:", error)
      return null
    }
  }

  // Track when someone clicks a referral link
  static async trackClick(referralCode: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      const referralClicks = db.collection("referralClicks")
      await referralClicks.insertOne({
        referralCode,
        clickedAt: new Date().toISOString(),
      })
      return true
    } catch (error) {
      console.error("Error tracking referral click:", error)
      return false
    }
  }

  // Register a new user with a referral code
  static async registerWithReferral(newUserId: string, referralCode: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      const referrals = db.collection("referrals")

      const referral = await referrals.findOne({ referralCode })
      if (!referral) return false

      await referrals.updateOne(
        { referralCode },
        {
          $push: {
            referredUsers: {
              userId: newUserId,
              activatedAt: null,
              isActivated: false,
              createdAt: new Date().toISOString(),
            },
          },
          $inc: { totalReferrals: 1 },
        }
      )

      return true
    } catch (error) {
      console.error("Error registering with referral:", error)
      return false
    }
  }

  // Activate referral after first meaningful activity
  static async activateReferral(referredUserId: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      const referrals = db.collection("referrals")

      await referrals.updateOne(
        { "referredUsers.userId": referredUserId },
        {
          $set: { "referredUsers.$.isActivated": true, "referredUsers.$.activatedAt": new Date().toISOString() },
          $inc: { activatedReferrals: 1 },
        }
      )

      return true
    } catch (error) {
      console.error("Error activating referral:", error)
      return false
    }
  }

  // Distribute commission to referrer
  static async distributeCommission(referredUserId: string, rewardAmount: number, activityType: string, activityId?: string): Promise<number> {
    try {
      const commission = rewardAmount * 0.05
      const db = await getDatabase()
      const commissions = db.collection("referralCommissions")

      await commissions.insertOne({
        referredUserId,
        commissionAmount: commission,
        originalAmount: rewardAmount,
        activityType,
        activityId: activityId || null,
        createdAt: new Date().toISOString(),
      })

      return commission
    } catch (error) {
      console.error("Error distributing commission:", error)
      return 0
    }
  }

  // Get detailed referral stats for a user
  static async getReferralStats(userId: string): Promise<ReferralStats | null> {
    try {
      const db = await getDatabase()
      const referrals = db.collection("referrals")
      const referral = await referrals.findOne({ referrerId: userId })

      if (!referral) return null

      return {
        userId,
        referralCode: referral.referralCode,
        clicksCount: referral.clicksCount || 0,
        successfulSignups: referral.totalReferrals || 0,
        activatedReferrals: referral.activatedReferrals || 0,
        totalReferrals: referral.totalReferrals || 0,
        activeReferrals: referral.activatedReferrals || 0,
        totalCommissionsEarned: referral.totalEarnings || 0,
        avgReferralValue: referral.totalEarnings && referral.totalReferrals ? referral.totalEarnings / referral.totalReferrals : 0,
        createdAt: new Date(referral.createdAt),
      }
    } catch (error) {
      console.error("Error getting referral stats:", error)
      return null
    }
  }

  // Get referral commission history
  static async getCommissionHistory(referrerId: string, limit = 50): Promise<ReferralCommission[]> {
    try {
      const db = await getDatabase()
      const commissions = db.collection("referralCommissions")

      const result = await commissions
        .find({ referrerId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray()

      return result.map((row) => ({
        id: row._id.toString(),
        referrerId: row.referrerId,
        referredUserId: row.referredUserId,
        activityType: row.activityType,
        originalAmount: row.originalAmount,
        commissionAmount: row.commissionAmount,
        commissionRate: 0.05,
        paidAt: new Date(row.createdAt),
      }))
    } catch (error) {
      console.error("Error getting commission history:", error)
      return []
    }
  }

  // Get list of referred users
  static async getReferredUsers(referrerId: string): Promise<any[]> {
    try {
      const db = await getDatabase()
      const referrals = db.collection("referrals")
      const users = db.collection("users")

      const referral = await referrals.findOne({ referrerId })
      if (!referral || !referral.referredUsers) return []

      const userIds = referral.referredUsers.map((r: any) => r.userId)
      const usersList = await users.find({ _id: { $in: userIds } }).toArray()

      return referral.referredUsers.map((ref: any) => {
        const user = usersList.find((u) => u._id.toString() === ref.userId)
        return {
          userId: ref.userId,
          username: user?.piUsername || "Unknown",
          isActivated: ref.isActivated,
          firstActivityAt: ref.activatedAt ? new Date(ref.activatedAt) : null,
          totalCommissionEarned: 0,
          lifetimeValue: 0,
          reputationPoints: user?.reputation?.score || 0,
          userLevel: user?.reputation?.level || "Pioneer",
          joinedAt: new Date(ref.createdAt),
        }
      })
    } catch (error) {
      console.error("Error getting referred users:", error)
      return []
    }
  }
}
