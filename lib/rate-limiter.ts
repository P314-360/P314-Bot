import { LRUCache } from "lru-cache"

interface RateLimitConfig {
  maxRequests: number
  windowMs: number // milliseconds
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private config: RateLimitConfig
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
    this.config = config
    this.startCleanupInterval()
  }

  private startCleanupInterval() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      Object.keys(this.store).forEach((key) => {
        if (this.store[key].resetTime < now) {
          delete this.store[key]
        }
      })
    }, 60000)
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = identifier

    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.config.windowMs,
      }
    }

    const record = this.store[key]

    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0
      record.resetTime = now + this.config.windowMs
    }

    const allowed = record.count < this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - record.count)

    if (allowed) {
      record.count++
    }

    return {
      allowed,
      remaining,
      resetTime: record.resetTime,
    }
  }

  reset(identifier: string) {
    delete this.store[identifier]
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Export singleton instance
export const globalRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 1 minute
})

// Specific limiters for different endpoints
export const chatRateLimiter = new RateLimiter({
  maxRequests: 50, // 50 messages per minute
  windowMs: 60000,
})

export const authRateLimiter = new RateLimiter({
  maxRequests: 5, // 5 auth attempts per minute
  windowMs: 60000,
})

export const apiRateLimiter = new RateLimiter({
  maxRequests: 200, // 200 API calls per minute
  windowMs: 60000,
})
