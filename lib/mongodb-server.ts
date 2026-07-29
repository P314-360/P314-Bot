// ═══════════════════════════════════════════════════════════════════════════════
// MongoDB Server-side Utilities
// ═══════════════════════════════════════════════════════════════════════════════

import { connectToDatabase, getCollection, getDatabase } from "./mongodb"
import type { ObjectId, Filter, UpdateFilter, Document } from "mongodb"

/**
 * Initialize database connection for server-side operations
 */
export async function getDbConnection() {
  return connectToDatabase()
}

/**
 * Get users collection
 */
export async function getUsersCollection() {
  return getCollection("users")
}

/**
 * Get sessions collection
 */
export async function getSessionsCollection() {
  return getCollection("sessions")
}

/**
 * Get messages collection
 */
export async function getMessagesCollection() {
  return getCollection("messages")
}

/**
 * Get channels collection
 */
export async function getChannelsCollection() {
  return getCollection("channels")
}

/**
 * Get quests collection
 */
export async function getQuestsCollection() {
  return getCollection("quests")
}

/**
 * Get reputation collection
 */
export async function getReputationCollection() {
  return getCollection("reputation")
}

/**
 * Get fraud reports collection
 */
export async function getFraudReportsCollection() {
  return getCollection("fraudReports")
}

/**
 * Get wallet verifications collection
 */
export async function getWalletVerificationsCollection() {
  return getCollection("walletVerifications")
}

/**
 * Get withdrawals collection
 */
export async function getWithdrawalsCollection() {
  return getCollection("withdrawals")
}

/**
 * Get admin revenue collection
 */
export async function getAdminRevenueCollection() {
  return getCollection("adminRevenue")
}

/**
 * Get bounties collection
 */
export async function getBountiesCollection() {
  return getCollection("bounties")
}

/**
 * Find user by Pi UID
 */
export async function findUserByPiUid(piUid: string) {
  const users = await getUsersCollection()
  return users.findOne({ piUid })
}

/**
 * Find user by ID
 */
export async function findUserById(userId: ObjectId | string) {
  const users = await getUsersCollection()
  return users.findOne({
    _id: typeof userId === "string" ? { $eq: userId } : userId,
  })
}

/**
 * Find session by token
 */
export async function findSessionByToken(token: string) {
  const sessions = await getSessionsCollection()
  return sessions.findOne({ token })
}

/**
 * Find channel by ID
 */
export async function findChannelById(channelId: ObjectId | string) {
  const channels = await getChannelsCollection()
  return channels.findOne({
    _id: typeof channelId === "string" ? { $eq: channelId } : channelId,
  })
}

/**
 * Find channels by owner
 */
export async function findChannelsByOwner(ownerId: ObjectId | string) {
  const channels = await getChannelsCollection()
  return channels
    .find({
      ownerId: typeof ownerId === "string" ? { $eq: ownerId } : ownerId,
    })
    .toArray()
}

/**
 * Get user reputation
 */
export async function getUserReputation(userId: ObjectId | string) {
  const reputation = await getReputationCollection()
  return reputation.findOne({
    userId: typeof userId === "string" ? { $eq: userId } : userId,
  })
}

/**
 * Get user quests
 */
export async function getUserQuests(userId: ObjectId | string, status?: string) {
  const quests = await getQuestsCollection()
  const filter: Filter<Document> = {
    userId: typeof userId === "string" ? { $eq: userId } : userId,
  }

  if (status) {
    filter.status = status
  }

  return quests.find(filter).toArray()
}

/**
 * Create transaction for atomic operations
 */
export async function withTransaction<T>(callback: (session: any) => Promise<T>) {
  const { client } = await getDbConnection()
  const session = client.startSession()

  try {
    await session.withTransaction(async () => {
      return await callback(session)
    })
  } finally {
    await session.endSession()
  }
}

/**
 * Bulk write operations
 */
export async function bulkWrite(collectionName: string, operations: any[]) {
  const collection = await getCollection(collectionName)
  return collection.bulkWrite(operations)
}

/**
 * Helper to create object ID
 */
export function createObjectId(id?: string) {
  const { ObjectId } = require("mongodb")
  return new ObjectId(id)
}

/**
 * Check if valid object ID
 */
export function isValidObjectId(id: string): boolean {
  try {
    const { ObjectId } = require("mongodb")
    return ObjectId.isValid(id)
  } catch {
    return false
  }
}
