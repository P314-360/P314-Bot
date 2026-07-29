/**
 * Guest Session Management
 * Handles guest user sessions with expiration tracking and feature restrictions
 */

export interface GuestSessionData {
  guestId: string
  guestUsername: string
  createdAt: number
  expiresAt: number
  features: GuestFeatures
}

export interface GuestFeatures {
  canViewChannels: boolean
  canViewChat: boolean
  canPostMessages: boolean
  canCreateChannel: boolean
  chatMessageLimit: number
  messagesUsed: number
}

const GUEST_SESSION_KEY = "p314_guest_session"
const GUEST_SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const GUEST_MESSAGE_LIMIT = 50 // Max messages per guest session

/**
 * Initialize a new guest session
 */
export function createGuestSession(): GuestSessionData {
  const now = Date.now()
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`

  const session: GuestSessionData = {
    guestId,
    guestUsername: "Guest Pioneer",
    createdAt: now,
    expiresAt: now + GUEST_SESSION_DURATION,
    features: {
      canViewChannels: true,
      canViewChat: true,
      canPostMessages: false, // Guests cannot post
      canCreateChannel: false, // Guests cannot create channels
      chatMessageLimit: GUEST_MESSAGE_LIMIT,
      messagesUsed: 0,
    },
  }

  return session
}

/**
 * Save guest session to localStorage
 */
export function saveGuestSession(session: GuestSessionData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session))
  }
}

/**
 * Load guest session from localStorage
 */
export function loadGuestSession(): GuestSessionData | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(GUEST_SESSION_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as GuestSessionData
  } catch {
    return null
  }
}

/**
 * Check if guest session is expired
 */
export function isGuestSessionExpired(session: GuestSessionData): boolean {
  return Date.now() > session.expiresAt
}

/**
 * Get or create guest session
 */
export function getOrCreateGuestSession(): GuestSessionData {
  let session = loadGuestSession()

  if (!session || isGuestSessionExpired(session)) {
    session = createGuestSession()
    saveGuestSession(session)
  }

  return session
}

/**
 * Clear guest session
 */
export function clearGuestSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GUEST_SESSION_KEY)
  }
}

/**
 * Update guest username
 */
export function updateGuestUsername(username: string): void {
  const session = loadGuestSession()
  if (session) {
    session.guestUsername = username
    saveGuestSession(session)
  }
}

/**
 * Increment message count for guest
 */
export function incrementGuestMessageCount(): boolean {
  const session = loadGuestSession()
  if (!session) return false

  if (session.features.messagesUsed < session.features.chatMessageLimit) {
    session.features.messagesUsed++
    saveGuestSession(session)
    return true
  }

  return false
}

/**
 * Check if guest can post message
 */
export function canGuestPostMessage(session: GuestSessionData): boolean {
  return (
    session.features.canPostMessages &&
    session.features.messagesUsed < session.features.chatMessageLimit &&
    !isGuestSessionExpired(session)
  )
}

/**
 * Get remaining guest message quota
 */
export function getGuestRemainingMessages(session: GuestSessionData): number {
  return session.features.chatMessageLimit - session.features.messagesUsed
}

/**
 * Check if session is guest
 */
export function isGuestSession(session: any): boolean {
  return session && session.guestId && typeof session.guestId === "string" && session.guestId.startsWith("guest_")
}

/**
 * Get time remaining for guest session (in milliseconds)
 */
export function getGuestSessionTimeRemaining(session: GuestSessionData): number {
  const remaining = session.expiresAt - Date.now()
  return remaining > 0 ? remaining : 0
}

/**
 * Format guest session expiry time to readable string
 */
export function formatGuestSessionExpiry(session: GuestSessionData): string {
  const remaining = getGuestSessionTimeRemaining(session)
  const hours = Math.floor(remaining / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
