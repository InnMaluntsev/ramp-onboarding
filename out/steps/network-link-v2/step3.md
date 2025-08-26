# Step 3: Authentication & Signature Quiz

## Understanding Authentication

Network Link v2 uses cryptographic signatures to ensure secure communication between Fireblocks and your service. Every API request must include specific headers and a valid signature.

## Required Headers

All REST requests must contain these headers:

```
X-FBAPI-KEY: The API key as a string
X-FBAPI-SIGNATURE: The payload signature output
X-FBAPI-TIMESTAMP: Request timestamp in milliseconds since Unix Epoch
X-FBAPI-NONCE: A unique reference to the request (Random UUID)
```

## Signature Process Overview

The signature is created by:
1. **Building the message**: `timestamp + nonce + method + endpoint + body`
2. **Pre-encoding** (configurable): PLAIN, BASE64, HEXSTR, BASE58, BASE32
3. **Signing** with chosen algorithm: HMAC, RSA, or ECDSA
4. **Post-encoding** (configurable): PLAIN, BASE64, HEXSTR, BASE58, BASE32

## Knowledge Check

<!--QUIZ_PLACEHOLDER-->

## What's Next?

After mastering the authentication concepts, you'll move on to building actual API responses that comply with Fireblocks requirements.