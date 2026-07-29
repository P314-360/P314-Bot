// ═══════════════════════════════════════════════════════════════════════════════
// Initialize User API - MongoDB Version
// ═══════════════════════════════════════════════════════════════════════════════

import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection } from "@/lib/mongodb-server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { piUid, piUsername, roles, kycVerified } = await request.json()

    // Validate required fields
    if (!piUid || !piUsername) {
      return NextResponse.json(
        { error: "Missing required fields: piUid, piUsername" },
        { status: 400 }
      )
    }

    const usersCollection = await getUsersCollection()

    // Check if user exists
    const existingUser = await usersCollection.findOne({ piUid })

    let user
    if (existingUser) {
      // Update existing user
      const updateResult = await usersCollection.updateOne(
        { piUid },
        {
          $set: {
            piUsername,
            roles: roles || existingUser.roles || [],
            kycVerified: kycVerified || existingUser.kycVerified || false,
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }
      )

      user = await usersCollection.findOne({ piUid })
    } else {
      // Create new user
      const newUser = {
        piUid,
        piUsername,
        roles: roles || [],
        kycVerified: kycVerified || false,
        email: null,
        reputation: {
          score: 0,
          level: "Pioneer",
          rank: 1,
          multiplier: 1,
        },
        wallet: {
          address: null,
          verified: false,
        },
        settings: {
          theme: "dark",
          securityAlerts: true,
          language: "en",
          emailNotifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
      }

      const insertResult = await usersCollection.insertOne(newUser)
      user = {
        _id: insertResult.insertedId,
        ...newUser,
      }
    }

    // Ensure user settings exist
    const db = await getDatabase()
    const settingsCollection = db.collection("userSettings")

    await settingsCollection.updateOne(
      { userId: user._id },
      {
        $set: {
          theme: "dark",
          securityAlerts: true,
          language: "en",
          emailNotifications: true,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    )

    console.log(`[API] User initialized: ${piUid}`)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          piUid: user.piUid,
          piUsername: user.piUsername,
          roles: user.roles,
          kycVerified: user.kycVerified,
          reputation: user.reputation,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[API] Init user error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
