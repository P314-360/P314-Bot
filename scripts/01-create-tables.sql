-- P314 Database Schema for Pi Network Integration
-- This script creates all necessary tables for decentralized operation

-- Users table - stores Pi Network authenticated users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_uid TEXT UNIQUE NOT NULL,
  pi_username TEXT UNIQUE NOT NULL,
  roles TEXT[] DEFAULT '{}',
  kyc_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  security_alerts BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'en',
  voice_enabled BOOLEAN DEFAULT FALSE,
  voice_type TEXT DEFAULT 'lia',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  knowledge_gap_score INTEGER CHECK (knowledge_gap_score >= 0 AND knowledge_gap_score <= 100),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_username TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  description TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscribers INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  moderated_by_ai BOOLEAN DEFAULT TRUE,
  total_helps INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel messages table (E2EE encrypted)
CREATE TABLE IF NOT EXISTS channel_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_username TEXT NOT NULL,
  encrypted_content TEXT NOT NULL,
  sender_public_key TEXT,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 seconds'
);

-- Joined channels table
CREATE TABLE IF NOT EXISTS joined_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

-- Fraud reports table
CREATE TABLE IF NOT EXISTS fraud_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id TEXT UNIQUE NOT NULL,
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reporter_username TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('wallet', 'link', 'behavior', 'scam')),
  description TEXT NOT NULL,
  evidence TEXT,
  suspect_wallet TEXT,
  suspect_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'escalated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet verifications table
CREATE TABLE IF NOT EXISTS wallet_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT UNIQUE NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  transaction_count INTEGER DEFAULT 0,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  fraud_reports_count INTEGER DEFAULT 0
);

-- Quest progress table
CREATE TABLE IF NOT EXISTS quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('ai_sharpening', 'app_explorer', 'fraud_hunter')),
  current_count INTEGER DEFAULT 0,
  target_count INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  shard_earned BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, quest_id)
);

-- Shards table
CREATE TABLE IF NOT EXISTS shards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shard_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shard_type TEXT NOT NULL CHECK (shard_type IN ('ai', 'explorer', 'fraud')),
  quest_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT Proof of Contribution table
CREATE TABLE IF NOT EXISTS nft_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_id TEXT UNIQUE,
  shard_ids TEXT[] NOT NULL,
  total_interactions INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_reports INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'minted')),
  minted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel reputation and achievements
CREATE TABLE IF NOT EXISTS channel_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id TEXT UNIQUE NOT NULL,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('high_rating', 'milestone_helps', 'verified_channel', 'community_star')),
  rating INTEGER,
  help_count INTEGER,
  description TEXT,
  value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT Generator Log (Reputation proof hash for blockchain)
CREATE TABLE IF NOT EXISTS nft_generator_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id TEXT UNIQUE NOT NULL,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  proof_hash TEXT NOT NULL, -- SHA-256 hash
  total_rating INTEGER DEFAULT 0,
  total_helps INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  verified_channel BOOLEAN DEFAULT FALSE,
  ready_for_minting BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trending questions tracking (anonymized)
CREATE TABLE IF NOT EXISTS trending_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_hash TEXT UNIQUE NOT NULL, -- Anonymized hash
  category TEXT NOT NULL,
  search_count INTEGER DEFAULT 1,
  last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helpful answers (community rated)
CREATE TABLE IF NOT EXISTS helpful_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  rating_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  solved_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel notifications
CREATE TABLE IF NOT EXISTS channel_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_username TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_pi_uid ON users(pi_uid);
CREATE INDEX IF NOT EXISTS idx_users_pi_username ON users(pi_username);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_channels_owner ON channels(owner_id);
CREATE INDEX IF NOT EXISTS idx_channel_messages_channel ON channel_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_messages_expires ON channel_messages(expires_at);
CREATE INDEX IF NOT EXISTS idx_joined_channels_user ON joined_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_wallet_address ON wallet_verifications(address);
CREATE INDEX IF NOT EXISTS idx_quest_progress_user ON quest_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_trending_questions_hash ON trending_questions(question_hash);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON channel_notifications(user_id, is_read);
