# Wallet Security Guidelines for P314

## CRITICAL SECURITY POLICY

### What We Store
- **ONLY Public Wallet Addresses**: We store only the user's public Pi Network wallet address (UID)
- **NO Private Keys**: We NEVER request, store, or handle private keys
- **NO Passphrases**: We NEVER ask for or store the 24-word recovery passphrase

### Implementation

#### Pi SDK Authentication Method
```javascript
// CORRECT: Use Pi SDK's authenticate() method
const authResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound)
const publicAddress = authResult.user.uid // Public identifier only
```

#### What We NEVER Do
```javascript
// WRONG: Never ask for passphrase
// ❌ const passphrase = prompt("Enter your 24-word passphrase")

// WRONG: Never ask for private keys
// ❌ const privateKey = prompt("Enter your private key")

// WRONG: Never use createPayment for wallet linking
// ❌ const payment = await Pi.createPayment({amount: 0})
```

### Database Storage
```sql
-- We only store public wallet address
CREATE TABLE user_stats (
  user_id TEXT PRIMARY KEY,
  wallet_address TEXT,  -- Public address ONLY
  -- NO private_key column
  -- NO passphrase column
);
```

### User Communication
When requesting wallet authentication, we clearly communicate:
- "Authenticate with your Pi Wallet" (NOT "Enter your passphrase")
- "Link your public wallet address" (NOT "Provide wallet access")
- "Optional and revocable" (emphasize user control)
- "We never ask for your recovery phrase"

### Security Benefits
1. **User Safety**: Users' funds remain completely secure
2. **Non-Custodial**: We never have access to user funds
3. **Transparent**: Clear communication about what we access
4. **Revocable**: Users can disconnect at any time
5. **Pi SDK Compliant**: Uses official Pi Network authentication

### Compliance
- Follows Pi Network security best practices
- Compliant with Pi SDK Terms of Service
- Protects user privacy and financial security
- Auditable and transparent implementation

---

**Remember**: If you ever need to request payments, use Pi SDK's `createPayment()` method separately, which also never exposes private keys or passphrases.
