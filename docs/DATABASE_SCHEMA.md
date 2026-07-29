# P314 Database Schema Documentation

## Overview
This document describes the complete database schema for the P314 Pi Network security platform.

## Core Tables

### 1. users
Stores Pi Network authenticated users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| pi_uid | TEXT | Unique Pi Network user ID |
| pi_username | TEXT | Unique Pi Network username |
| roles | TEXT[] | User roles in Pi Network |
| kyc_verified | BOOLEAN | KYC verification status |
| created_at | TIMESTAMP | Account creation time |
| last_login | TIMESTAMP | Last login timestamp |

**Indexes:**
- `idx_users_pi_uid` on pi_uid
- `idx_users_pi_username` on pi_username

---

### 2. user_settings
User preferences and configuration.

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Foreign key to users |
| theme | TEXT | UI theme preference |
| security_alerts | BOOLEAN | Security alert preference |
| language | TEXT | Language preference |
| voice_enabled | BOOLEAN | Voice feature enabled |
| voice_type | TEXT | Voice type selection |
| updated_at | TIMESTAMP | Last update time |

---

### 3. chat_sessions
Chat session management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| session_id | TEXT | Unique session identifier |
| created_at | TIMESTAMP | Session creation time |

---

### 4. messages
Individual chat messages with ratings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Foreign key to chat_sessions |
| text | TEXT | Message content |
| sender | TEXT | 'user' or 'ai' |
| rating | INTEGER | Message rating (1-5) |
| feedback | TEXT | User feedback |
| knowledge_gap_score | INTEGER | AI knowledge gap score (0-100) |
| confidence_score | INTEGER | AI confidence score (0-100) |
| created_at | TIMESTAMP | Message timestamp |

**Indexes:**
- `idx_messages_session` on session_id

---

## Channel System Tables

### 5. channels
User-created help channels.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| channel_id | TEXT | Unique channel identifier |
| owner_id | UUID | Foreign key to users |
| owner_username | TEXT | Channel owner username |
| channel_name | TEXT | Display name |
| description | TEXT | Channel description |
| is_verified | BOOLEAN | Verification status |
| subscribers | INTEGER | Subscriber count |
| is_active | BOOLEAN | Active status |
| moderated_by_ai | BOOLEAN | AI moderation enabled |
| total_helps | INTEGER | Total help interactions |
| success_rate | DECIMAL | Help success rate |
| average_rating | DECIMAL | Average rating (0-5) |
| created_at | TIMESTAMP | Creation time |

**Indexes:**
- `idx_channels_owner` on owner_id

---

### 6. channel_messages
E2EE encrypted channel messages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| channel_id | UUID | Foreign key to channels |
| sender_id | UUID | Foreign key to users |
| sender_username | TEXT | Sender username |
| encrypted_content | TEXT | E2EE encrypted message |
| sender_public_key | TEXT | Sender's public key |
| is_flagged | BOOLEAN | Flagged by AI moderation |
| flag_reason | TEXT | Flagging reason |
| created_at | TIMESTAMP | Message timestamp |
| expires_at | TIMESTAMP | Expiration time (30s default) |

**Indexes:**
- `idx_channel_messages_channel` on channel_id
- `idx_channel_messages_expires` on expires_at

---

### 7. joined_channels
User channel memberships.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| channel_id | UUID | Foreign key to channels |
| unread_count | INTEGER | Unread message count |
| last_message_at | TIMESTAMP | Last message time |
| joined_at | TIMESTAMP | Join timestamp |

**Unique constraint:** (user_id, channel_id)
**Indexes:**
- `idx_joined_channels_user` on user_id

---

## Security & Fraud Detection Tables

### 8. fraud_reports
User-submitted fraud reports.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| report_id | TEXT | Unique report identifier |
| reporter_id | UUID | Foreign key to users |
| reporter_username | TEXT | Reporter username |
| report_type | TEXT | 'wallet', 'link', 'behavior', 'scam' |
| description | TEXT | Report description |
| evidence | TEXT | Supporting evidence |
| suspect_wallet | TEXT | Suspected wallet address |
| suspect_link | TEXT | Suspected malicious link |
| status | TEXT | 'pending', 'reviewed', 'escalated' |
| created_at | TIMESTAMP | Report timestamp |

**Indexes:**
- `idx_fraud_reports_status` on status

---

### 9. wallet_verifications
Wallet verification and risk tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| address | TEXT | Wallet address (unique) |
| is_valid | BOOLEAN | Validity status |
| is_flagged | BOOLEAN | Flagged status |
| flag_reason | TEXT | Flagging reason |
| transaction_count | INTEGER | Transaction count |
| first_seen | TIMESTAMP | First detection time |
| last_activity | TIMESTAMP | Last activity time |
| risk_score | INTEGER | Risk score (0-100) |
| fraud_reports_count | INTEGER | Number of fraud reports |

**Indexes:**
- `idx_wallet_address` on address

---

## Quest & NFT System Tables

### 10. quest_progress
User quest completion tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| quest_id | TEXT | Quest identifier |
| quest_type | TEXT | 'ai_sharpening', 'app_explorer', 'fraud_hunter' |
| current_count | INTEGER | Current progress |
| target_count | INTEGER | Target for completion |
| completed | BOOLEAN | Completion status |
| shard_earned | BOOLEAN | Shard earned status |
| completed_at | TIMESTAMP | Completion timestamp |

