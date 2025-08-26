## Comming soon!


<!-- # Step 2: API Authentication & Mandatory Capabilities

## Off-Exchange Authentication Framework

Off-Exchange as Provider builds on **Network Link v2 authentication** with additional collateral-specific capabilities. Every API request must include cryptographic signatures to ensure secure communication between your exchange and Fireblocks.

### Required Authentication Headers

All REST requests must contain these headers:

- **X-FBAPI-KEY**: The API key as a string
- **X-FBAPI-SIGNATURE**: Signature created with SECRET string and signing algorithm  
- **X-FBAPI-TIMESTAMP**: Request timestamp in milliseconds since Unix Epoch
- **X-FBAPI-NONCE**: A unique reference to the request (Random UUID)

### Signature Process

The signature is created by:
1. **Building the message**: `timestamp + nonce + method + endpoint + body`
2. **Pre-encoding** (configurable): PLAIN, BASE64, HEXSTR, BASE58, BASE32
3. **Signing** with chosen algorithm: HMAC, RSA, or ECDSA
4. **Post-encoding** (configurable): PLAIN, BASE64, HEXSTR, BASE58, BASE32

## Mandatory Capabilities

All Off-Exchange Provider integrations must implement these four mandatory capabilities:

### Core Network Link Capabilities 🏗️

**Capabilities** - All supported capabilities per account and dependencies for each one  
**Accounts** - Support for sub-accounts and exchange account management  
**Assets** - All supported assets: Crypto, FIAT, Tokens, Bucket Assets  
**Balances** - Balance per asset listed on each account

### Off-Exchange Specific Capabilities ⚡

**Transfers** - Underlying capability to allow any transfer operation  
**Blockchain Transfers** - Support for blockchain-based transfers  
**Collateral** - Off-Exchange capabilities: Add/Remove collateral, settlement management  
**Exchange To Fireblocks** - API endpoints originated on the Exchange side and received by Fireblocks

## API Authentication Flow

```
┌─────────────────┐    Authentication     ┌──────────────────┐
│                 │    Request/Response   │                  │
│   End-User      │◄─────────────────────►│  Partner's       │
│                 │    API Key/SECRET     │  Interface       │
└─────────────────┘                       └──────────────────┘
         │                                          │
         │ Link Account (API Key+SECRET)            │
         ▼                                          ▼
┌─────────────────┐    Secure API Call    ┌──────────────────┐
│                 │    X-FBAPI Headers    │                  │
│ Fireblocks      │◄─────────────────────►│  Partner's API   │
│ Console         │    with Signatures    │                  │
└─────────────────┘                       └──────────────────┘
```

<!--QUIZ_PLACEHOLDER-->

## CVA Account Linking Process

### Off-Exchange Link Account Flow

**User Request** → **Partner's API** → **Main Fireblocks Console** → **CVA Creation**

1. **Request API Key and Secret** from user with Off-Exchange permissions
2. **Response with API Key and Secret** enables Off-Exchange operations  
3. **Link Account** connects exchange account to Fireblocks CVA
4. **Add Collateral** flow checks if CVA wallet/asset exists
5. **POST /accounts/collateral/addresses** notifies exchange of new addresses
6. **Vault account created** on CVA workspace for secure collateral management

## Security Requirements

**API Creation** - Must be created with proper Off-Exchange permissions  
**Partner Guidelines** - Each partner must provide guidelines on secure API creation  
**CVA Workspace** - Separate workspace for collateral management with restricted access  
**Signature Validation** - All requests validated using cryptographic signatures

## Next Steps

Now that you understand the authentication framework and mandatory capabilities, let&apos;s implement the actual API endpoints that enable secure collateral management and settlement operations.

Ready to build production-grade Off-Exchange APIs! 🎯 -->