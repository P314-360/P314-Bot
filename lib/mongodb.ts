// ═══════════════════════════════════════════════════════════════════════════════
// MongoDB Connection & Client Management
// ═══════════════════════════════════════════════════════════════════════════════

import { MongoClient, Db, Collection } from "mongodb"
import { env } from "./env"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

/**
 * Connect to MongoDB using connection pooling
 * Returns cached connection if already established
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!env.mongodbUri) {
    throw new Error("[MongoDB] MONGODB_URI is not configured in environment variables")
  }

  try {
    console.log("[MongoDB] Connecting to database...")

    const client = new MongoClient(env.mongodbUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    })

    await client.connect()

    // Test connection
    await client.db("admin").command({ ping: 1 })
    console.log("[MongoDB] ✓ Connected successfully")

    const db = client.db(env.mongodbDbName)

    // Cache for reuse
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error)
    throw new Error(`[MongoDB] Failed to connect: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get cached database instance
 */
export async function getDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }

  const { db } = await connectToDatabase()
  return db
}

/**
 * Get specific collection with type safety
 */
export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase()
  return db.collection<T>(collectionName)
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cachedClient) {
    try {
      await cachedClient.close()
      console.log("[MongoDB] ✓ Disconnected successfully")
    } catch (error) {
      console.error("[MongoDB] Error during disconnect:", error)
    } finally {
      cachedClient = null
      cachedDb = null
    }
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (!cachedClient) {
      return false
    }

    await cachedClient.db("admin").command({ ping: 1 })
    return true
  } catch (error) {
    console.error("[MongoDB] Health check failed:", error)
    return false
  }
}

/**
 * Initialize database collections with indexes
 */
export async function initializeDatabaseCollections(): Promise<void> {
  try {
    const db = await getDatabase()

    console.log("[MongoDB] Initializing collections...")

    // Users collection
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ piUid: 1 }, { unique: true })
    await usersCollection.createIndex({ email: 1 }, { sparse: true })
    await usersCollection.createIndex({ createdAt: -1 })
    console.log("[MongoDB] ✓ Users collection initialized")

    // Sessions collection
    const sessionsCollection = db.collection("sessions")
    await sessionsCollection.createIndex({ userId: 1 })
    await sessionsCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    console.log("[MongoDB] ✓ Sessions collection initialized")

    // Messages collection
    const messagesCollection = db.collection("messages")
    await messagesCollection.createIndex({ userId: 1, createdAt: -1 })
    await messagesCollection.createIndex({ channelId: 1, createdAt: -1 })
    await messagesCollection.createIndex({ createdAt: -1 })
    console.log("[MongoDB] ✓ Messages collection initialized")

    // Channels collection
    const channelsCollection = db.collection("channels")
    await channelsCollection.createIndex({ name: 1 })
    await channelsCollection.createIndex({ ownerId: 1 })
    await channelsCollection.createIndex({ createdAt: -1 })
    console.log("[MongoDB] ✓ Channels collection initialized")

    // Quests collection
    const questsCollection = db.collection("quests")
    await questsCollection.createIndex({ userId: 1 })
    await questsCollection.createIndex({ status: 1 })
    console.log("[MongoDB] ✓ Quests collection initialized")

    // Reputation collection
    const reputationCollection = db.collection("reputation")
    await reputationCollection.createIndex({ userId: 1 })
    await reputationCollection.createIndex({ score: -1 })
    console.log("[MongoDB] ✓ Reputation collection initialized")

    // Fraud reports collection
    const fraudReportsCollection = db.collection("fraudReports")
    await fraudReportsCollection.createIndex({ reportedUserId: 1 })
    await fraudReportsCollection.createIndex({ status: 1 })
    await fraudReportsCollection.createIndex({ createdAt: -1 })
    console.log("[MongoDB] ✓ Fraud reports collection initialized")

    console.log("[MongoDB] ✓ All collections initialized successfully")
  } catch (error) {
    console.error("[MongoDB] Collection initialization failed:", error)
    throw error
  }
}

/**
 * Close all active connections
 */
export async function closeDatabaseConnections(): Promise<void> {
  try {
    // Close main connection
    await disconnectFromDatabase()

    // Wait for any pending operations
    await new Promise((resolve) => setTimeout(resolve, 100))

    console.log("[MongoDB] ✓ All connections closed")
  } catch (error) {
    console.error("[MongoDB] Error closing connections:", error)
  }
}

// Handle process termination
if (typeof process !== "undefined") {
  process.on("exit", async () => {
    await closeDatabaseConnections()
  })

  process.on("SIGINT", async () => {
    await closeDatabaseConnections()
    process.exit(0)
  })

  process.on("SIGTERM", async () => {
    await closeDatabaseConnections()
    process.exit(0)
  })
}
