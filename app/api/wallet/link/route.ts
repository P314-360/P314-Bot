import { type NextRequest, NextResponse } from "next/server"
import { getUsersCollection } from "@/lib/mongodb-server"

export async function POST(req: NextRequest) {
  try {
    const { userId, walletAddress } = await req.json()

    if (!userId || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // SECURITY CHECK: Ensure we're not receiving any sensitive data.
    // Public wallet addresses are typically 56 characters (Pi Network format)
    if (walletAddress.length > 100 || walletAddress.includes(" ")) {
      return NextResponse.json(
        { error: "Invalid wallet address format. Only public addresses accepted." },
        { status: 400 },
      )
    }

    const usersCollection = await getUsersCollection()

    // Update user with ONLY public wallet address (never store private keys or passphrases)
    await usersCollection.updateOne(
      { piUid: userId },
      {
        $set: {
          walletAddress,
          walletLinkedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Wallet linked successfully",
    })
  } catch (error) {
    console.error("Wallet link error:", error)
    return NextResponse.json({ error: "Failed to link wallet" }, { status: 500 })
  }
}
