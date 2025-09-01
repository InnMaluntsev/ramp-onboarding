# Step 1: Understanding Fireblocks Orders & What You'll Build

## What are Fireblocks Orders?

Order Capabilities on Fireblocks provide the foundation for seamless movement between fiat and digital assets. Through integrated on/off-ramp providers, users can easily convert fiat into crypto (on-ramp) or withdraw crypto as local fiat currency (off-ramp). Beyond fiat conversions, Order Capabilities also include crypto-to-crypto swaps, enabling straightforward asset conversion across chains via trusted CeFi providers. 

## New Orders Capabilities Capabilities (September 2025)

The Fireblocks Network now supports four core payment use cases:

- **🔄 On-Ramp**: Convert fiat currency → cryptocurrency
- **💰 Off-Ramp**: Convert cryptocurrency → fiat currency  
- **🌉 Crypto-to-Crypto**: Bridge assets across different blockchains
- **📁 Provider Directory**: Centralized discovery for global payment providers

## Why Build with RAMP?

### Business Benefits
- **Direct Access**: Tap into 1,800+ institutional clients instantly
- **Enhanced Visibility**: Get discovered within the Fireblocks ecosystem
- **Built-in Compliance**: Leverage robust Travel Rule and governance frameworks
- **Operational Efficiency**: Unified workflows for payments and reconciliation

### Supported Client Use Cases
- **Crypto Payouts**: Enable PSPs to pay users (sellers, freelancers) in crypto
- **Merchant Settlements**: Allow crypto-based merchant settlements
- **Internal Conversions**: First-party fiat ↔ crypto management
- **Cross-Chain Swaps**: Facilitate multi-blockchain asset movement

## What You'll Build: Core Implementation

### 1. Order Flows (Choose at least one)

**Prefunded Flow**
- Use existing account balance → convert → send to destination
- Best for: Customers with existing balances

**Delivery Flow (DVP)**  
- Fund on demand → convert in real-time → send to destination
- Best for: Just-in-time conversions

**Convert & Hold**
- Convert assets → hold in account for portfolio management
- Best for: Portfolio rebalancing

### 2. Pricing Methods

**Market-Based Pricing**
- Execute at live, floating rates
- Real-time market pricing

**Quote-Based Pricing**  
- Execute at locked-in price from pre-generated quote
- Fixed pricing with expiration

### 3. Required API Endpoints

**Mandatory Core Endpoints:**
```
GET /capabilities                    # Declare your RAMP capabilities
GET /capabilities/assets             # List supported assets beyond standard currencies
GET /accounts                        # Account management
GET /accounts/{accountId}            # Account details
GET /accounts/{accountId}/balances   # Balance queries (Only for Prefunded Flow)
```

**RAMP-Specific Endpoints:**
```
GET /accounts/{accountId}/capabilities/ramps  # Available RAMP methods
GET /accounts/{accountId}/ramps               # List RAMP transactions
POST /accounts/{accountId}/ramps              # Create new RAMP order
GET /accounts/{accountId}/ramps/{id}          # Get RAMP transaction details
GET /accounts/{accountId}/rate                # Get conversion rates
```

### 4. Asset Types Support
- **National Currencies**: USD, EUR, GBP, etc.
- **Native Cryptocurrencies**: BTC, ETH, etc.
- **ERC-20 Tokens**: USDC, USDT, custom tokens
- **Bucket Assets**: Custom asset containers for specific use cases

### 5. Account Structure

**Primary Accounts**: Direct customer accounts
**Sub-Accounts**: Customer's end-user accounts (B2B2C model)

Support hierarchical account management for businesses serving their own clients.

### 6. Compliance & Security

**Transaction Participants:**
- **First-Party**: Originator/beneficiary owned by order executor (pre-KYC'd)
- **Third-Party**: External parties requiring PII attachment

**Required Security Headers:**
- `X-FBAPI-KEY`: Authentication token
- `X-FBAPI-TIMESTAMP`: Request timestamp  
- `X-FBAPI-NONCE`: Unique request identifier
- `X-FBAPI-SIGNATURE`: Cryptographic signature

## Implementation Path

1. **Choose Your Capabilities**: Decide which RAMP use cases to support
2. **Implement Core Endpoints**: Start with mandatory capabilities and accounts endpoints
3. **Add RAMP Functionality**: Build your chosen order flows and pricing methods
4. **Security Implementation**: Add authentication and signature validation
5. **Testing & Validation**: Use Fireblocks validation tools
6. **Go Live**: Join the provider marketplace

## Example RAMP Flow

```
Customer Request: Convert $1,000 USD → Bitcoin

1. POST /accounts/{id}/ramps
   - Request: USD amount, BTC destination address
   - Response: Payment instructions (bank details, reference ID)

2. Customer sends USD to provided bank account

3. Upon receipt: Convert USD → BTC at agreed rate

4. Send BTC to customer's specified address

5. Update transaction status to "Completed"
```

## Next Steps

Ready to test your understanding? Let's move to **Step 2: RAMP Knowledge Check** to validate your grasp of these concepts before diving into technical implementation.

---

*Building RAMP capabilities opens the door to institutional payment flows worth billions in transaction volume. Let's get you ready to capture this opportunity!*
