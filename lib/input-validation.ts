/**
 * Input Validation Utilities
 * Provides functions for sanitizing and validating user inputs
 */

import DOMPurify from "isomorphic-dompurify"

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br"],
    ALLOWED_ATTR: ["href"],
    KEEP_CONTENT: true,
  })
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate username (alphanumeric, 3-30 characters)
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
  return usernameRegex.test(username)
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (typeof input !== "string") {
    throw new ValidationError("Input must be a string")
  }

  // Limit length
  let sanitized = input.substring(0, maxLength)

  // Remove null characters
  sanitized = sanitized.replace(/\0/g, "")

  // Trim whitespace
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Validate message content
 */
export function validateMessage(message: string): { valid: boolean; sanitized: string } {
  try {
    const sanitized = sanitizeInput(message, 5000)

    if (sanitized.length < 1) {
      return { valid: false, sanitized: "" }
    }

    if (sanitized.length > 5000) {
      return { valid: false, sanitized: "" }
    }

    return {
      valid: true,
      sanitized,
    }
  } catch {
    return { valid: false, sanitized: "" }
  }
}

/**
 * Validate channel name
 */
export function validateChannelName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9_\-\s]{3,50}$/
  return nameRegex.test(name)
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  strength: "weak" | "medium" | "strong"
  feedback: string[]
} {
  const feedback: string[] = []
  let strength: "weak" | "medium" | "strong" = "weak"

  if (password.length < 8) {
    feedback.push("Password must be at least 8 characters")
    return { valid: false, strength, feedback }
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Password must contain lowercase letters")
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push("Password must contain uppercase letters")
  }
  if (!/[0-9]/.test(password)) {
    feedback.push("Password must contain numbers")
  }
  if (!/[!@#$%^&*]/.test(password)) {
    feedback.push("Password must contain special characters (!@#$%^&*)")
  }

  if (feedback.length === 0) {
    strength = "strong"
    return { valid: true, strength, feedback: ["Strong password"] }
  }

  if (feedback.length <= 2) {
    strength = "medium"
  }

  return { valid: false, strength, feedback }
}

/**
 * Validate and parse JSON safely
 */
export function safeJsonParse<T = unknown>(jsonString: string): { valid: boolean; data?: T; error?: string } {
  try {
    const data = JSON.parse(jsonString) as T
    return { valid: true, data }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    }
  }
}
