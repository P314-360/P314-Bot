#!/usr/bin/env node

/**
 * P314 Bot - Staging Data Seeding Script
 * Creates test data for staging environment testing
 * Usage: node scripts/05-seed-staging-data.js
 */

require("dotenv").config({ path: ".env.staging" });

const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "p314_staging";

const client = new MongoClient(MONGODB_URI);

async function seedStagingData() {
  try {
    console.log("[P314] Connecting to MongoDB staging cluster...");
    await client.connect();

    const db = client.db(DB_NAME);
    console.log(`[P314] Connected to database: ${DB_NAME}`);

    // ═══════════════════════════════════════════════════════════════
    // 1. Create Test Users
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating test users...");

    const testUsers = [
      {
        piUid: "test-user-001",
        username: "testuser001",
        email: "test001@example.com",
        walletAddress: "pi1test001wallet",
        kycStatus: "verified",
        reputation: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        piUid: "test-user-002",
        username: "testuser002",
        email: "test002@example.com",
        walletAddress: "pi1test002wallet",
        kycStatus: "pending",
        reputation: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        piUid: "test-user-003",
        username: "testuser003",
        email: "test003@example.com",
        walletAddress: "pi1test003wallet",
        kycStatus: "verified",
        reputation: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const usersResult = await db.collection("users").insertMany(testUsers, {
      ordered: false,
    });
    console.log(
      `✓ Created ${usersResult.insertedIds.length} test users`,
    );

    // ═══════════════════════════════════════════════════════════════
    // 2. Create Test Channels
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating test channels...");

    const testChannels = [
      {
        name: "general",
        description: "General discussion channel",
        members: ["test-user-001", "test-user-002", "test-user-003"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "support",
        description: "Technical support channel",
        members: ["test-user-001", "test-user-003"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "announcements",
        description: "Official announcements",
        members: ["test-user-001", "test-user-002", "test-user-003"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const channelsResult = await db
      .collection("channels")
      .insertMany(testChannels, { ordered: false });
    console.log(
      `✓ Created ${channelsResult.insertedIds.length} test channels`,
    );

    // ═══════════════════════════════════════════════════════════════
    // 3. Create Test Messages
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating test messages...");

    const testMessages = [
      {
        sessionId: "session-001",
        userId: "test-user-001",
        text: "Hello, welcome to P314 Bot!",
        timestamp: new Date(),
        createdAt: new Date(),
      },
      {
        sessionId: "session-001",
        userId: "test-user-002",
        text: "Thanks! Excited to test this out",
        timestamp: new Date(Date.now() + 1000),
        createdAt: new Date(),
      },
      {
        sessionId: "session-002",
        userId: "test-user-003",
        text: "How do I complete quests?",
        timestamp: new Date(),
        createdAt: new Date(),
      },
    ];

    const messagesResult = await db
      .collection("messages")
      .insertMany(testMessages, { ordered: false });
    console.log(
      `✓ Created ${messagesResult.insertedIds.length} test messages`,
    );

    // ═══════════════════════════════════════════════════════════════
    // 4. Create Test Reputation Records
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating test reputation records...");

    const testReputation = [
      {
        userId: "test-user-001",
        score: 100,
        activities: ["message", "quest_complete", "referral"],
        updatedAt: new Date(),
      },
      {
        userId: "test-user-002",
        score: 50,
        activities: ["message", "quest_complete"],
        updatedAt: new Date(),
      },
      {
        userId: "test-user-003",
        score: 250,
        activities: [
          "message",
          "quest_complete",
          "referral",
          "bounty_complete",
        ],
        updatedAt: new Date(),
      },
    ];

    const reputationResult = await db
      .collection("reputation")
      .insertMany(testReputation, { ordered: false });
    console.log(
      `✓ Created ${reputationResult.insertedIds.length} reputation records`,
    );

    // ═══════════════════════════════════════════════════════════════
    // 5. Create Test Wallets
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating test wallets...");

    const testWallets = [
      {
        userId: "test-user-001",
        address: "pi1test001wallet",
        verified: true,
        balance: 1000,
        createdAt: new Date(),
      },
      {
        userId: "test-user-002",
        address: "pi1test002wallet",
        verified: false,
        balance: 500,
        createdAt: new Date(),
      },
      {
        userId: "test-user-003",
        address: "pi1test003wallet",
        verified: true,
        balance: 5000,
        createdAt: new Date(),
      },
    ];

    const walletsResult = await db
      .collection("wallets")
      .insertMany(testWallets, { ordered: false });
    console.log(
      `✓ Created ${walletsResult.insertedIds.length} test wallets`,
    );

    // ═══════════════════════════════════════════════════════════════
    // 6. Create Test Transactions
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating test transactions...");

    const testTransactions = [
      {
        senderId: "test-user-001",
        receiverId: "test-user-002",
        amount: 100,
        status: "completed",
        createdAt: new Date(),
      },
      {
        senderId: "test-user-003",
        receiverId: "test-user-001",
        amount: 50,
        status: "completed",
        createdAt: new Date(),
      },
      {
        senderId: "test-user-002",
        receiverId: "test-user-003",
        amount: 25,
        status: "pending",
        createdAt: new Date(),
      },
    ];

    const transactionsResult = await db
      .collection("transactions")
      .insertMany(testTransactions, { ordered: false });
    console.log(
      `✓ Created ${transactionsResult.insertedIds.length} test transactions`,
    );

    // ═══════════════════════════════════════════════════════════════
    // 7. Create Test Bounties
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating test bounties...");

    const testBounties = [
      {
        title: "Test Bounty #1",
        description: "First test bounty",
        reward: 100,
        status: "open",
        createdBy: "test-user-001",
        createdAt: new Date(),
      },
      {
        title: "Test Bounty #2",
        description: "Second test bounty",
        reward: 250,
        status: "in_progress",
        createdBy: "test-user-003",
        createdAt: new Date(),
      },
    ];

    const bountiesResult = await db
      .collection("bounties")
      .insertMany(testBounties, { ordered: false });
    console.log(
      `✓ Created ${bountiesResult.insertedIds.length} test bounties`,
    );

    // ═══════════════════════════════════════════════════════════════
    // 8. Summary
    // ═══════════════════════════════════════════════════════════════

    console.log("\n═══════════════════════════════════════════════════════════════");
    console.log("[P314] Staging Data Seeding Complete!");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("\nTest Data Summary:");
    console.log(`- Users: ${usersResult.insertedIds.length}`);
    console.log(`- Channels: ${channelsResult.insertedIds.length}`);
    console.log(`- Messages: ${messagesResult.insertedIds.length}`);
    console.log(`- Reputation: ${reputationResult.insertedIds.length}`);
    console.log(`- Wallets: ${walletsResult.insertedIds.length}`);
    console.log(`- Transactions: ${transactionsResult.insertedIds.length}`);
    console.log(`- Bounties: ${bountiesResult.insertedIds.length}`);
    console.log("\nLogin Test Credentials:");
    console.log("- piUid: test-user-001, username: testuser001");
    console.log("- piUid: test-user-002, username: testuser002");
    console.log("- piUid: test-user-003, username: testuser003");
  } catch (error) {
    console.error("[P314] Error seeding data:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run seeding
seedStagingData().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
