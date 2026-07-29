# Bug Bounty System - Complete Guide

## Overview
The P314 Bug Bounty system rewards users for discovering and reporting novel fraud patterns that are not yet known to the platform's AI detection system.

## How It Works

### For Users

1. **Discover a New Fraud Pattern**
   - Find a scam method that is not currently detected by P314
   - Must be genuinely novel (not variations of existing patterns)

2. **Submit a Report**
   - Click the "+" button in the chat
   - Select "Bug Bounty 🏆"
   - Fill in:
     - **Title**: Short descriptive name (e.g., "Fake KYC Verification Site")
     - **Description**: Detailed explanation of how the scam works
     - **Keywords**: Terms to help AI detection (comma-separated)
     - **Evidence**: Screenshot or proof URL (optional)

3. **Admin Review**
   - Your report is sent to admin for manual review
   - Review typically takes 24-48 hours
   - You'll receive a notification with the decision

4. **Rewards (if approved)**
   - **10 π** added to your wallet balance
   - **50 reputation points** instant boost
   - Your discovery helps protect the entire community

### For Admins

1. **Access Bug Bounty Panel**
   - Go to Dashboard → Admin → Bug Bounty tab
   - View all pending reports

2. **Review Reports**
   - Click "Reviewing..." on any report
   - Read the description and check evidence
   - Add admin notes (especially for rejections)

3. **Make Decision**
   - **Approve**: User gets 10 π + 50 rep, keywords added to AI
   - **Reject**: User gets notification with reason, no penalty

## Criteria for Approval

A report should be approved if it meets ALL criteria:

1. **Novel**: Pattern is genuinely new, not in existing database
2. **Significant**: Poses real risk to Pi Network community
3. **Actionable**: Keywords can improve AI detection
4. **Detailed**: Clear explanation of how the scam works
5. **Verified**: Evidence supports the claim (if provided)

## Database Schema

### Tables Created

- `novel_fraud_reports`: Stores all bug bounty submissions
- `fraud_detection_keywords`: AI training keywords from approved reports
- `bounty_notifications`: User notifications for report decisions

### SQL Functions

- `approve_novel_fraud_report()`: Processes approval and rewards
- `reject_novel_fraud_report()`: Processes rejection with reason
- `get_pending_bounty_reports()`: Fetches pending admin reviews

## API Endpoints

- `POST /api/bounty/submit`: Submit new bug bounty report
- `GET /api/bounty/pending`: Get pending reports (admin only)
- `POST /api/bounty/review`: Approve or reject report (admin only)
- `GET /api/bounty/notifications`: Get user notifications

## Security Features

1. **Admin-Only Review**: All reports require manual admin approval
2. **No Spam Protection**: Users can submit multiple reports
3. **Fraud Prevention**: Keywords prevent duplicate pattern submissions
4. **Audit Trail**: All decisions logged with admin ID and notes

## Revenue Impact

Bug bounty payouts are tracked in `admin_revenue_log` as `bounty_payout` transactions. This helps monitor the cost of the program and can be adjusted based on budget.

## Future Enhancements

- AI pre-screening to filter obvious duplicates
- Tiered rewards based on severity (5π, 10π, 20π)
- Leaderboard for top bug hunters
- Community voting on pattern novelty
