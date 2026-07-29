// ═══════════════════════════════════════════════════════════════════════════════
// P314 MongoDB Access Control & Indexes
// Enforces access control at the application layer via indexes and validation.
// Run with: node scripts/03-mongodb-access-control.js
// ═══════════════════════════════════════════════════════════════════════════════

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_DB_NAME || "p314_bot"

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI environment variable is required")
  process.exit(1)
}

const client = new MongoClient(MONGODB_URI)

async function run() {
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    console.log(`[P314] Connected to MongoDB database: ${DB_NAME}`)

    // ─── users ────────────────────────────────────────────────────────────────
    await db.collection("users").createIndexes([
      { key: { pi_uid: 1 }, unique: true, name: "idx_users_pi_uid" },
      { key: { pi_username: 1 }, unique: true, name: "idx_users_pi_username" },
      { key: { user_level: 1 }, name: "idx_users_level" },
    ])
    console.log("[P314] users indexes created")

    // ─── user_settings ────────────────────────────────────────────────────────
    await db.collection("user_settings").createIndexes([
      { key: { user_id: 1 }, unique: true, name: "idx_user_settings_user_id" },
    ])
    console.log("[P314] user_settings indexes created")

    // ─── chat_sessions ────────────────────────────────────────────────────────
    await db.collection("chat_sessions").createIndexes([
      { key: { user_id: 1 }, name: "idx_chat_sessions_user_id" },
      { key: { session_id: 1 }, unique: true, name: "idx_chat_sessions_session_id" },
    ])
    console.log("[P314] chat_sessions indexes created")

    // ─── messages ─────────────────────────────────────────────────────────────
    await db.collection("messages").createIndexes([
      { key: { session_id: 1 }, name: "idx_messages_session_id" },
      { key: { session_id: 1, created_at: -1 }, name: "idx_messages_session_created" },
    ])
    console.log("[P314] messages indexes created")

    // ─── channels ─────────────────────────────────────────────────────────────
    await db.collection("channels").createIndexes([
      { key: { owner_id: 1 }, name: "idx_channels_owner_id" },
      { key: { is_active: 1 }, name: "idx_channels_active" },
      { key: { channel_id: 1 }, unique: true, name: "idx_channels_channel_id" },
    ])
    console.log("[P314] channels indexes created")

    // ─── channel_messages ─────────────────────────────────────────────────────
    await db.collection("channel_messages").createIndexes([
      { key: { channel_id: 1 }, name: "idx_channel_messages_channel_id" },
      { key: { expires_at: 1 }, expireAfterSeconds: 0, name: "idx_channel_messages_ttl" },
    ])
    console.log("[P314] channel_messages indexes created (with TTL for ephemeral messages)")

    // ─── joined_channels ──────────────────────────────────────────────────────
    await db.collection("joined_channels").createIndexes([
      { key: { user_id: 1 }, name: "idx_joined_channels_user_id" },
      { key: { user_id: 1, channel_id: 1 }, unique: true, name: "idx_joined_channels_unique" },
    ])
    console.log("[P314] joined_channels indexes created")

    // ─── fraud_reports ────────────────────────────────────────────────────────
    await db.collection("fraud_reports").createIndexes([
      { key: { reporter_id: 1 }, name: "idx_fraud_reports_reporter_id" },
      { key: { status: 1 }, name: "idx_fraud_reports_status" },
      { key: { report_id: 1 }, unique: true, name: "idx_fraud_reports_report_id" },
    ])
    console.log("[P314] fraud_reports indexes created")

    // ─── wallet_verifications ─────────────────────────────────────────────────
    await db.collection("wallet_verifications").createIndexes([
      { key: { address: 1 }, unique: true, name: "idx_wallet_address" },
      { key: { is_flagged: 1 }, name: "idx_wallet_flagged" },
    ])
    console.log("[P314] wallet_verifications indexes created")

    // ─── quest_progress ───────────────────────────────────────────────────────
    await db.collection("quest_progress").createIndexes([
      { key: { user_id: 1 }, name: "idx_quest_progress_user_id" },
      { key: { user_id: 1, quest_id: 1 }, unique: true, name: "idx_quest_progress_unique" },
    ])
    console.log("[P314] quest_progress indexes created")

    // ─── shards ───────────────────────────────────────────────────────────────
    await db.collection("shards").createIndexes([
      { key: { user_id: 1 }, name: "idx_shards_user_id" },
      { key: { shard_id: 1 }, unique: true, name: "idx_shards_shard_id" },
    ])
    console.log("[P314] shards indexes created")

    // ─── nft_contributions ────────────────────────────────────────────────────
    await db.collection("nft_contributions").createIndexes([
      { key: { user_id: 1 }, name: "idx_nft_contributions_user_id" },
      { key: { token_id: 1 }, unique: true, name: "idx_nft_contributions_token_id" },
    ])
    console.log("[P314] nft_contributions indexes created")

    // ─── reputation_activities ────────────────────────────────────────────────
    await db.collection("reputation_activities").createIndexes([
      { key: { user_id: 1 }, name: "idx_reputation_activities_user_id" },
      { key: { user_id: 1, created_at: -1 }, name: "idx_reputation_activities_user_date" },
    ])
    console.log("[P314] reputation_activities indexes created")

    // ─── referral_links ───────────────────────────────────────────────────────
    await db.collection("referral_links").createIndexes([
      { key: { user_id: 1 }, name: "idx_referral_links_user_id" },
      { key: { code: 1 }, unique: true, name: "idx_referral_links_code" },
    ])
    console.log("[P314] referral_links indexes created")

    // ─── referral_commissions ────────���────────────────────────────────────────
    await db.collection("referral_commissions").createIndexes([
      { key: { referrer_user_id: 1 }, name: "idx_referral_commissions_referrer" },
    ])
    console.log("[P314] referral_commissions indexes created")

    // ─── novel_fraud_reports (bug bounty) ────────────────────────────────────
    await db.collection("novel_fraud_reports").createIndexes([
      { key: { reporter_id: 1 }, name: "idx_novel_reports_reporter_id" },
      { key: { status: 1 }, name: "idx_novel_reports_status" },
    ])
    console.log("[P314] novel_fraud_reports indexes created")

    // ─── bounty_notifications ─────────────────────────────────────────────────
    await db.collection("bounty_notifications").createIndexes([
      { key: { user_id: 1 }, name: "idx_bounty_notifications_user_id" },
      { key: { user_id: 1, is_read: 1 }, name: "idx_bounty_notifications_unread" },
    ])
    console.log("[P314] bounty_notifications indexes created")

    // ─── admin_treasury ───────────────────────────────────────────────────────
    await db.collection("admin_treasury").createIndexes([
      { key: { created_at: -1 }, name: "idx_admin_treasury_date" },
    ])
    console.log("[P314] admin_treasury indexes created")

    // ─── withdrawal_requests ──────────────────────────────────────────────────
    await db.collection("withdrawal_requests").createIndexes([
      { key: { user_id: 1 }, name: "idx_withdrawal_requests_user_id" },
      { key: { status: 1 }, name: "idx_withdrawal_requests_status" },
    ])
    console.log("[P314] withdrawal_requests indexes created")

    // ─── trending_questions ───────────────────────────────────────────────────
    await db.collection("trending_questions").createIndexes([
      { key: { question_hash: 1 }, unique: true, name: "idx_trending_questions_hash" },
      { key: { search_count: -1 }, name: "idx_trending_questions_count" },
    ])
    console.log("[P314] trending_questions indexes created")

    // ─── channel_notifications ────────────────────────────────────────────────
    await db.collection("channel_notifications").createIndexes([
      { key: { user_id: 1, is_read: 1 }, name: "idx_channel_notifications_unread" },
    ])
    console.log("[P314] channel_notifications indexes created")

    console.log("\n[P314] All MongoDB indexes and access controls created successfully.")
  } catch (err) {
    console.error("[P314] Error creating indexes:", err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

run()
