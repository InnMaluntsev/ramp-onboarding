# Step 5: Build API Responses

## Interactive API Response Builder

Now that you understand Orders concepts, use cases, and security requirements, it's time to build and test your actual API responses. This interactive tool helps you construct properly formatted responses for each Orders endpoint.

## What You'll Build

The API builder below helps you create responses for:

### Mandatory Endpoints (Required)
These endpoints **must** be implemented and validated:
- **GET /capabilities** - Declare your Order capabilities and supported features
- **GET /accounts** - Account structure and management
- **GET /capabilities/assets** - List your supported custom assets

### Optional Endpoints (Choose Based on Your Use Case)
Select which additional endpoints you want to implement:

#### Core Account Management
- **GET /accounts/{id}/balances** - Balance information for accounts

#### Order Payment Processing
- **GET /accounts/{id}/capabilities/ramps** - Available Order methods for an account
- **POST /accounts/{id}/ramps** - Create new Ramp orders (on-ramp, off-ramp, bridge)
- **GET /accounts/{id}/ramps** - List Ramp transactions
- **GET /accounts/{id}/ramps/{id}** - Get specific Ramp transaction details

#### Rates & Pricing (Optional but Recommended)
- **GET /accounts/{id}/rate** - Real-time rates for asset pairs (fallback to Fireblocks internal rates if not implemented)

## Instructions

### Step 1: Select Your Implementation Scope
1. **Mandatory endpoints** are automatically included
2. **Check the optional endpoints** you want to implement
3. **Focus on Orders endpoints** if you're building payment processing features
4. **Consider implementing rates endpoint** to provide your own real-time conversion rates

### Step 2: Build and Validate Responses
1. **Select an endpoint** from the available list
2. **Use "Load Example"** to see a properly formatted response
3. **Customize the response** for your specific use case
4. **Click "Validate Response"** to check for errors
5. **Repeat for all selected endpoints**

### Step 3: Complete Validation
- **All mandatory endpoints** must be validated successfully
- **All selected optional endpoints** must be validated
- **Progress tracker** shows your completion status

## Response Builder Tool

[API_BUILDER_COMPONENT]

## Important Notes

### Rates Endpoint Benefits
If you implement **GET /accounts/{id}/rate**, you can:
- **Provide your own real-time rates** for better customer experience
- **Control pricing** instead of relying on Fireblocks fallback rates
- **Show competitive rates** specific to your liquidity sources
- **Support multiple asset pairs** with custom rate logic

### Rate Response Format
```json
{
  "rate": "0.9",
  "timestamp": 1546658861000,
  "baseAsset": {
    "nationalCurrencyCode": "USD"
  },
  "quoteAsset": {
    "nationalCurrencyCode": "EUR"
  }
}
```

### Rate Query Parameters
The rates endpoint supports these query parameters:
- `conversionPairId` - Conversion pair to get the rate for
- `rampsPairId` - RAMP pair to get the rate for  
- `orderBookPairId` - Order book pair to get the rate for

### Status Meanings
- **Pending**: Order created, waiting for payment or processing
- **Processing**: Payment received, conversion in progress
- **Completed**: Transaction successful, funds delivered
- **Failed**: Transaction failed due to error or rejection
- **Expired**: Order expired before completion (time-based)

## Validation Requirements

### Mandatory Field Validation
- **All endpoints**: Include all required fields per specification
- **Data Types**: Use correct types (strings for amounts, proper enums)
- **Asset References**: Exactly one of nationalCurrencyCode, cryptocurrencySymbol, or assetId

### Orders-Specific Validation
- **Ramp Types**: Must be "OnRamp", "OffRamp", or "Bridge"
- **Transfer Methods**: Must match supported methods (Iban, PublicBlockchain, etc.)
- **Payment Instructions**: Required for orders, must include all necessary details
- **Amounts**: String format with proper decimal precision

