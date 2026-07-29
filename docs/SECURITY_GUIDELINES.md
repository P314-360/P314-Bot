# P314 Security Guidelines

## Overview
This document outlines security best practices and standards for the P314 application.

## 1. Input Validation & Sanitization

### Principles
- Never trust user input
- Validate on both client and server
- Sanitize all user-generated content
- Use allowlists instead of blocklists

### Implementation

```typescript
import { sanitizeInput, validateMessage, validateEmail } from "@/lib/input-validation"

// Validate and sanitize user message
const { valid, sanitized } = validateMessage(userInput)
if (!valid) {
  throw new Error("Invalid message")
}

// Validate email
if (!validateEmail(email)) {
  throw new Error("Invalid email format")
}
```

### Common Patterns

**DO:**
```typescript
const message = sanitizeInput(userInput)
const validated = validateMessage(message)
if (!validated.valid) return error
```

**DON'T:**
```typescript
// Never trust raw input
const message = userInput // UNSAFE!
database.save(message) // Could allow injection
```

## 2. XSS Prevention

### Content Security Policy
All CSP headers are configured in `lib/security-headers.ts`. Headers include:
- `default-src 'self'` - Default to same-origin only
- `script-src` - Restricted script sources
- `style-src` - Restricted style sources
- `frame-ancestors 'none'` - Prevent clickjacking

### Best Practices

**DO:**
```typescript
import DOMPurify from "isomorphic-dompurify"
const cleanHtml = DOMPurify.sanitize(userHtml)
```

**DON'T:**
```typescript
// Never use dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Never concatenate strings for HTML
const html = "<div>" + userInput + "</div>"
```

## 3. Authentication & Authorization

### Session Management
- Sessions expire after 24 hours (configurable)
- Guest sessions use secure tokens
- CSRF protection enabled on all forms

### Password Storage
- Use Bcrypt or Argon2 for hashing
- Never store plaintext passwords
- Minimum 8 characters with complexity requirements

### JWT Tokens
- Signed with HS256 or RS256
- Short expiration (15 minutes)
- Secure cookie storage with HttpOnly, Secure, SameSite flags

```typescript
// ✓ Correct: HttpOnly, Secure, SameSite
res.setHeader("Set-Cookie", [
  `sessionToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
])

// ✗ Wrong: Accessible from JavaScript
res.setHeader("Set-Cookie", [`sessionToken=${token}; Path=/`])
```

## 4. Rate Limiting

### Configuration
Rate limiters are pre-configured:
- **Chat**: 50 messages/minute per user
- **Auth**: 5 attempts/minute per IP
- **API**: 200 requests/minute per user
- **Global**: 100 requests/minute per IP

### Usage

```typescript
import { chatRateLimiter, authRateLimiter } from "@/lib/rate-limiter"

// Check rate limit
const { allowed, remaining, resetTime } = chatRateLimiter.check(userId)

if (!allowed) {
  return res.status(429).json({
    error: "Too many requests",
    retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
  })
}
```

### Bypass for Testing
```typescript
// Only in development
if (process.env.NODE_ENV === "development") {
  // Skip rate limiting in tests
}
```

## 5. Database Security

### NoSQL Injection Prevention
- Always use typed query parameters with the MongoDB driver — never build query objects from raw user input
- Validate and sanitize all input before using it in a MongoDB query
- Reject inputs that start with `$` to prevent operator injection

```typescript
// ✓ Correct: Typed filter
const user = await usersCollection.findOne({ piUid: piUid })

// ✗ Wrong: Raw user object spread into query
const user = await usersCollection.findOne({ ...req.body }) // injection risk!
```

### Application-Level Access Control (MongoDB)
- There is no Row Level Security in MongoDB — enforce access by scoping every query to the authenticated user's ID
- Every query that touches user data must include a `userId` or `piUid` filter
- Admin-only routes must verify the Pi username server-side before executing

```typescript
// ✓ Correct: Always scope queries to the session user
const messages = await messagesCollection.find({ sessionId, userId: session.userId }).toArray()

// ✗ Wrong: Unscoped query
const messages = await messagesCollection.find({ sessionId }).toArray() // any user's data!
```

## 6. Sensitive Data

### What's Considered Sensitive
- User IDs and email addresses
- Private keys and tokens
- Payment information
- Personal messages

### Best Practices

**DO:**
```typescript
// Minimal data exposure
const publicProfile = {
  id: user.id,
  username: user.username,
  avatar: user.avatar,
}

// Never include in responses
// - passwords
// - API keys
// - refresh tokens
// - session tokens
```

**DON'T:**
```typescript
// NEVER return sensitive data
res.json(user) // Contains everything!

// Use specific selection
const { password, apiKey, ...safeUser } = user
res.json(safeUser)
```

## 7. API Security

### Authentication
- Require authentication for all protected endpoints
- Validate tokens on every request
- Implement token refresh mechanism

### Headers
All security headers configured via `lib/security-headers.ts`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security

### CORS
- Configure CORS for trusted origins only
- Never use `*` for origins in production

```typescript
// ✗ WRONG in production
cors({
  origin: "*", // DANGEROUS!
})

// ✓ Correct
cors({
  origin: process.env.ALLOWED_ORIGINS?.split(","),
  credentials: true,
})
```

## 8. Error Handling

### General Principle
- Show minimal error details to users
- Log detailed errors server-side
- Never expose stack traces to clients

```typescript
// ✓ Correct: Generic user message
catch (error) {
  console.error("[Internal] Database error:", error)
  res.status(500).json({ error: "Something went wrong" })
}

// ✗ Wrong: Exposing internals
catch (error) {
  res.status(500).json({ error: error.message, stack: error.stack })
}
```

## 9. Dependencies

### Security Scanning
- Run `npm audit` regularly
- Enable Dependabot for automated PRs
- Review and update dependencies monthly

```bash
# Regular security audits
npm audit
npm audit fix

# Check for vulnerabilities
npx snyk test
```

### Trusted Sources
- Use official NPM packages
- Verify package maintainers
- Check package size and dependencies

## 10. Environment Variables

### Sensitive Configuration
- Never commit `.env` to git
- Use `.env.local` for local development
- Rotate secrets regularly in production

```bash
# ✓ Correct structure
DATABASE_URL=...
API_KEY=...
JWT_SECRET=... (rotate regularly)
```

## 11. Compliance

### Data Protection
- GDPR compliance for EU users
- Data deletion on request
- Clear privacy policy

### Audit Trail
- Log important security events
- Track authentication attempts
- Monitor suspicious activity

## 12. Incident Response

### Security Issues
If you discover a security vulnerability:
1. Don't commit exploits to version control
2. Report privately to security team
3. Don't discuss publicly until patch released
4. Credit researchers appropriately

### Response Timeline
- Critical: 24 hours
- High: 72 hours
- Medium: 1 week
- Low: 30 days

## Testing Security

### Automated Testing
```bash
# Run security checks
npm audit
npx tsc --noEmit # Type checking
npx eslint . # Linting
```

### Manual Testing
- Test with invalid input
- Attempt injection attacks
- Test authentication bypass
- Check CORS behavior

## Checklist

- [ ] All inputs validated server-side
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection enabled (CSP headers)
- [ ] CSRF tokens on all forms
- [ ] Authentication required for protected endpoints
- [ ] Rate limiting configured
- [ ] Sensitive data never logged
- [ ] Error messages generic
- [ ] Dependencies up-to-date
- [ ] Security headers enabled
- [ ] HTTPS enforced in production
- [ ] Regular security audits scheduled
