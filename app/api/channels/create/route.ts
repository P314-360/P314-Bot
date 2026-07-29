// ═══════════════════════════════════════════════════════════════════════════════
// Create Channel API - MongoDB Version
// ═══════════════════════════════════════════════════════════════════════════════

import { type NextRequest, NextResponse } from "next/server"
import { getChannelsCollection, findUserByPiUid } from "@/lib/mongodb-server"
import { P314_CONFIG } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const { name, description, ownerUsername, ownerPiUid } = await request.json()

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, description" },
        { status: 400 }
      )
    }

    if (!ownerUsername || !ownerPiUid) {
      return NextResponse.json(
        { error: "Missing owner information" },
        { status: 400 }
      )
    }

    // Validate name length
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Channel name must be less than 100 characters" },
        { status: 400 }
      )
    }

    // Verify user exists and get ID
    const owner = await findUserByPiUid(ownerPiUid)
    if (!owner) {
      return NextResponse.json(
        { error: "Owner not found" },
        { status: 404 }
      )
    }

    const channelsCollection = await getChannelsCollection()

    // Check for duplicate channel name
    const existingChannel = await channelsCollection.findOne({ name })
    if (existingChannel) {
      return NextResponse.json(
        { error: "Channel name already exists" },
        { status: 409 }
      )
    }

    // Create new channel
    const newChannel = {
      name,
      description,
      ownerId: owner._id,
      ownerUsername,
      ownerPiUid,
      members: [owner._id],
      subscribers: 1,
      isVerified: false,
      aiModerated: true,
      isPublic: true,
      reputationScore: 0,
      settings: {
        autoModeration: true,
        messageEncryption: true,
        requireVerification: false,
      },
      stats: {
        totalMessages: 0,
        totalMembers: 1,
        averageRating: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const insertResult = await channelsCollection.insertOne(newChannel)

    console.log(`[API] Channel created: ${name} by ${ownerUsername}`)

    return NextResponse.json(
      {
        success: true,
        channel: {
          _id: insertResult.insertedId,
          ...newChannel,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Create channel error:", error)
    return NextResponse.json(
      {
        error: "Failed to create channel",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