**Unique constraint:** (user_id, quest_id)
**Indexes:**
- `idx_quest_progress_user` on user_id

---

### 11. shards
Quest reward shards (3 needed for NFT).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| shard_id | TEXT | Unique shard identifier |
| user_id | UUID | Foreign key to users |
| shard_type | TEXT | 'ai', 'explorer', 'fraud' |
| quest_id | TEXT | Source quest ID |
| earned_at | TIMESTAMP | Earning timestamp |

---

### 12. nft_contributions
NFT Proof of Contribution tokens.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| token_id | TEXT | Unique NFT token ID |
| shard_ids | TEXT[] | Array of shard IDs |
| total_interactions | INTEGER | Total user interactions |
| total_reviews | INTEGER | Total reviews given |
| total_reports | INTEGER | Total fraud reports |
| status | TEXT | 'pending', 'minted' |
| minted_at | TIMESTAMP | Minting timestamp |
| created_at | TIMESTAMP | Creation timestamp |

---

## Reputation & Achievement Tables

### 13. channel_achievements
Channel owner achievements.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| achievement_id | TEXT | Unique achievement ID |
| channel_id | UUID | Foreign key to channels |
| owner_id | UUID | Foreign key to users |
| achievement_type | TEXT | Achievement category |
| rating | INTEGER | Associated rating |
| help_count | INTEGER | Help count milestone |
| description | TEXT | Achievement description |
| value | INTEGER | Achievement value |
| created_at | TIMESTAMP | Achievement time |

---

### 14. nft_generator_logs
Reputation NFT generation logs.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| log_id | TEXT | Unique log identifier |
| channel_id | UUID | Foreign key to channels |
| owner_id | UUID | Foreign key to users |
| proof_hash | TEXT | SHA-256 reputation proof hash |
| total_rating | INTEGER | Total accumulated rating |
| total_helps | INTEGER | Total help count |
| success_rate | DECIMAL | Success rate percentage |
| verified_channel | BOOLEAN | Channel verification status |
| ready_for_minting | BOOLEAN | Ready to mint NFT |
| generated_at | TIMESTAMP | Generation timestamp |

---

## Analytics Tables

### 15. trending_questions
Anonymized trending question tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| question_hash | TEXT | Anonymized question hash |
| category | TEXT | Question category |
| search_count | INTEGER | Number of searches |
| last_searched | TIMESTAMP | Last search time |
| created_at | TIMESTAMP | First search time |

**Indexes:**
- `idx_trending_questions_hash` on question_hash

---

### 16. helpful_answers
Community-rated helpful answers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| question | TEXT | Question text |
| answer | TEXT | Answer text |
| rating_count | INTEGER | Number of ratings |
| average_rating | DECIMAL | Average rating (0-5) |
| solved_count | INTEGER | Times marked as solution |
| created_at | TIMESTAMP | Creation timestamp |

---

### 17. channel_notifications
User notifications for channel activity.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| channel_id | UUID | Foreign key to channels |
| channel_name | TEXT | Channel display name |
| message | TEXT | Notification message |
| sender_username | TEXT | Sender username |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Notification timestamp |

**Indexes:**
- `idx_notifications_user` on (user_id, is_read)

---

## Setup Instructions

### Prerequisites
- MongoDB Atlas account (or self-hosted MongoDB 6+)
- Node.js 18+

### Installation
Run the index/access-control setup script after setting `MONGODB_URI`:
```bash
node scripts/03-mongodb-access-control.js
```

### Verification
Check that collections and indexes were created:
```js
const db = await getDatabase();
const collections = await db.listCollections().toArray();
console.log(collections.map(c => c.name));
```

---

## Security Considerations

### Access Control (MongoDB)
Access control is enforced at the application layer. All queries must be scoped by `userId` or `piUid`. Key rules:
- `users` - Query scoped by `pi_uid`
- `messages` - Query scoped by `session_id` owned by the user
- `fraud_reports` - Query scoped by `reporter_id`
- `wallet_verifications` - Public read, admin write

### Data Retention
- `channel_messages` expire after 30 seconds (E2EE ephemeral)
- Consider archiving old `messages` and `chat_sessions`
- Implement data retention policies per GDPR/privacy laws

### Encryption
- All sensitive data should be encrypted at rest
- Use E2EE for `channel_messages`
- Never store plaintext passwords or private keys

---

## Maintenance

### Regular Tasks
1. Clean up expired `channel_messages` (automated)
2. Archive old chat sessions (monthly)
3. Vacuum and analyze tables (weekly)
4. Monitor index usage and performance

### Backup Strategy
- Daily automated backups
- Weekly full database dumps
- Test restore procedures monthly

---

## Performance Optimization

### Key Indexes
All critical queries have supporting indexes defined in `scripts/03-mongodb-access-control.js`. Monitor via:
- MongoDB Atlas Performance Advisor
- `db.collection.explain("executionStats")`
- Atlas Real-Time Performance Panel

---

## Migration History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2024 | Initial schema creation |

---

## Support

For questions or issues:
- Check the main README.md
- Review deployment guides
- Contact: Developer Portal
