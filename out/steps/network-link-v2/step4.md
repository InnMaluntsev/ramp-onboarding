# Step 3: Build API Responses

## Overview

Now you'll build the exact JSON responses that Fireblocks expects from your Network Link v2 integration. For each API endpoint that Fireblocks calls, you need to construct the proper response format.

**Important:** Network Link v2 includes many API endpoints for different capabilities (transfers, trading, liquidity, etc.). In this lab, we're focusing on the **4 core mandatory endpoints** that every integration must implement. These are the foundation that clients will build first, and the ones you'll most commonly help troubleshoot.

## Required Endpoints

### 1. GET /capabilities

**What Fireblocks sends:**
- Headers: X-FBAPI-KEY, X-FBAPI-SIGNATURE, X-FBAPI-TIMESTAMP, X-FBAPI-NONCE

**Your Response Requirements:**
- `version` (mandatory) - Your API version string
- `components` (mandatory) - Object listing supported capabilities
- `accounts` (mandatory) - Must be "*" (all accounts support this)
- `balances` (mandatory) - Must be "*" (all accounts support this)

**Optional capabilities:** transfers, transfersBlockchain, transfersFiat, trading, liquidity, collateral, ramps

**Rules:**
- Use "*" if ALL accounts support the capability
- Use ["account1", "account2"] if only SPECIFIC accounts support it

### 2. GET /capabilities/assets

**Your Response Requirements:**
- `assets` (array) - List of additional assets beyond standard currencies
- Each asset must have: `id`, `name`, `symbol`, `type`, `blockchain`, `decimalPlaces`
- ERC-20 tokens need `contractAddress`

**Asset Types:**
- `Erc20Token` - Ethereum ERC-20 tokens
- `BscBep20Token` - Binance Smart Chain BEP-20 tokens  
- `PolygonErc20Token` - Polygon network tokens

### 3. GET /accounts

**Your Response Requirements:**
- `accounts` (array) - List of customer accounts
- Each account must have: `id`, `title`, `status`
- Optional: `description`, `parentId`

**Account Status Options:**
- `active` - Account is operational
- `suspended` - Temporarily disabled
- `closed` - Permanently closed

### 4. GET /accounts/{accountId}/balances

**Your Response Requirements:**
- `balances` (array) - Current balances for the account
- Each balance must have: `asset`, `availableAmount`
- Optional: `lockedAmount`
- Amounts must be strings with proper decimal places

**Asset Reference Format:**
- Fiat: `{ "nationalCurrencyCode": "USD" }`
- Crypto: `{ "cryptocurrencySymbol": "BTC" }`  
- Tokens: `{ "assetId": "usdc-ethereum" }`

## Building Guidelines

**Decimal Places:**
- USD: 2 decimal places ("1000.00")
- BTC: 8 decimal places ("0.12345678") 
- USDC: 6 decimal places ("1000.123456")

**Error Response Format:**
```
400 Bad Request: {"message": "Invalid request", "errorType": "schema-error"}
404 Not Found: {"message": "Account not found", "errorType": "not-found"}
```

## 🎯 Interactive API Builder

[API_BUILDER_COMPONENT]

## ✅ Completion Requirements

To proceed to Step 4, you must successfully validate all 4 API endpoints:
- ✅ GET /capabilities
- ✅ GET /capabilities/assets  
- ✅ GET /accounts
- ✅ GET /accounts/{accountId}/balances

The "Next Step" button will be enabled once all validations pass.