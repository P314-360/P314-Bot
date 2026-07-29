-- Smart Referral System
-- This script enhances the referral system with smart tracking and commission distribution

-- Update referrals table with activation tracking
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS is_activated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS first_activity_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_commission_earned DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS lifetime_value DECIMAL(10,2) DEFAULT 0.00;

-- Create referral links table
CREATE TABLE IF NOT EXISTS referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  clicks_count INTEGER DEFAULT 0,
  successful_signups INTEGER DEFAULT 0,
  activated_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Create referral commissions table for detailed tracking
CREATE TABLE IF NOT EXISTS referral_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'validation_reward',
    'report_reward',
    'quest_completion',
    'nft_staking',
    'other_reward'
  )),
  original_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  related_activity_id UUID,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'reversed'))
);

-- Create referral stats view for easy querying
CREATE OR REPLACE VIEW referral_stats AS
SELECT 
  rl.user_id,
  rl.referral_code,
  rl.clicks_count,
  rl.successful_signups,
  rl.activated_referrals,
  COUNT(DISTINCT r.referred_user_id) AS total_referrals,
  COUNT(DISTINCT CASE WHEN r.is_activated THEN r.referred_user_id END) AS active_referrals,
  COALESCE(SUM(rc.commission_amount), 0) AS total_commissions_earned,
  COALESCE(AVG(r.lifetime_value), 0) AS avg_referral_value,
  rl.created_at
FROM referral_links rl
LEFT JOIN referrals r ON rl.user_id = r.referrer_id
LEFT JOIN referral_commissions rc ON rl.user_id = rc.referrer_id
GROUP BY rl.user_id, rl.referral_code, rl.clicks_count, rl.successful_signups, 
         rl.activated_referrals, rl.created_at;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    v_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || p_user_id::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_links WHERE referral_code = v_code) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to create or get referral link for user
CREATE OR REPLACE FUNCTION get_or_create_referral_link(p_user_id UUID)
RETURNS TABLE (
  referral_code TEXT,
  referral_url TEXT,
  total_referrals INTEGER,
  activated_referrals INTEGER,
  total_earnings DECIMAL
) AS $$
DECLARE
  v_code TEXT;
  v_link_exists BOOLEAN;
BEGIN
  -- Check if user already has a referral link
  SELECT rl.referral_code, TRUE 
  INTO v_code, v_link_exists
  FROM referral_links rl 
  WHERE rl.user_id = p_user_id AND rl.is_active = TRUE
  LIMIT 1;
  
  -- Create new link if doesn't exist
  IF v_code IS NULL THEN
    v_code := generate_referral_code(p_user_id);
    
    INSERT INTO referral_links (user_id, referral_code)
    VALUES (p_user_id, v_code);
  END IF;
  
  -- Return referral info
  RETURN QUERY
  SELECT 
    rl.referral_code,
    'https://p314.app?ref=' || rl.referral_code AS referral_url,
    rl.successful_signups,
    rl.activated_referrals,
    rl.total_earnings
  FROM referral_links rl
  WHERE rl.user_id = p_user_id AND rl.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to activate referral (called on first meaningful activity)
