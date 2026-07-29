-- Update users table to add reputation and rewards system
-- This script adds reputation points, wallet balance, user levels, and referral tracking

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reputation_points DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS user_level TEXT DEFAULT 'beginner' CHECK (user_level IN ('beginner', 'investigator', 'expert', 'master')),
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by TEXT,
ADD COLUMN IF NOT EXISTS total_reports INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accurate_reports INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS false_reports INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accuracy_rate DECIMAL(5,2) DEFAULT 0.00;

-- Create reputation activities log table
CREATE TABLE IF NOT EXISTS reputation_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'accurate_report', 
    'false_report', 
    'validated_report', 
    'helpful_answer', 
    'referral_bonus', 
    'daily_login',
    'quest_completed',
    'level_up'
  )),
  points_change DECIMAL(10,2) NOT NULL,
  balance_change DECIMAL(10,2) DEFAULT 0.00,
  description TEXT,
  related_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referral tracking table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  bonus_earned DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rewarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rewarded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referrer_id, referred_user_id)
);

-- Create report validation table
CREATE TABLE IF NOT EXISTS report_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES fraud_reports(id) ON DELETE CASCADE,
  validator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  validation_result TEXT NOT NULL CHECK (validation_result IN ('legitimate_fraud', 'false_alarm', 'needs_review')),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  notes TEXT,
  reward_earned DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet connections table
CREATE TABLE IF NOT EXISTS wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT DEFAULT 'pi' CHECK (wallet_type IN ('pi', 'ethereum', 'other')),
  is_verified BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_payout TIMESTAMP WITH TIME ZONE
);

-- Create level thresholds table
CREATE TABLE IF NOT EXISTS level_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_name TEXT UNIQUE NOT NULL,
  min_reputation DECIMAL(10,2) NOT NULL,
  max_reputation DECIMAL(10,2),
  benefits TEXT,
  features_unlocked TEXT[]
);

-- Insert default level thresholds
INSERT INTO level_thresholds (level_name, min_reputation, max_reputation, benefits, features_unlocked) VALUES
('beginner', 0.00, 99.99, 'Basic bot access', ARRAY['chat', 'basic_reports']),
('investigator', 100.00, 499.99, 'Report validation access + 10% bonus rewards', ARRAY['chat', 'basic_reports', 'validate_reports', 'community_voting']),
('expert', 500.00, 1999.99, 'Priority support + 25% bonus rewards + NFT eligibility', ARRAY['chat', 'basic_reports', 'validate_reports', 'community_voting', 'create_channels', 'nft_staking']),
('master', 2000.00, NULL, 'Maximum rewards + governance voting + exclusive features', ARRAY['chat', 'basic_reports', 'validate_reports', 'community_voting', 'create_channels', 'nft_staking', 'governance_voting', 'priority_support'])
ON CONFLICT (level_name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reputation_activities_user ON reputation_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_report_validations_report ON report_validations(report_id);
CREATE INDEX IF NOT EXISTS idx_report_validations_validator ON report_validations(validator_id);
CREATE INDEX IF NOT EXISTS idx_wallet_connections_user ON wallet_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_users_reputation ON users(reputation_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(user_level);

-- Create function to automatically update user level based on reputation
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user level based on reputation points
  IF NEW.reputation_points >= 2000.00 THEN
    NEW.user_level := 'master';
  ELSIF NEW.reputation_points >= 500.00 THEN
    NEW.user_level := 'expert';
  ELSIF NEW.reputation_points >= 100.00 THEN
    NEW.user_level := 'investigator';
  ELSE
    NEW.user_level := 'beginner';
  END IF;
  
  -- Update accuracy rate
  IF NEW.total_reports > 0 THEN
    NEW.accuracy_rate := ROUND((NEW.accurate_reports::DECIMAL / NEW.total_reports::DECIMAL) * 100, 2);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user level
DROP TRIGGER IF EXISTS trigger_update_user_level ON users;
CREATE TRIGGER trigger_update_user_level
  BEFORE UPDATE OF reputation_points, accurate_reports, total_reports ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Create function to add reputation activity
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
  -- Add activity log
  INSERT INTO reputation_activities (user_id, activity_type, points_change, balance_change, description, related_id)
  VALUES (p_user_id, p_activity_type, p_points_change, p_balance_change, p_description, p_related_id);
  
  -- Update user reputation and balance
  UPDATE users 
  SET 
    reputation_points = reputation_points + p_points_change,
    wallet_balance = wallet_balance + p_balance_change
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE reputation_activities IS 'Logs all reputation and reward activities for transparency';
COMMENT ON TABLE referrals IS 'Tracks user referrals and associated bonuses';
COMMENT ON TABLE report_validations IS 'Stores validation results from investigator-level users';
COMMENT ON TABLE wallet_connections IS 'Stores user wallet addresses for reward payouts';
COMMENT ON TABLE level_thresholds IS 'Defines reputation thresholds and benefits for each level';
COMMENT ON FUNCTION add_reputation_activity IS 'Helper function to add reputation points and balance in one transaction';
