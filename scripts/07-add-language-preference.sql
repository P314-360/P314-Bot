-- Add language preference column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS language_preference VARCHAR(5) DEFAULT 'en';

-- Create index for faster language queries
CREATE INDEX IF NOT EXISTS idx_user_language ON user_profiles(language_preference);

-- Update existing users to have default language
UPDATE user_profiles 
SET language_preference = 'en' 
WHERE language_preference IS NULL;

COMMENT ON COLUMN user_profiles.language_preference IS 'User preferred language (en, ar, es, fr, etc.)';
