-- =============================================
-- Referral System & Monthly Reputation Mining
-- =============================================

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending', -- pending, active, inactive
  first_activity_at TIMESTAMP,
  total_earned DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (referrer_user_id) REFERENCES users(pi_user_id) ON DELETE CASCADE,
  FOREIGN KEY (referred_user_id) REFERENCES users(pi_user_id) ON DELETE CASCADE
);

-- Create referral_earnings table (tracks all referral commissions)
CREATE TABLE IF NOT EXISTS referral_earnings (
  id SERIAL PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  base_amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 4) DEFAULT 0.0500, -- 5%
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (referrer_user_id) REFERENCES users(pi_user_id) ON DELETE CASCADE
);

-- Create monthly_distributions table (tracks monthly mining payouts)
CREATE TABLE IF NOT EXISTS monthly_distributions (
  id SERIAL PRIMARY KEY,
  distribution_month TEXT NOT NULL UNIQUE, -- Format: YYYY-MM
  total_budget DECIMAL(10, 2) NOT NULL,
  total_reputation_points DECIMAL(10, 2) NOT NULL,
  participants_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, processing, completed
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_monthly_rewards table (individual user rewards per month)
CREATE TABLE IF NOT EXISTS user_monthly_rewards (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  distribution_month TEXT NOT NULL,
  reputation_points DECIMAL(10, 2) NOT NULL,
  user_level TEXT NOT NULL,
  level_multiplier DECIMAL(5, 2) NOT NULL,
  base_reward DECIMAL(10, 2) NOT NULL,
  bonus_reward DECIMAL(10, 2) NOT NULL,
  total_reward DECIMAL(10, 2) NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(pi_user_id) ON DELETE CASCADE,
  UNIQUE(user_id, distribution_month)
);

-- Create monthly_activity_tracking table (resets monthly)
CREATE TABLE IF NOT EXISTS monthly_activity_tracking (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_month TEXT NOT NULL, -- Format: YYYY-MM
  monthly_points DECIMAL(10, 2) DEFAULT 0.00,
  activities_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(pi_user_id) ON DELETE CASCADE,
  UNIQUE(user_id, activity_month)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_referrer ON referral_earnings(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_distributions_month ON monthly_distributions(distribution_month);
CREATE INDEX IF NOT EXISTS idx_user_monthly_rewards_user ON user_monthly_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_monthly_rewards_month ON user_monthly_rewards(distribution_month);
CREATE INDEX IF NOT EXISTS idx_monthly_activity_user ON monthly_activity_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_activity_month ON monthly_activity_tracking(activity_month);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id TEXT)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text || user_id || clock_timestamp()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referrals WHERE referral_code = code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to activate referral on first activity
CREATE OR REPLACE FUNCTION activate_referral_on_first_activity()
RETURNS TRIGGER AS $$
DECLARE
  referral_record RECORD;
BEGIN
  -- Check if user has a pending referral
  SELECT * INTO referral_record
  FROM referrals
  WHERE referred_user_id = NEW.user_id AND status = 'pending';
  
  IF FOUND THEN
    -- Activate the referral
    UPDATE referrals
    SET status = 'active', first_activity_at = NOW()
    WHERE id = referral_record.id;
    
    -- Award referrer with bonus
    UPDATE users
    SET 
      reputation_points = reputation_points + 5.0,
      wallet_balance = wallet_balance + 1.0,
      referral_count = referral_count + 1
    WHERE pi_user_id = referral_record.referrer_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to activate referral on first activity
CREATE TRIGGER trg_activate_referral_first_activity
AFTER INSERT ON reputation_history
FOR EACH ROW
EXECUTE FUNCTION activate_referral_on_first_activity();

-- Function to pay referral commission
CREATE OR REPLACE FUNCTION pay_referral_commission(
  p_referred_user_id TEXT,
  p_activity_type TEXT,
  p_base_amount DECIMAL
)
RETURNS VOID AS $$
DECLARE
  v_referrer_id TEXT;
  v_commission_rate DECIMAL := 0.05; -- 5%
  v_commission DECIMAL;
BEGIN
  -- Get active referrer
  SELECT referrer_user_id INTO v_referrer_id
  FROM referrals
  WHERE referred_user_id = p_referred_user_id AND status = 'active';
  
  IF FOUND AND p_base_amount > 0 THEN
    -- Calculate commission (5% of base amount)
    v_commission := ROUND(p_base_amount * v_commission_rate, 2);
    
    -- Pay referrer
    UPDATE users
    SET wallet_balance = wallet_balance + v_commission
    WHERE pi_user_id = v_referrer_id;
    
    -- Update referral total earned
    UPDATE referrals
    SET total_earned = total_earned + v_commission
    WHERE referrer_user_id = v_referrer_id AND referred_user_id = p_referred_user_id;
    
    -- Record the earning
    INSERT INTO referral_earnings (
      referrer_user_id, referred_user_id, activity_type,
      base_amount, commission_amount, commission_rate
    ) VALUES (
      v_referrer_id, p_referred_user_id, p_activity_type,
      p_base_amount, v_commission, v_commission_rate
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to track monthly activity
CREATE OR REPLACE FUNCTION track_monthly_activity(
  p_user_id TEXT,
  p_points DECIMAL
)
RETURNS VOID AS $$
DECLARE
  v_current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
BEGIN
  INSERT INTO monthly_activity_tracking (
    user_id, activity_month, monthly_points, activities_count, last_activity_at
  ) VALUES (
    p_user_id, v_current_month, p_points, 1, NOW()
  )
  ON CONFLICT (user_id, activity_month)
  DO UPDATE SET
    monthly_points = monthly_activity_tracking.monthly_points + p_points,
    activities_count = monthly_activity_tracking.activities_count + 1,
    last_activity_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and distribute monthly rewards
CREATE OR REPLACE FUNCTION distribute_monthly_rewards(
  p_month TEXT,
  p_budget DECIMAL
)
RETURNS TABLE(
  user_id TEXT,
  reward_amount DECIMAL,
  status TEXT
) AS $$
DECLARE
  v_total_reputation DECIMAL;
  v_user_record RECORD;
  v_base_reward DECIMAL;
  v_level_multiplier DECIMAL;
  v_bonus_reward DECIMAL;
  v_total_reward DECIMAL;
  v_participants INTEGER := 0;
BEGIN
  -- Calculate total reputation points in the community
  SELECT COALESCE(SUM(reputation_points), 0) INTO v_total_reputation
  FROM users
  WHERE reputation_points > 0;
  
  -- Create distribution record
  INSERT INTO monthly_distributions (
    distribution_month, total_budget, total_reputation_points, status
  ) VALUES (
    p_month, p_budget, v_total_reputation, 'processing'
  );
  
  -- Distribute to each user
  FOR v_user_record IN
    SELECT pi_user_id, reputation_points, user_level
    FROM users
    WHERE reputation_points > 0
  LOOP
    -- Calculate base reward (proportional to reputation)
    v_base_reward := ROUND((v_user_record.reputation_points / v_total_reputation) * p_budget, 2);
    
    -- Apply level multiplier
    v_level_multiplier := CASE v_user_record.user_level
      WHEN 'master' THEN 1.5
      WHEN 'expert' THEN 1.25
      WHEN 'investigator' THEN 1.1
      ELSE 1.0
    END;
    
    v_bonus_reward := ROUND(v_base_reward * (v_level_multiplier - 1.0), 2);
    v_total_reward := v_base_reward + v_bonus_reward;
    
    -- Record user reward
    INSERT INTO user_monthly_rewards (
      user_id, distribution_month, reputation_points, user_level,
      level_multiplier, base_reward, bonus_reward, total_reward
    ) VALUES (
      v_user_record.pi_user_id, p_month, v_user_record.reputation_points,
      v_user_record.user_level, v_level_multiplier, v_base_reward,
      v_bonus_reward, v_total_reward
    );
    
    -- Add to wallet
    UPDATE users
    SET wallet_balance = wallet_balance + v_total_reward
    WHERE pi_user_id = v_user_record.pi_user_id;
    
    v_participants := v_participants + 1;
    
    -- Return result
    user_id := v_user_record.pi_user_id;
    reward_amount := v_total_reward;
    status := 'distributed';
    RETURN NEXT;
  END LOOP;
  
  -- Update distribution record
  UPDATE monthly_distributions
  SET 
    status = 'completed',
    participants_count = v_participants,
    processed_at = NOW()
  WHERE distribution_month = p_month;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Insert initial test data for referral system
INSERT INTO referrals (referrer_user_id, referred_user_id, referral_code, status)
VALUES 
  ('demo_user_1', 'demo_user_2', 'WELCOME1', 'active'),
  ('demo_user_1', 'demo_user_3', 'WELCOME2', 'pending')
ON CONFLICT (referral_code) DO NOTHING;
