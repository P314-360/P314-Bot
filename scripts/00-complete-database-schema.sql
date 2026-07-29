-- =============================================
-- P314 COMPLETE DATABASE SCHEMA
-- Final Production-Ready Schema
-- Version: 1.0.0
-- =============================================
-- This is the COMPLETE unified schema combining all system features.
-- Run this script on a fresh database for full deployment.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_uid TEXT UNIQUE NOT NULL,
  pi_username TEXT UNIQUE NOT NULL,
  roles TEXT[] DEFAULT '{}',
  kyc_verified BOOLEAN DEFAULT FALSE,
  
  -- Reputation & Rewards System
  reputation_points DECIMAL(10,2) DEFAULT 0.00,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  user_level TEXT DEFAULT 'beginner' CHECK (user_level IN ('beginner', 'investigator', 'expert', 'master')),
  referral_count INTEGER DEFAULT 0,
  referred_by TEXT,
  
  -- Report Statistics
  total_reports INTEGER DEFAULT 0,
  accurate_reports INTEGER DEFAULT 0,
  false_reports INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  security_alerts BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'en',
  voice_enabled BOOLEAN DEFAULT FALSE,
  voice_type TEXT DEFAULT 'lia',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CHAT & MESSAGING SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- =============================================
-- CHANNELS & COMMUNITY
-- =============================================

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

CREATE TABLE IF NOT EXISTS joined_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

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

-- =============================================
-- FRAUD DETECTION & REPORTING
-- =============================================

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
  
  -- Verification System
  verification_status TEXT DEFAULT 'awaiting_validators' 
    CHECK (verification_status IN ('awaiting_validators', 'in_review', 'verified', 'rejected')),
  assigned_validators UUID[],
  final_verdict TEXT CHECK (final_verdict IN ('fraud_confirmed', 'safe')),
  verified_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES fraud_reports(id) ON DELETE CASCADE,
  validator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  validator_username TEXT NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('fraud_confirmed', 'safe')),
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rewarded BOOLEAN DEFAULT FALSE,
  UNIQUE(report_id, validator_id)
);

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

-- =============================================
-- BUG BOUNTY SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS novel_fraud_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id TEXT NOT NULL,
  reporter_username TEXT NOT NULL,
  fraud_method_title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_image_url TEXT,
  keywords TEXT[],
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  admin_reviewer TEXT,
  admin_notes TEXT,
  reviewed_at TIMESTAMP,
  bounty_amount DECIMAL(20, 8) DEFAULT 10.0,
  reputation_bonus INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fraud_detection_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_report_id UUID REFERENCES novel_fraud_reports(id),
  times_detected INTEGER DEFAULT 0,
  added_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bounty_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  report_id UUID REFERENCES novel_fraud_reports(id),
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- REPUTATION & ACTIVITIES
-- =============================================

CREATE TABLE IF NOT EXISTS reputation_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'accurate_report', 'false_report', 'validated_report', 'helpful_answer', 
    'referral_bonus', 'daily_login', 'quest_completed', 'level_up'
  )),
  points_change DECIMAL(10,2) NOT NULL,
  balance_change DECIMAL(10,2) DEFAULT 0.00,
  description TEXT,
  related_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT DEFAULT 'pi' CHECK (wallet_type IN ('pi', 'ethereum', 'other')),
  is_verified BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_payout TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- REFERRAL SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  referral_code TEXT UNIQUE NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  total_signups INTEGER DEFAULT 0,
  total_active_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code TEXT NOT NULL,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  is_activated BOOLEAN DEFAULT FALSE,
  first_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  base_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,4) DEFAULT 0.0500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADMIN REVENUE SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS admin_treasury (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_balance DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  total_validator_commissions DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  total_withdrawal_fees DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  total_premium_services DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW(),
  CHECK (total_balance >= 0)
);

CREATE TABLE IF NOT EXISTS revenue_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  validator_commission_rate DECIMAL(5, 4) DEFAULT 0.1000 NOT NULL,
  withdrawal_fee_rate DECIMAL(5, 4) DEFAULT 0.0500 NOT NULL,
  premium_service_rate DECIMAL(5, 4) DEFAULT 1.0000 NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  source_user_id VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  fee_amount DECIMAL(18, 6) NOT NULL,
  net_amount DECIMAL(18, 6) NOT NULL,
  wallet_address VARCHAR(200) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- =============================================
-- QUESTS & GAMIFICATION
-- =============================================

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

CREATE TABLE IF NOT EXISTS shards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shard_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shard_type TEXT NOT NULL CHECK (shard_type IN ('ai', 'explorer', 'fraud')),
  quest_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- =============================================
-- ANALYTICS & INSIGHTS
-- =============================================

CREATE TABLE IF NOT EXISTS trending_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_hash TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  search_count INTEGER DEFAULT 1,
  last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS helpful_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  rating_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  solved_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_pi_uid ON users(pi_uid);
CREATE INDEX IF NOT EXISTS idx_users_pi_username ON users(pi_username);
CREATE INDEX IF NOT EXISTS idx_users_reputation ON users(reputation_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(user_level);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);

