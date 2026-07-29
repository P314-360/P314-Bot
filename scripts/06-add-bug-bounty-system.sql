-- Bug Bounty System for Novel Fraud Pattern Discovery
-- المستخدمون يمكنهم الإبلاغ عن أساليب احتيال جديدة غير معروفة مسبقاً

-- جدول البلاغات المبتكرة
CREATE TABLE IF NOT EXISTS novel_fraud_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id TEXT NOT NULL,
  reporter_username TEXT NOT NULL,
  
  -- تفاصيل الأسلوب المبتكر
  fraud_method_title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_image_url TEXT,
  keywords TEXT[], -- كلمات مفتاحية لتحديث خوارزمية الكشف
  
  -- حالة المراجعة
  status TEXT NOT NULL DEFAULT 'pending_review', -- pending_review, approved, rejected
  admin_reviewer TEXT,
  admin_notes TEXT,
  reviewed_at TIMESTAMP,
  
  -- المكافأة
  bounty_amount DECIMAL(20, 8) DEFAULT 10.0, -- مكافأة كبيرة
  reputation_bonus INTEGER DEFAULT 50, -- 50 نقطة سمعة
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending_review', 'approved', 'rejected'))
);

-- فهرسة للأداء
CREATE INDEX IF NOT EXISTS idx_novel_reports_status ON novel_fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_novel_reports_reporter ON novel_fraud_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_novel_reports_created ON novel_fraud_reports(created_at DESC);

-- جدول الكلمات المفتاحية المستفادة (لتحديث خوارزمية الكشف)
CREATE TABLE IF NOT EXISTS fraud_detection_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- scam, phishing, wallet_fraud, impersonation, etc.
  severity TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  source_report_id UUID REFERENCES novel_fraud_reports(id),
  times_detected INTEGER DEFAULT 0,
  added_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- فهرسة للبحث السريع
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON fraud_detection_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_keywords_category ON fraud_detection_keywords(category);

-- جدول إشعارات البلاغات المبتكرة
CREATE TABLE IF NOT EXISTS bounty_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  report_id UUID REFERENCES novel_fraud_reports(id),
  notification_type TEXT NOT NULL, -- approved, rejected, pending
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bounty_notifs_user ON bounty_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_bounty_notifs_read ON bounty_notifications(is_read);

-- دالة لمعالجة قبول البلاغ المبتكر
CREATE OR REPLACE FUNCTION approve_novel_fraud_report(
  p_report_id UUID,
  p_admin_id TEXT,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_report RECORD;
  v_result JSON;
BEGIN
  -- جلب بيانات البلاغ
  SELECT * INTO v_report FROM novel_fraud_reports WHERE id = p_report_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'error', 'Report not found');
  END IF;
  
  IF v_report.status != 'pending_review' THEN
    RETURN json_build_object('success', FALSE, 'error', 'Report already reviewed');
  END IF;
  
  -- تحديث حالة البلاغ
  UPDATE novel_fraud_reports
  SET 
    status = 'approved',
    admin_reviewer = p_admin_id,
    admin_notes = p_admin_notes,
    reviewed_at = NOW()
  WHERE id = p_report_id;
  
  -- منح المكافأة المالية
  UPDATE user_stats
  SET 
    wallet_balance = wallet_balance + v_report.bounty_amount,
    updated_at = NOW()
  WHERE user_id = v_report.reporter_id;
  
  -- منح نقاط السمعة
  UPDATE user_stats
  SET 
    reputation_points = reputation_points + v_report.reputation_bonus,
    updated_at = NOW()
  WHERE user_id = v_report.reporter_id;
  
  -- إضافة الكلمات المفتاحية إلى خوارزمية الكشف
  IF v_report.keywords IS NOT NULL AND array_length(v_report.keywords, 1) > 0 THEN
    INSERT INTO fraud_detection_keywords (keyword, category, source_report_id)
    SELECT 
      unnest(v_report.keywords),
      'novel_pattern',
      p_report_id
    ON CONFLICT (keyword) DO UPDATE
    SET times_detected = fraud_detection_keywords.times_detected + 1;
  END IF;
  
  -- إرسال إشعار للمستخدم
  INSERT INTO bounty_notifications (user_id, report_id, notification_type, title, message)
  VALUES (
    v_report.reporter_id,
    p_report_id,
    'approved',
    'Bug Bounty Approved! 🎉',
    format('Your novel fraud pattern "%s" has been approved! You earned %s π and %s reputation points.',
      v_report.fraud_method_title,
      v_report.bounty_amount,
      v_report.reputation_bonus
    )
  );
  
  -- سجل في admin_treasury
  INSERT INTO admin_revenue_log (transaction_type, amount, description)
  VALUES (
    'bounty_payout',
    -v_report.bounty_amount,
    format('Bug bounty payout to %s for report: %s', v_report.reporter_username, v_report.fraud_method_title)
  );
  
  RETURN json_build_object(
    'success', TRUE,
    'bountyPaid', v_report.bounty_amount,
    'reputationBonus', v_report.reputation_bonus
  );
END;
$$ LANGUAGE plpgsql;

-- دالة لرفض البلاغ المبتكر
CREATE OR REPLACE FUNCTION reject_novel_fraud_report(
  p_report_id UUID,
  p_admin_id TEXT,
  p_admin_notes TEXT
)
RETURNS JSON AS $$
DECLARE
  v_report RECORD;
BEGIN
  SELECT * INTO v_report FROM novel_fraud_reports WHERE id = p_report_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'error', 'Report not found');
  END IF;
  
  IF v_report.status != 'pending_review' THEN
    RETURN json_build_object('success', FALSE, 'error', 'Report already reviewed');
  END IF;
  
  -- تحديث حالة البلاغ
  UPDATE novel_fraud_reports
  SET 
    status = 'rejected',
    admin_reviewer = p_admin_id,
    admin_notes = p_admin_notes,
    reviewed_at = NOW()
  WHERE id = p_report_id;
  
  -- إرسال إشعار للمستخدم
  INSERT INTO bounty_notifications (user_id, report_id, notification_type, title, message)
  VALUES (
    v_report.reporter_id,
    p_report_id,
    'rejected',
    'Bug Bounty Report Reviewed',
    format('Your report "%s" has been reviewed. Reason: %s',
      v_report.fraud_method_title,
      COALESCE(p_admin_notes, 'Does not meet criteria for novel fraud pattern.')
    )
  );
  
  RETURN json_build_object('success', TRUE);
END;
$$ LANGUAGE plpgsql;

-- دالة للحصول على البلاغات المعلقة (للإدارة)
CREATE OR REPLACE FUNCTION get_pending_bounty_reports()
RETURNS TABLE (
  id UUID,
  reporter_username TEXT,
  fraud_method_title TEXT,
  description TEXT,
  evidence_image_url TEXT,
  keywords TEXT[],
  bounty_amount DECIMAL,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    nfr.id,
    nfr.reporter_username,
    nfr.fraud_method_title,
    nfr.description,
    nfr.evidence_image_url,
    nfr.keywords,
    nfr.bounty_amount,
    nfr.created_at
  FROM novel_fraud_reports nfr
  WHERE nfr.status = 'pending_review'
  ORDER BY nfr.created_at ASC;
END;
$$ LANGUAGE plpgsql;
