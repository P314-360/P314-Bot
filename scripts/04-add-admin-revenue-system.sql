-- Admin Revenue System for P314 Platform
-- Manages platform commissions and treasury

-- Admin Treasury Table
CREATE TABLE IF NOT EXISTS admin_treasury (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_balance DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  total_validator_commissions DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  total_withdrawal_fees DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  total_premium_services DECIMAL(18, 6) DEFAULT 0 NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW(),
  CHECK (total_balance >= 0)
);

-- Initialize admin treasury
INSERT INTO admin_treasury (total_balance) VALUES (0) ON CONFLICT DO NOTHING;

-- Revenue Configuration Table
CREATE TABLE IF NOT EXISTS revenue_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  validator_commission_rate DECIMAL(5, 4) DEFAULT 0.1000 NOT NULL, -- 10%
  withdrawal_fee_rate DECIMAL(5, 4) DEFAULT 0.0500 NOT NULL, -- 5%
  premium_service_rate DECIMAL(5, 4) DEFAULT 1.0000 NOT NULL, -- 100%
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (validator_commission_rate >= 0 AND validator_commission_rate <= 1),
  CHECK (withdrawal_fee_rate >= 0 AND withdrawal_fee_rate <= 1),
  CHECK (premium_service_rate >= 0 AND premium_service_rate <= 1)
);

-- Initialize revenue configuration
INSERT INTO revenue_config (validator_commission_rate, withdrawal_fee_rate, premium_service_rate)
VALUES (0.1000, 0.0500, 1.0000)
ON CONFLICT DO NOTHING;

-- Revenue Transactions Log
CREATE TABLE IF NOT EXISTS admin_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type VARCHAR(50) NOT NULL, -- 'validator_commission', 'withdrawal_fee', 'premium_service'
  amount DECIMAL(18, 6) NOT NULL,
  source_user_id VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (amount >= 0)
);

-- Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  fee_amount DECIMAL(18, 6) NOT NULL,
  net_amount DECIMAL(18, 6) NOT NULL,
  wallet_address VARCHAR(200) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'completed', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  CHECK (amount > 0),
  CHECK (fee_amount >= 0),
  CHECK (net_amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_transactions_type ON admin_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_admin_transactions_date ON admin_transactions(created_at);

-- Function: Add commission to admin treasury
CREATE OR REPLACE FUNCTION add_admin_commission(
  p_transaction_type VARCHAR(50),
  p_amount DECIMAL(18, 6),
  p_source_user_id VARCHAR(100) DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_treasury_id UUID;
BEGIN
  -- Get treasury ID
  SELECT id INTO v_treasury_id FROM admin_treasury LIMIT 1;
  
  -- Update treasury balance
  UPDATE admin_treasury 
  SET 
    total_balance = total_balance + p_amount,
    total_validator_commissions = CASE 
      WHEN p_transaction_type = 'validator_commission' 
      THEN total_validator_commissions + p_amount 
      ELSE total_validator_commissions 
    END,
    total_withdrawal_fees = CASE 
      WHEN p_transaction_type = 'withdrawal_fee' 
      THEN total_withdrawal_fees + p_amount 
      ELSE total_withdrawal_fees 
    END,
    total_premium_services = CASE 
      WHEN p_transaction_type = 'premium_service' 
      THEN total_premium_services + p_amount 
      ELSE total_premium_services 
    END,
    last_updated = NOW()
  WHERE id = v_treasury_id;
  
  -- Log transaction
  INSERT INTO admin_transactions (
    transaction_type,
    amount,
    source_user_id,
    description
  ) VALUES (
    p_transaction_type,
    p_amount,
    p_source_user_id,
    p_description
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: Get current revenue configuration
CREATE OR REPLACE FUNCTION get_revenue_config()
RETURNS TABLE (
  validator_commission_rate DECIMAL(5, 4),
  withdrawal_fee_rate DECIMAL(5, 4),
  premium_service_rate DECIMAL(5, 4)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.validator_commission_rate,
    rc.withdrawal_fee_rate,
    rc.premium_service_rate
  FROM revenue_config rc
  ORDER BY rc.updated_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function: Update revenue configuration
CREATE OR REPLACE FUNCTION update_revenue_config(
  p_validator_rate DECIMAL(5, 4) DEFAULT NULL,
  p_withdrawal_rate DECIMAL(5, 4) DEFAULT NULL,
  p_premium_rate DECIMAL(5, 4) DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE revenue_config
  SET
    validator_commission_rate = COALESCE(p_validator_rate, validator_commission_rate),
    withdrawal_fee_rate = COALESCE(p_withdrawal_rate, withdrawal_fee_rate),
    premium_service_rate = COALESCE(p_premium_rate, premium_service_rate),
    updated_at = NOW()
  WHERE id = (SELECT id FROM revenue_config ORDER BY updated_at DESC LIMIT 1);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
