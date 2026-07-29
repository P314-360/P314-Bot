#!/usr/bin/env node

/**
 * P314 Bot - MongoDB Staging Cluster Initialization
 * Initializes staging database with collections, validation schemas, and indexes
 * Usage: node scripts/04-staging-mongodb-setup.js
 */

require("dotenv").config({ path: ".env.staging" });

const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "p314_staging";

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

async function setupStagingDatabase() {
  try {
    console.log("[P314] Connecting to MongoDB staging cluster...");
    await client.connect();

    const db = client.db(DB_NAME);
    console.log(`[P314] Connected to database: ${DB_NAME}`);

    // ═══════════════════════════════════════════════════════════════
    // 1. Create Collections with Validation Schemas
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating collections with validation schemas...");

    // Users Collection
    await createCollectionIfNotExists(db, "users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["piUid", "createdAt"],
          properties: {
            piUid: { bsonType: "string", description: "Unique Pi Network ID" },
            username: { bsonType: "string" },
            email: { bsonType: "string" },
            walletAddress: { bsonType: "string" },
            kycStatus: { enum: ["pending", "verified", "rejected"] },
            reputation: { bsonType: "int", minimum: 0 },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });
    console.log("✓ users collection created");

    // Messages Collection
    await createCollectionIfNotExists(db, "messages");
    console.log("✓ messages collection created");

    // Sessions Collection
    await createCollectionIfNotExists(db, "sessions");
    console.log("✓ sessions collection created");

    // Channels Collection
    await createCollectionIfNotExists(db, "channels");
    console.log("✓ channels collection created");

    // Reputation Collection
    await createCollectionIfNotExists(db, "reputation");
    console.log("✓ reputation collection created");

    // Wallets Collection
    await createCollectionIfNotExists(db, "wallets");
    console.log("✓ wallets collection created");

    // Transactions Collection
    await createCollectionIfNotExists(db, "transactions");
    console.log("✓ transactions collection created");

    // Fraud Reports Collection
    await createCollectionIfNotExists(db, "fraudReports");
    console.log("✓ fraudReports collection created");

    // Bounties Collection
    await createCollectionIfNotExists(db, "bounties");
    console.log("✓ bounties collection created");

    // Quests Collection
    await createCollectionIfNotExists(db, "quests");
    console.log("✓ quests collection created");

    // Admin Revenue Collection
    await createCollectionIfNotExists(db, "adminRevenue");
    console.log("✓ adminRevenue collection created");

    // ═══════════════════════════════════════════════════════════════
    // 2. Create Indexes for Performance
    // ═══════════════════════════════════════════════════════════════

    console.log("\n[P314] Creating indexes for performance...");

    // Users Indexes
    await db.collection("users").createIndex({ piUid: 1 }, { unique: true });
    await db.collection("users").createIndex({ email: 1 }, { sparse: true });
    await db.collection("users").createIndex({ createdAt: -1 });
    console.log("✓ users indexes created");

    // Messages Indexes
    await db
      .collection("messages")
      .createIndex({ sessionId: 1, createdAt: -1 });
    await db.collection("messages").createIndex({ userId: 1 });
    console.log("✓ messages indexes created");

    // Sessions Indexes
    await db
      .collection("sessions")
      .createIndex({ piUid: 1 }, { sparse: true });
    await db
      .collection("sessions")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    console.log("✓ sessions indexes created");

    // Channels Indexes
    await db.collection("channels").createIndex({ name: 1 }, { unique: true });
    await db
      .collection("channels")
      .createIndex({ members: 1 }, { sparse: true });
    console.log("✓ channels indexes created");

    // Reputation Indexes
    await db.collection("reputation").createIndex({ userId: 1 });
    await db
      .collection("reputation")
      .createIndex({ score: -1, updatedAt: -1 });
    console.log("✓ reputation indexes created");

    // Wallets Indexes
    await db
      .collection("wallets")
      .createIndex({ address: 1 }, { unique: true, sparse: true });
    await db.collection("wallets").createIndex({ userId: 1 });
    console.log("✓ wallets indexes created");

    // Transactions Indexes
    await db
      .collection("transactions")
      .createIndex({ senderId: 1, createdAt: -1 });
    await db
      .collection("transactions")
      .createIndex({ receiverId: 1, createdAt: -1 });
    await db
      .collection("transactions")
      .createIndex({ status: 1, createdAt: -1 });
    console.log("✓ transactions indexes created");

    // Fraud Reports Indexes
    await db
      .collection("fraudReports")
      .createIndex({ reporterId: 1, createdAt: -1 });
    await db
      .collection("fraudReports")
      .createIndex({ status: 1, createdAt: -1 });
    console.log("✓ fraudReports indexes created");

    // Bounties Indexes
    await db.collection("bounties").createIndex({ status: 1 });
    await db
      .collection("bounties")
      .createIndex({ createdAt: -1, reward: -1 });
    console.log("✓ bounties indexes created");

    // Quests Indexes
    await db.collection("quests").createIndex({ userId: 1 });
    await db
      .collection("quests")
      .createIndex({ status: 1, completedAt: -1 });
    console.log("✓ quests indexes created");

    // Admin Revenue Indexes
    await db
      .collection("adminRevenue")
      .createIndex({ type: 1, createdAt: -1 });
    console.log("✓ adminRevenue indexes created");

    // ═══════════════════════════════════════════════════════════════
    // 3. Verify Collections and Indexes
    // ═══════════════════════════════════════════════════════════════

    console.log(
      "\n[P314] Verifying collections and indexes in staging database...",
    );

    const collections = await db.listCollections().toArray();
    console.log(
      `✓ Total collections: ${collections.length}`,
    );
    collections.forEach((col) => console.log(`  - ${col.name}`));

    console.log("\n[P314] Checking indexes...");
    for (const col of collections) {
      const indexes = await db.collection(col.name).listIndexes().toArray();
      console.log(
        `✓ ${col.name}: ${indexes.length} index(es)`,
      );
    }

    console.log("\n═══════════════════════════════════════════════════════════════");
    console.log("[P314] MongoDB Staging Setup Complete!");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("\nNext steps:");
    console.log("1. Load test data: node scripts/seed-staging-data.js");
    console.log("2. Test API routes with: pnpm test:api");
    console.log("3. Verify Pi Network connection");
    console.log("4. Deploy to Vercel staging environment");
  } catch (error) {
    console.error("[P314] Error during setup:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

async function createCollectionIfNotExists(db, name, options = {}) {
  try {
    const collections = await db.listCollections({ name }).toArray();
    if (collections.length === 0) {
      await db.createCollection(name, options);
    }
  } catch (error) {
    // Collection might already exist
    if (!error.message.includes("already exists")) {
      throw error;
    }
  }
}

// Run setup
setupStagingDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
