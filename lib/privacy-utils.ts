/**
 * Privacy & Security Utilities for P314
 * Ensures all analytics data is anonymized and aggregated
 * Complies with GDPR/CCPA requirements
 */

import type { AnonymizedQuestionData, PrivacyConfig } from "./types"

export const PRIVACY_CONFIG: PrivacyConfig = {
  enableAnonymization: true,
  retainPersonalData: false,
  aggregationOnly: true,
}

/**
 * Hash a question to anonymize it
 * No user identifiers are included in the hash
 */
export const hashQuestion = (question: string): string => {
  // Simple hash function for anonymization
  let hash = 0
  const normalized = question.toLowerCase().trim()

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

/**
 * Anonymize question data before sending to analytics
 * Removes all personally identifiable information
 */
export const anonymizeQuestionData = (question: string, category: string): AnonymizedQuestionData => {
  return {
    questionHash: hashQuestion(question),
    category,
    timestamp: Date.now(),
    count: 1, // Always 1 for individual questions, aggregated on backend
  }
}

/**
 * Validate that no personal data is included in analytics payload
 */
export const validateAnonymizedData = (data: any): boolean => {
  // Check that no user identifiers are present
  const forbiddenFields = ["userId", "username", "email", "uid", "piUsername", "accessToken"]

  for (const field of forbiddenFields) {
    if (field in data) {
      console.error(`[P314 Privacy] Personal data field detected: ${field}`)
      return false
    }
  }

  return true
}

/**
 * Sanitize data before logging for debugging
 * Removes sensitive information
 */
export const sanitizeForLogging = (data: any): any => {
  const sanitized = { ...data }

  // Remove sensitive fields
  delete sanitized.accessToken
  delete sanitized.piAccessToken
  delete sanitized.userId
  delete sanitized.username
  delete sanitized.email

  return sanitized
}

/**
 * Get privacy notice text for users
 */
export const getPrivacyNotice = (language = "en"): string => {
  const notices: Record<string, string> = {
    en: "Your questions are analyzed anonymously. No personal data is stored or shared.",
    ar: "يتم تحليل أسئلتك بشكل مجهول. لا يتم تخزين أو مشاركة أي بيانات شخصية.",
    es: "Sus preguntas se analizan de forma anónima. No se almacenan ni comparten datos personales.",
    fr: "Vos questions sont analysées de manière anonyme. Aucune donnée personnelle n'est stockée ou partagée.",
  }

  return notices[language] || notices.en
}