### Rates Endpoint Validation
- **Rate**: Must be a string representing a positive number
- **Timestamp**: Unix timestamp in milliseconds
- **Base/Quote Assets**: Proper asset reference format
- **Asset References**: Must follow same rules as other endpoints

### Amount Formatting Standards
- **USD, EUR** (fiat): 2 decimal places → `"1234.56"`
- **BTC**: 8 decimal places → `"0.12345678"`
- **USDC, USDT**: 6 decimal places → `"1234.123456"`
- **ETH**: 18 decimal places → `"1.234567890123456789"`

## Common Implementation Patterns

### On-Ramp Flow
1. **Customer initiates** fiat-to-crypto conversion
2. **System generates** payment instructions (bank details)
3. **Customer sends** fiat payment with reference ID
4. **System detects** payment and processes conversion
5. **Crypto delivered** to customer's wallet address

### Off-Ramp Flow
1. **Customer initiates** crypto-to-fiat conversion
2. **System provides** crypto deposit address
3. **Customer sends** crypto to provided address
4. **System processes** conversion and compliance checks
5. **Fiat transferred** to customer's bank account

### Bridge Flow
1. **Customer initiates** crypto-to-crypto conversion
2. **System quotes** conversion rate and fees
3. **Customer accepts** and sends source crypto
4. **System processes** conversion on target blockchain
5. **Target crypto** delivered to specified address

### Rate Provisioning Flow
1. **Fireblocks requests** current rate for asset pair
2. **Your system calculates** real-time rate from liquidity sources
3. **Return formatted rate** with timestamp
4. **Fireblocks displays** your rate to customers
5. **Fallback to internal** rates if your endpoint unavailable

## Error Response Format

Always use consistent error formatting:

```json
{
  "message": "Insufficient balance for conversion",
  "errorType": "insufficient-funds",
  "propertyName": "balanceAmount", 
  "requestPart": "body"
}
```

### Common Error Types
- `"insufficient-funds"` - Not enough balance for operation
- `"invalid-address"` - Blockchain address validation failed
- `"unsupported-asset"` - Asset not supported for operation
- `"expired-quote"` - Price quote has expired
- `"compliance-failed"` - KYC/AML checks failed
- `"rate-limit-exceeded"` - Too many requests
- `"unsupported-pair"` - Asset pair not supported for rates
- `"rate-unavailable"` - Rate temporarily unavailable

## Production Deployment Checklist

### Pre-Deployment
- [ ] All endpoint responses validated
- [ ] Security headers implemented correctly
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Compliance requirements verified
- [ ] Error handling tested comprehensively
- [ ] Rates endpoint performance tested (if implemented)

### Go-Live Process
1. **Deploy to staging** for final integration testing
2. **Use Fireblocks validation tools** for complete verification
3. **Conduct load testing** with realistic transaction volumes
4. **Submit for Fireblocks review** and approval
5. **Deploy to production** and join the provider marketplace
6. **Monitor performance** and customer adoption

## Next Steps

Once you've successfully validated all your chosen endpoints:

1. **Implement the actual backend** using these response patterns
2. **Set up proper database schemas** for orders, accounts, and transactions
3. **Integrate with payment providers** for fiat and crypto processing
4. **Implement compliance workflows** for regulatory requirements
5. **Set up rate feeds** for real-time pricing (if implementing rates endpoint)
6. **Deploy and test** in Fireblocks sandbox environment
7. **Submit for production** approval and onboarding

---

*Congratulations! You've completed the Order Capabilities onboarding guide. You're now equipped to build world-class payment infrastructure that serves institutional clients at scale.*

## Ready for Production?

Your Order Capabilities API implementation is ready when:
- ✅ All mandatory endpoints validated
- ✅ Selected optional endpoints implemented and tested
- ✅ Rates endpoint providing competitive pricing (if implemented)
- ✅ Error handling follows specification
- ✅ Security requirements met
- ✅ Compliance workflows implemented
- ✅ Performance requirements satisfied

**Next**: Deploy to staging and begin integration testing with Fireblocks!
