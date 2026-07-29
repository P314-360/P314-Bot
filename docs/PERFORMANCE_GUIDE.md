# P314 Performance Guide

## Overview
This guide outlines performance optimization strategies and monitoring for P314.

## Core Web Vitals Targets

| Metric | Target | Status |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | - |
| INP (Interaction to Next Paint) | < 200ms | - |
| CLS (Cumulative Layout Shift) | < 0.1 | - |
| TTFB (Time to First Byte) | < 500ms | - |

## 1. Frontend Performance

### Code Splitting
```typescript
import dynamic from "next/dynamic"

// Lazy load heavy components
const ChatHistory = dynamic(() => import("@/components/chat-history"), {
  loading: () => <div>Loading...</div>,
})

// Prevent skeleton from showing for fast connections
const ChannelModal = dynamic(() => import("@/components/channel-modal"), {
  ssr: false,
})
```

### Image Optimization
```typescript
import Image from "next/image"

// ✓ Correct: Optimized with sizes
<Image
  src="/channel-avatar.jpg"
  alt="Channel avatar"
  width={100}
  height={100}
  sizes="(max-width: 640px) 50px, 100px"
  priority={false} // Set true only for above-the-fold
/>

// ✗ Wrong: Unoptimized
<img src="/channel-avatar.jpg" /> // Could be 10x larger!
```

### Bundle Size
- Target: < 500KB JS (gzipped)
- Monitor with `next/bundle-analyzer`

```bash
npm install --save-dev @next/bundle-analyzer
npx next-bundle-analyzer
```

### Rendering Strategy
```typescript
// Use Server Components where possible
// Reduces JavaScript sent to client
export default function ChannelList() {
  const channels = await fetchChannels() // Server-side
  return <div>{/* render data */}</div>
}

// Client Component only when needed
"use client"
export function InteractiveFilter() {
  const [filter, setFilter] = useState("")
  return <input onChange={(e) => setFilter(e.target.value)} />
}
```

## 2. Backend Performance

### Database Query Optimization

**DO:**
```typescript
// Index frequently queried fields
CREATE INDEX idx_user_messages_created_at ON messages(user_id, created_at DESC)

// Use pagination
const messages = await db
  .select()
  .from(messages)
  .where(eq(messages.userId, userId))
  .limit(20)
  .offset(0)

// Use SELECT only needed columns
const users = await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users)
```

**DON'T:**
```typescript
// ✗ N+1 queries
for (const user of users) {
  const messages = await db.select().from(messages).where(eq(messages.userId, user.id))
  // This runs a query for each user!
}

// ✗ Fetching all columns
const allData = await db.select().from(messages) // May include large text fields
```

### Caching Strategy
```typescript
import { cache } from "react"
import { performanceMonitor, memoize } from "@/lib/performance"

// Server-side caching
const getCachedUser = cache(async (userId: string) => {
  const timer = performanceMonitor.mark("getCachedUser")
  const user = await db.select().from(users).where(eq(users.id, userId))
  timer()
  return user
})

// Memoization for repeated calculations
const expensiveCalculation = memoize(
  (data: unknown[]) => {
    // Complex processing
    return result
  },
  { maxSize: 100, ttl: 60000 } // Cache 100 items, 60 seconds TTL
)
```

### API Response Optimization
```typescript
// Use compression
const compression = require("compression")
app.use(compression())

// Minimal response payloads
app.get("/api/channels", (req, res) => {
  const channels = fetchChannels()
  res.json(
    channels.map((c) => ({
      id: c.id,
      name: c.name,
      members: c.memberCount,
      // Don't include: full member list, all messages, etc.
    }))
  )
})
```

## 3. Monitoring Performance

### Client-Side Monitoring
```typescript
import { performanceMonitor, getWebVitals } from "@/lib/performance"

// Track specific operations
useEffect(() => {
  const timer = performanceMonitor.mark("ChannelList:render")
  // ... rendering
  const duration = timer()
  console.log(`Rendered in ${duration}ms`)
}, [])

// Get Core Web Vitals
const vitals = getWebVitals()
console.log("Web Vitals:", vitals)
```

### Server-Side Monitoring
```typescript
// Log slow database queries
const timer = performanceMonitor.mark("db:query:getChannels")
const channels = await getChannels()
timer()

// Get performance summary
const summary = performanceMonitor.getSummary()
console.log("Performance Metrics:", summary)
```

## 4. Rate Limiting Impact

Rate limiting improves performance by:
- Preventing abuse and DDoS
- Reducing unnecessary API calls
- Protecting database from overload

```typescript
// Don't make unnecessary requests
const debouncedSearch = debounce(async (query: string) => {
  const { allowed } = chatRateLimiter.check(userId)
  if (!allowed) {
    showError("Too many requests")
    return
  }
  const results = await searchChannels(query)
}, 300) // Wait 300ms before searching
```

## 5. Optimization Checklist

### Frontend
- [ ] Bundle size < 500KB (gzipped)
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Images optimized with Next.js Image
- [ ] Code splitting for heavy components
- [ ] Server Components used where possible
- [ ] Unnecessary re-renders eliminated
- [ ] Pagination implemented for lists

### Backend
- [ ] Database queries indexed properly
- [ ] N+1 queries eliminated
- [ ] Pagination implemented
- [ ] API responses include only needed data
- [ ] Caching layer implemented
- [ ] Gzip compression enabled
- [ ] Database connection pooling
- [ ] Slow query logging enabled

### Monitoring
- [ ] Web Vitals tracked
- [ ] Performance metrics logged
- [ ] Alerts set for degradation
- [ ] Regular performance audits
- [ ] User feedback collected

## 6. Tools & Commands

```bash
# Analyze bundle size
npx next-bundle-analyzer

# Run Lighthouse audit
npx lighthouse https://app.example.com --output-path=report.html

# Profile application
npm run build -- --profile

# Monitor performance
npm run monitor

# Database query analysis
ANALYZE QUERY
EXPLAIN SELECT * FROM messages WHERE user_id = $1
```

## 7. Performance Budget

Maintain these targets:
- JS Bundle: < 500KB
- CSS Bundle: < 100KB
- Total HTML: < 50KB
- Images: Optimized with Next.js
- Fonts: System fonts or 1-2 web fonts max

## 8. Degradation Strategy

If performance degrades:
1. Check Core Web Vitals dashboard
2. Identify slow operations using Performance Monitor
3. Profile with browser DevTools
4. Check database query performance
5. Review recent code changes
6. Implement targeted optimizations
7. Monitor until resolved

## Example: Optimizing Channel List

**Before (Slow):**
```typescript
export async function ChannelList() {
  const channels = await db.select().from(channels) // All columns, all rows!
  return channels.map((c) => (
    <ChannelCard key={c.id} channel={c} />
  ))
}
```

**After (Fast):**
```typescript
export async function ChannelList() {
  // Only fetch needed data with pagination
  const channels = await db
    .select({ id: channels.id, name: channels.name, membersCount: channels.memberCount })
    .from(channels)
    .limit(20)

  return (
    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
      {channels.map((c) => (
        <ChannelCard key={c.id} channel={c} />
      ))}
    </ResponsiveGrid>
  )
}
```
