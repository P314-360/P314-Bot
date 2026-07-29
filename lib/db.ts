// ═══════════════════════════════════════════════════════════════════════════════
// Database Abstraction Layer (MongoDB)
// ═══════════════════════════════════════════════════════════════════════════════

import { connectToDatabase, getDatabase, disconnectFromDatabase, checkDatabaseHealth } from "./mongodb"
import { env } from "./env"

// Helper function to check if database is configured
export function isDatabaseConfigured(): boolean {
  return !!env.mongodbUri
}

// Get database instance
export async function getDb() {
  return getDatabase()
}

// Close database connection
export async function closePool(): Promise<void> {
  await disconnectFromDatabase()
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    console.log("[P314 DB] Testing connection...")
    const { client } = await connectToDatabase()

    // Ping the database
    await client.db("admin").command({ ping: 1 })

    console.log("[P314 DB] ✓ Connection successful")
    return true
  } catch (error) {
    console.error("[P314 DB] Connection failed:", error)
    return false
  }
}

// Health check
export async function healthCheck(): Promise<boolean> {
  return checkDatabaseHealth()
}

/**
 * Query builder helper for common operations
 * @deprecated Use MongoDB driver directly instead
 */
export class MongoQuery {
  constructor(private collectionName: string) {}

  async find(filter = {}, options = {}) {
    const db = await getDatabase()
    return db.collection(this.collectionName).find(filter, options).toArray()
  }

  async findOne(filter = {}) {
    const db = await getDatabase()
    return db.collection(this.collectionName).findOne(filter)
  }

  async insertOne(document: any) {
    const db = await getDatabase()
    return db.collection(this.collectionName).insertOne(document)
  }

  async updateOne(filter: any, update: any) {
    const db = await getDatabase()
    return db.collection(this.collectionName).updateOne(filter, update)
  }

  async deleteOne(filter: any) {
    const db = await getDatabase()
    return db.collection(this.collectionName).deleteOne(filter)
  }
}

/**
 * Backwards compatibility wrapper for old code using query function
 * @deprecated Migration to MongoDB - use getDatabase() or specific collection methods instead
 */
export async function query(collectionName: string, operation: string, params?: any): Promise<any> {
  console.warn(
    `[P314 DB] Deprecated query() function called. Consider migrating to MongoDB driver directly.`,
  )

  const db = await getDatabase()
  const collection = db.collection(collectionName)

  switch (operation.toLowerCase()) {
    case "find":
      return collection.find(params?.filter || {}).toArray()
    case "findone":
      return collection.findOne(params?.filter || {})
    case "insertone":
      return collection.insertOne(params?.document || {})
    case "updateone":
      return collection.updateOne(params?.filter || {}, { $set: params?.update || {} })
    case "deleteone":
      return collection.deleteOne(params?.filter || {})
    case "countdocuments":
      return collection.countDocuments(params?.filter || {})
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }
}