CREATE OR REPLACE FUNCTION activate_referral(p_referred_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_referral_id UUID;
  v_referrer_id UUID;
  v_activation_bonus DECIMAL := 0.50;
BEGIN
  -- Get pending referral
  SELECT id, referrer_id INTO v_referral_id, v_referrer_id
  FROM referrals
  WHERE referred_user_id = p_referred_user_id 
    AND is_activated = FALSE
  LIMIT 1;
  
  IF v_referral_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Activate the referral
  UPDATE referrals 
  SET 
    is_activated = TRUE,
    first_activity_at = NOW(),
    status = 'active'
  WHERE id = v_referral_id;
  
  -- Update referral link stats
  UPDATE referral_links 
  SET activated_referrals = activated_referrals + 1
  WHERE user_id = v_referrer_id;
  
  -- Give activation bonus to referrer
  UPDATE users 
  SET 
    wallet_balance = wallet_balance + v_activation_bonus,
    referral_count = referral_count + 1
  WHERE id = v_referrer_id;
  
  -- Log the activation bonus
  INSERT INTO reputation_activities (user_id, activity_type, points_change, balance_change, description, related_id)
  VALUES (
    v_referrer_id,
    'referral_bonus',
    5.00,
    v_activation_bonus,
    'Referral activated - user completed first activity',
    p_referred_user_id::TEXT
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to distribute referral commission (5% of referred user's rewards)
CREATE OR REPLACE FUNCTION distribute_referral_commission(
  p_referred_user_id UUID,
  p_reward_amount DECIMAL,
  p_activity_type TEXT,
  p_activity_id UUID DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
  v_referrer_id UUID;
  v_commission_rate DECIMAL := 5.00;
  v_commission_amount DECIMAL;
  v_is_activated BOOLEAN;
BEGIN
  -- Get referrer and check if referral is activated
  SELECT referrer_id, is_activated INTO v_referrer_id, v_is_activated
  FROM referrals
  WHERE referred_user_id = p_referred_user_id
  LIMIT 1;
  
  -- Only distribute if referral exists and is activated
  IF v_referrer_id IS NULL OR NOT v_is_activated THEN
    RETURN 0.00;
  END IF;
  
  -- Calculate commission (5% of reward, NOT deducted from user)
  v_commission_amount := ROUND(p_reward_amount * (v_commission_rate / 100), 2);
  
  -- Add commission to referrer's wallet
  UPDATE users 
  SET wallet_balance = wallet_balance + v_commission_amount
  WHERE id = v_referrer_id;
  
  -- Log the commission
  INSERT INTO referral_commissions (
    referrer_id,
    referred_user_id,
    activity_type,
    original_amount,
    commission_amount,
    commission_rate,
    related_activity_id
  ) VALUES (
    v_referrer_id,
    p_referred_user_id,
    p_activity_type,
    p_reward_amount,
    v_commission_amount,
    v_commission_rate,
    p_activity_id
  );
  
  -- Update referral stats
  UPDATE referrals 
  SET 
    total_commission_earned = total_commission_earned + v_commission_amount,
    lifetime_value = lifetime_value + v_commission_amount
  WHERE referrer_id = v_referrer_id AND referred_user_id = p_referred_user_id;
  
  -- Update referral link stats
  UPDATE referral_links 
  SET total_earnings = total_earnings + v_commission_amount
  WHERE user_id = v_referrer_id;
  
  RETURN v_commission_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to track referral link click
CREATE OR REPLACE FUNCTION track_referral_click(p_referral_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE referral_links 
  SET clicks_count = clicks_count + 1
  WHERE referral_code = p_referral_code AND is_active = TRUE;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to register user with referral code
CREATE OR REPLACE FUNCTION register_with_referral(
  p_new_user_id UUID,
  p_referral_code TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  -- Get referrer from referral code
  SELECT user_id INTO v_referrer_id
  FROM referral_links
  WHERE referral_code = p_referral_code AND is_active = TRUE;
  
  IF v_referrer_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Prevent self-referral
  IF v_referrer_id = p_new_user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Create referral record
  INSERT INTO referrals (referrer_id, referred_user_id, referral_code, status)
  VALUES (v_referrer_id, p_new_user_id, p_referral_code, 'pending')
  ON CONFLICT (referrer_id, referred_user_id) DO NOTHING;
  
  -- Update user's referred_by field
  UPDATE users 
  SET referred_by = v_referrer_id::TEXT
  WHERE id = p_new_user_id;
  
  -- Update referral link stats
  UPDATE referral_links 
  SET successful_signups = successful_signups + 1
  WHERE user_id = v_referrer_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_links_code ON referral_links(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_links_user ON referral_links(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_referrer ON referral_commissions(referrer_id, paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_referred ON referral_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_activated ON referrals(is_activated, referrer_id);

COMMENT ON TABLE referral_links IS 'Stores unique referral links for each user';
COMMENT ON TABLE referral_commissions IS 'Tracks all commission payments from referral activities';
COMMENT ON FUNCTION activate_referral IS 'Activates a referral after first meaningful activity (prevents fake referrals)';
COMMENT ON FUNCTION distribute_referral_commission IS 'Distributes 5% commission to referrer without deducting from referred user';
COMMENT ON FUNCTION register_with_referral IS 'Registers a new user with a referral code';
