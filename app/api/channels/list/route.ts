// ═══════════════════════════════════════════════════════════════════════════════
// Get Channels List API - MongoDB Version
// ═══════════════════════════════════════════════════════════════════════════════

import { type NextRequest, NextResponse } from "next/server"
import { getChannelsCollection } from "@/lib/mongodb-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = parseInt(searchParams.get("skip") || "0")
    const limit = parseInt(searchParams.get("limit") || "50")
    const sort = searchParams.get("sort") || "-createdAt"

    // Parse sort parameter
    const sortObj: any = {}
    if (sort.startsWith("-")) {
      sortObj[sort.substring(1)] = -1
    } else {
      sortObj[sort] = 1
    }

    const channelsCollection = await getChannelsCollection()

    // Get total count
    const total = await channelsCollection.countDocuments()

    // Get channels with pagination and sorting
    const channels = await channelsCollection
      .find({})
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json(
      {
        success: true,
        channels,
        pagination: {
          total,
          skip,
          limit,
          hasMore: skip + limit < total,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[API] Get channels list error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch channels",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
