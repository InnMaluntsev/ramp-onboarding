# Step 3: Authentication & Signature

## Security Framework Overview

All Fireblocks RAMP API communications require robust security measures to protect institutional-grade transactions. This step covers the authentication and signature requirements for your RAMP integration.

## Required Security Headers

Every API request must include these four security headers:

### X-FBAPI-KEY
- **Purpose**: Secret token to identify and authenticate the API caller
- **Format**: String
- **Example**: `"fb-api-key-abc123xyz789"`

### X-FBAPI-TIMESTAMP  
- **Purpose**: Request creation time in UTC
- **Format**: Milliseconds since Unix Epoch
- **Example**: `1691606624184` (2023-08-09T18:43:44.184Z)

### X-FBAPI-NONCE
- **Purpose**: Request universal unique identifier  
- **Format**: UUID
- **Example**: `"c3d5f400-0e7e-4f94-a199-44b8cc7b6b81"`

### X-FBAPI-SIGNATURE
- **Purpose**: Cryptographic signature of the request
- **Format**: Base64, HexStr, Base58, or Base32 encoded signature
- **Calculation**: See signature process below

## Signature Calculation Process

### Step 1: Build the Message to Sign

Concatenate these request components **in this exact order**:

1. **Timestamp** (from X-FBAPI-TIMESTAMP header)
2. **Nonce** (from X-FBAPI-NONCE header)  
3. **HTTP Method** (uppercase: GET, POST, PUT, DELETE)
4. **Endpoint Path** (including query parameters, without domain)
5. **Request Body** (if present, otherwise empty string)

### Example Message Construction

For this request:
```
GET /accounts/A1234/balances?limit=2
X-FBAPI-TIMESTAMP: 1691606624184
X-FBAPI-NONCE: c3d5f400-0e7e-4f94-a199-44b8cc7b6b81
```

The message to sign would be:
```
1691606624184c3d5f400-0e7e-4f94-a199-44b8cc7b6b81GET/accounts/A1234/balances?limit=2
```

### Step 2: Apply Cryptographic Operations

Choose your signing method during onboarding. Options include:

**Pre-encoding Options:**
- URL encoded
- Base64  
- HexStr
- Base58
- Base32

**Signing Algorithms:**
- **HMAC**: SHA512, SHA3_256, or SHA256
- **RSA PKCS1v15**: SHA512, SHA3_256, or SHA256  
- **ECDSA**: prime256v1/secp256k1 with SHA256

**Post-encoding Options:**
- Base64
- HexStr  
- Base58
- Base32

### Step 3: Include in Request

Add the computed signature to the `X-FBAPI-SIGNATURE` header.

## Example Implementation

### Node.js/TypeScript Example

```typescript
import crypto from 'crypto';

function generateSignature(
  timestamp: number,
  nonce: string,
  method: string,
  endpoint: string,
  body: string = '',
  secret: string
): string {
  // Step 1: Build message to sign
  const message = `${timestamp}${nonce}${method.toUpperCase()}${endpoint}${body}`;
  
  // Step 2: Create HMAC signature (example using SHA256)
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
    
  return signature;
}

// Usage
const timestamp = Date.now();
const nonce = crypto.randomUUID();
const signature = generateSignature(
  timestamp,
  nonce,
  'GET',
  '/accounts/A1234/balances?limit=2',
  '',
  'your-secret-key'
);
```

### Python Example

```python
import hmac
import hashlib
import time
import uuid

def generate_signature(timestamp, nonce, method, endpoint, body='', secret=''):
    # Build message to sign
    message = f"{timestamp}{nonce}{method.upper()}{endpoint}{body}"
    
    # Create HMAC signature
    signature = hmac.new(
        secret.encode('utf-8'),
        message.encode('utf-8'), 
        hashlib.sha256
    ).hexdigest()
    
    return signature

# Usage
timestamp = int(time.time() * 1000)
nonce = str(uuid.uuid4())
signature = generate_signature(
    timestamp,
    nonce,
    'GET',
    '/accounts/A1234/balances?limit=2',
    '',
    'your-secret-key'
)
```

## Security Best Practices

### Timestamp Validation
- Implement timestamp checks to prevent replay attacks
- Typical tolerance: ±5 minutes from current time
- Reject requests with timestamps too old or too new

### Nonce Management  
- Store used nonces temporarily to prevent reuse
- Implement nonce expiration (typically 24 hours)
- Use cryptographically secure random generation

### Secret Key Management
- Store API secrets securely (environment variables, key management systems)
- Rotate keys regularly
- Never expose secrets in client-side code

### Request Validation
- Validate all required headers are present
- Verify signature before processing requests
- Return 401 Unauthorized for invalid signatures

## Common Implementation Errors

### ❌ Incorrect Message Order
```
// WRONG - incorrect order
nonce + timestamp + method + endpoint + body

// CORRECT - required order  
timestamp + nonce + method + endpoint + body
```

### ❌ Missing Query Parameters
```
// WRONG - missing query parameters
/accounts/A1234/balances

// CORRECT - include full path
/accounts/A1234/balances?limit=2
```

### ❌ Case Sensitivity
```
// WRONG - lowercase method
get

// CORRECT - uppercase method
GET
```

### ❌ Body Handling
```
// WRONG - including body for GET requests
timestamp + nonce + GET + endpoint + undefined

// CORRECT - empty string for GET
timestamp + nonce + GET + endpoint + ""
```

## Testing Your Implementation

### Validation Checklist

- [ ] All four headers included in every request
- [ ] Timestamp in correct format (milliseconds since epoch)
- [ ] Nonce is valid UUID format
- [ ] Message built in correct order
- [ ] Signature calculation matches chosen algorithm
- [ ] Proper encoding applied to signature

### Test Cases

1. **GET Request**: Test with query parameters
2. **POST Request**: Test with JSON body
3. **Empty Body**: Ensure empty string used (not null/undefined)
4. **Special Characters**: Test with URL-encoded parameters
5. **Large Payloads**: Verify signature with large request bodies

## Authentication Quiz

Test your understanding of the security requirements:

<!--QUIZ_PLACEHOLDER-->

## Next Steps

Once you've mastered authentication and signatures, you're ready for **Step 4: Build API Responses** where you'll use interactive tools to construct and validate your RAMP API responses.

---

*Security is paramount in institutional finance. Get this right, and you'll have the foundation for trusted, high-value RAMP transactions.*