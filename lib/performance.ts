/**
 * Performance Utilities
 * Tools for monitoring and improving application performance
 */

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private thresholds = {
    SLOW_API_CALL: 1000, // 1 second
    SLOW_RENDER: 100, // 100ms
    SLOW_DB_QUERY: 500, // 500ms
  }

  /**
   * Start measuring a performance metric
   */
  mark(name: string): () => number {
    const startTime = performance.now()

    return () => {
      const duration = performance.now() - startTime

      if (!this.metrics.has(name)) {
        this.metrics.set(name, [])
      }

      const metric: PerformanceMetric = {
        name,
        duration,
        timestamp: Date.now(),
      }

      this.metrics.get(name)!.push(metric)

      // Log if exceeds threshold
      if (duration > this.thresholds.SLOW_API_CALL) {
        console.warn(`[v0] Performance: ${name} took ${duration.toFixed(2)}ms`)
      }

      return duration
    }
  }

  /**
   * Get metrics for a specific measurement
   */
  getMetrics(name: string) {
    return this.metrics.get(name) || []
  }

  /**
   * Get average duration for a metric
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }

  /**
   * Clear metrics
   */
  clear(name?: string) {
    if (name) {
      this.metrics.delete(name)
    } else {
      this.metrics.clear()
    }
  }

  /**
   * Get all metrics summary
   */
  getSummary() {
    const summary: Record<string, { count: number; average: number; min: number; max: number }> = {}

    this.metrics.forEach((metrics, name) => {
      if (metrics.length === 0) return

      const durations = metrics.map((m) => m.duration)
      const total = durations.reduce((sum, d) => sum + d, 0)

      summary[name] = {
        count: metrics.length,
        average: total / metrics.length,
        min: Math.min(...durations),
        max: Math.max(...durations),
      }
    })

    return summary
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * Memoize function results
 */
export function memoize<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  options?: { maxSize?: number; ttl?: number }
): (...args: Args) => Return {
  const maxSize = options?.maxSize ?? 100
  const ttl = options?.ttl // milliseconds
  const cache = new Map<string, { result: Return; timestamp: number }>()

  return (...args: Args) => {
    const key = JSON.stringify(args)

    const cached = cache.get(key)
    if (cached) {
      if (!ttl || Date.now() - cached.timestamp < ttl) {
        return cached.result
      }
      cache.delete(key)
    }

    const result = fn(...args)

    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    cache.set(key, { result, timestamp: Date.now() })
    return result
  }
}

/**
 * Debounce function calls
 */
export function debounce<Args extends unknown[], Return>(
  fn: (...args: Args) => Return | Promise<Return>,
  delay: number
): (...args: Args) => Promise<Return> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Args) => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        try {
          const result = fn(...args)
          Promise.resolve(result).then(resolve).catch(reject)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }
}

/**
 * Throttle function calls
 */
export function throttle<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  limit: number
): (...args: Args) => Return | undefined {
  let inThrottle: boolean
  let lastRan: number

  return (...args: Args) => {
    if (!inThrottle) {
      inThrottle = true
      lastRan = Date.now()
      return fn(...args)
    } else {
      const remaining = limit - (Date.now() - lastRan)
      if (remaining <= 0) {
        inThrottle = false
        lastRan = Date.now()
        return fn(...args)
      }
    }
  }
}

/**
 * Calculate Core Web Vitals metrics
 */
export interface WebVitals {
  FCP?: number // First Contentful Paint
  LCP?: number // Largest Contentful Paint
  CLS?: number // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
  INP?: number // Interaction to Next Paint
}

export function getWebVitals(): WebVitals {
  const metrics: WebVitals = {}

  if (typeof window !== "undefined" && "performance" in window) {
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    if (navigationTiming) {
      metrics.TTFB = navigationTiming.responseStart - navigationTiming.fetchStart
    }

    const paintEntries = performance.getEntriesByType("paint")
    paintEntries.forEach((entry) => {
      if (entry.name === "first-contentful-paint") {
        metrics.FCP = entry.startTime
      }
    })
  }

  return metrics
}
