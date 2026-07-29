-- Add verification system for fraud reports
-- This enables crowdsourced verification by community validators

-- Report verifications table - tracks validator reviews
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

-- Update fraud_reports table to support verification workflow
ALTER TABLE fraud_reports 
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'awaiting_validators' 
    CHECK (verification_status IN ('awaiting_validators', 'in_review', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS assigned_validators UUID[],
  ADD COLUMN IF NOT EXISTS final_verdict TEXT CHECK (final_verdict IN ('fraud_confirmed', 'safe')),
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Create index for quick validator assignment
CREATE INDEX IF NOT EXISTS idx_report_verification_status ON fraud_reports(verification_status);
CREATE INDEX IF NOT EXISTS idx_report_verifications_validator ON report_verifications(validator_id);

-- Function to update report status based on validator consensus
CREATE OR REPLACE FUNCTION check_report_consensus()
RETURNS TRIGGER AS $$
DECLARE
  fraud_count INTEGER;
  safe_count INTEGER;
  total_reviews INTEGER;
BEGIN
  -- Count verdicts for this report
  SELECT 
    COUNT(*) FILTER (WHERE verdict = 'fraud_confirmed'),
    COUNT(*) FILTER (WHERE verdict = 'safe'),
    COUNT(*)
  INTO fraud_count, safe_count, total_reviews
  FROM report_verifications
  WHERE report_id = NEW.report_id;

  -- If 2 out of 3 agree, finalize the report
  IF fraud_count >= 2 THEN
    UPDATE fraud_reports
    SET verification_status = 'verified',
        final_verdict = 'fraud_confirmed',
        verified_at = NOW()
    WHERE id = NEW.report_id;
    
    -- Reward correct validators
    UPDATE report_verifications
    SET rewarded = TRUE
    WHERE report_id = NEW.report_id AND verdict = 'fraud_confirmed';
    
  ELSIF safe_count >= 2 THEN
    UPDATE fraud_reports
    SET verification_status = 'rejected',
        final_verdict = 'safe',
        verified_at = NOW()
    WHERE id = NEW.report_id;
    
    -- Reward correct validators
    UPDATE report_verifications
    SET rewarded = TRUE
    WHERE report_id = NEW.report_id AND verdict = 'safe';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check consensus after each review
CREATE TRIGGER trigger_check_consensus
AFTER INSERT ON report_verifications
FOR EACH ROW
EXECUTE FUNCTION check_report_consensus();

-- Add comment for documentation
COMMENT ON TABLE report_verifications IS 'Stores validator reviews for fraud reports with consensus-based finalization';