-- Channel indexes
CREATE INDEX IF NOT EXISTS idx_channels_owner ON channels(owner_id);
CREATE INDEX IF NOT EXISTS idx_channel_messages_channel ON channel_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_messages_expires ON channel_messages(expires_at);
CREATE INDEX IF NOT EXISTS idx_joined_channels_user ON joined_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON channel_notifications(user_id, is_read);

-- Fraud report indexes
CREATE INDEX IF NOT EXISTS idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_report_verification_status ON fraud_reports(verification_status);
CREATE INDEX IF NOT EXISTS idx_report_verifications_validator ON report_verifications(validator_id);
CREATE INDEX IF NOT EXISTS idx_wallet_address ON wallet_verifications(address);

-- Bug bounty indexes
CREATE INDEX IF NOT EXISTS idx_novel_reports_status ON novel_fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_novel_reports_reporter ON novel_fraud_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_bounty_notifs_user ON bounty_notifications(user_id);

-- Reputation indexes
CREATE INDEX IF NOT EXISTS idx_reputation_activities_user ON reputation_activities(user_id, created_at DESC);

-- Referral indexes
CREATE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_referrer ON referral_commissions(referrer_user_id);

-- =============================================
-- STORED FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update user level based on reputation
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reputation_points >= 2000.00 THEN
    NEW.user_level := 'master';
  ELSIF NEW.reputation_points >= 500.00 THEN
    NEW.user_level := 'expert';
  ELSIF NEW.reputation_points >= 100.00 THEN
    NEW.user_level := 'investigator';
  ELSE
    NEW.user_level := 'beginner';
  END IF;
  
  IF NEW.total_reports > 0 THEN
    NEW.accuracy_rate := ROUND((NEW.accurate_reports::DECIMAL / NEW.total_reports::DECIMAL) * 100, 2);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_level ON users;
CREATE TRIGGER trigger_update_user_level
  BEFORE UPDATE OF reputation_points, accurate_reports, total_reports ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Check report consensus after validator review
CREATE OR REPLACE FUNCTION check_report_consensus()
RETURNS TRIGGER AS $$
DECLARE
  fraud_count INTEGER;
  safe_count INTEGER;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE verdict = 'fraud_confirmed'),
    COUNT(*) FILTER (WHERE verdict = 'safe')
  INTO fraud_count, safe_count
  FROM report_verifications
  WHERE report_id = NEW.report_id;

  IF fraud_count >= 2 THEN
    UPDATE fraud_reports
    SET verification_status = 'verified',
        final_verdict = 'fraud_confirmed',
        verified_at = NOW()
    WHERE id = NEW.report_id;
    
    UPDATE report_verifications
    SET rewarded = TRUE
    WHERE report_id = NEW.report_id AND verdict = 'fraud_confirmed';
    
  ELSIF safe_count >= 2 THEN
    UPDATE fraud_reports
    SET verification_status = 'rejected',
        final_verdict = 'safe',
        verified_at = NOW()
    WHERE id = NEW.report_id;
    
    UPDATE report_verifications
    SET rewarded = TRUE
    WHERE report_id = NEW.report_id AND verdict = 'safe';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_consensus ON report_verifications;
CREATE TRIGGER trigger_check_consensus
AFTER INSERT ON report_verifications
FOR EACH ROW
EXECUTE FUNCTION check_report_consensus();

-- Add reputation activity helper function
CREATE OR REPLACE FUNCTION add_reputation_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_points_change DECIMAL,
  p_balance_change DECIMAL,
  p_description TEXT,
  p_related_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO reputation_activities (user_id, activity_type, points_change, balance_change, description, related_id)
  VALUES (p_user_id, p_activity_type, p_points_change, p_balance_change, p_description, p_related_id);
  
  UPDATE users 
  SET 
    reputation_points = reputation_points + p_points_change,
    wallet_balance = wallet_balance + p_balance_change
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Initialize default data
INSERT INTO admin_treasury (total_balance) VALUES (0) ON CONFLICT DO NOTHING;
INSERT INTO revenue_config (validator_commission_rate, withdrawal_fee_rate, premium_service_rate)
VALUES (0.1000, 0.0500, 1.0000) ON CONFLICT DO NOTHING;

-- =============================================
-- COMMENTS & DOCUMENTATION
-- =============================================

COMMENT ON DATABASE postgres IS 'P314 - Decentralized Security Platform for Pi Network';
COMMENT ON TABLE users IS 'Pi Network authenticated users with reputation system';
COMMENT ON TABLE fraud_reports IS 'Community-submitted fraud reports with verification workflow';
COMMENT ON TABLE report_verifications IS 'Validator reviews for crowd-sourced fraud detection';
COMMENT ON TABLE novel_fraud_reports IS 'Bug bounty system for discovering novel fraud patterns';
COMMENT ON TABLE referral_links IS 'User referral system with lifetime commission tracking';
COMMENT ON TABLE admin_treasury IS 'Platform revenue management and commission tracking';
