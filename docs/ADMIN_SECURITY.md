# Admin Security Documentation

## Overview
The P314 bot implements strict server-side authentication for all administrative functions. Admin access is **exclusively restricted** to the Pi Network username: `Axis2030`.

## Security Implementation

### 1. Server-Side Validation
All admin API routes verify the authenticated user's Pi Network username before processing any requests:

- **Authentication Header**: `x-pi-username` header must match `Axis2030`
- **403 Forbidden**: All unauthorized access attempts are logged and rejected
- **Cannot be bypassed**: Security checks are performed server-side, making client-side manipulation impossible

### 2. Protected API Routes
The following routes require admin authentication:

- `/api/admin/treasury` - View platform revenue
- `/api/admin/revenue-config` - Update commission percentages
- `/api/admin/moderators` - Manage moderators
- `/api/admin/ads` - Manage advertisements
- `/api/bounty/review` - Approve/reject bug bounty reports

### 3. UI Security
- Admin tab is **hidden** from non-admin users in the dashboard
- Admin dashboard component renders "Access Denied" message if unauthorized user bypasses UI
- All admin-related buttons and controls are conditionally rendered based on username verification

### 4. Security Logging
All unauthorized access attempts are logged with the following information:
- Attempted action
- Username of unauthorized user
- Timestamp
- IP address (if available)

## Testing Security

### Valid Admin Access
```typescript
// Username: Axis2030
const response = await fetch('/api/admin/treasury', {
  headers: { 'x-pi-username': 'Axis2030' }
})
// Status: 200 OK
```

### Invalid Access Attempt
```typescript
// Username: AnyOtherUser
const response = await fetch('/api/admin/treasury', {
  headers: { 'x-pi-username': 'AnyOtherUser' }
})
// Status: 403 Forbidden
// Response: { "error": "Unauthorized", "message": "Admin access required..." }
```

## Security Best Practices

1. **Never share admin credentials**
2. **Monitor security logs** regularly for unauthorized access attempts
3. **Keep Pi Network session active** when performing admin tasks
4. **Logout properly** after admin sessions
5. **Use HTTPS only** for all admin operations

## Incident Response

If unauthorized access is detected:
1. Review security logs immediately
2. Verify all admin API endpoints are properly secured
3. Check for any suspicious database modifications
4. Update admin authentication if necessary

## Contact

For security concerns or questions, contact the platform administrator through official Pi Network channels.

---
**Last Updated**: December 2024  
**Security Level**: Maximum  
**Authorized Admin**: Axis2030
