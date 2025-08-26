## Comming soon!


<!-- # Step 3: API Implementation & Validator Testing

## Implementation Overview

Now you'll implement the **exact API endpoints** that Off-Exchange Provider integrations require. Based on the Fireblocks workshop specifications, these endpoints enable secure collateral management and settlement operations.

## Required API Endpoints (Workshop Specification)

### **Collateral Management APIs**
- `POST /accounts/collateral/deposits` - Add collateral to CVA with wallet checks
- `POST /accounts/collateral/intents/withdrawals` - Remove collateral with pre-flight checks  
- `POST /accounts/collateral/addresses` - Notify exchange of new wallet addresses
- `GET /accounts/collateral/balances` - Get current collateral balances

### **Settlement Management APIs**
- `GET /accounts/collateral/settlements` - Get settlement instructions and status
- `POST /accounts/collateral/settlements` - Execute settlement between CVA and exchange
- `POST /accounts/collateral/settlements/force` - Force settlement execution
- `GET /accounts/collateral/signers/data` - Get collateral signer information

## Add Collateral Implementation

### POST /accounts/collateral/deposits

Implements the complete Add Collateral flow from the workshop:

```javascript
app.post('/accounts/collateral/deposits', authenticateRequest, async (req, res) => {
  try {
    const { accountId, amount, asset, walletAddress } = req.body;
    
    // Step 1: Check on CVA if wallet/asset exists
    const walletExists = await checkCVAWallet(accountId, asset);
    
    if (walletExists) {
      // Wallet exists - notify exchange of existing address
      await notifyExchangeAddress(accountId, walletAddress, asset);
      
      return res.status(200).json({
        "status": "wallet_exists",
        "message": "Wallet already exists, exchange notified",
        "walletAddress": walletAddress,
        "asset": asset
      });
    } else {
      // Wallet doesn't exist - create in CVA workspace
      const newWallet = await createCVAWallet(accountId, asset);
      
      // Notify exchange of new address
      await notifyExchangeAddress(accountId, newWallet.address, asset);
      
      // Optional: Preflight check if exchange allows deposit
      const depositAllowed = await checkDepositPermission(accountId, amount, asset);
      
      if (!depositAllowed) {
        return res.status(403).json({
          "message": "Deposit not allowed by exchange policy",
          "errorType": "deposit_rejected"
        });
      }
      
      // Process collateral deposit
      const depositResult = await processCollateralDeposit({
        accountId,
        amount: parseFloat(amount),
        asset,
        walletAddress: newWallet.address,
        status: "pending"
      });
      
      return res.status(201).json({
        "depositId": depositResult.id,
        "status": "pending",
        "amount": amount,
        "asset": asset,
        "walletAddress": newWallet.address,
        "message": "Collateral deposit initiated, pending confirmation"
      });
    }
    
  } catch (error) {
    res.status(500).json({
      "message": "Collateral deposit failed",
      "errorType": "deposit_error"
    });
  }
});
```

## Remove Collateral Implementation

### POST /accounts/collateral/intents/withdrawals

Implements the Remove Collateral flow with pre-flight checks:

```javascript
app.post('/accounts/collateral/intents/withdrawals', authenticateRequest, async (req, res) => {
  try {
    const { accountId, amount, asset, destinationAddress } = req.body;
    
    // Pre-flight check (Optional) - verify exchange allows withdrawal
    const withdrawalCheck = await checkWithdrawalPermission(accountId, amount, asset);
    
    if (!withdrawalCheck.allowed) {
      return res.status(403).json({
        "message": "Withdrawal not allowed by exchange",
        "errorType": "withdrawal_rejected",
        "reason": withdrawalCheck.reason
      });
    }
    
    // Check if trader has pending settlements
    const pendingSettlements = await getPendingSettlements(accountId);
    
    if (pendingSettlements.length > 0) {
      return res.status(400).json({
        "message": "Cannot withdraw collateral with pending settlements", 
        "errorType": "pending_obligations",
        "pendingSettlements": pendingSettlements
      });
    }
    
    // Process withdrawal intent
    const withdrawalIntent = await createWithdrawalIntent({
      accountId,
      amount: parseFloat(amount),
      asset,
      destinationAddress,
      status: "pending_approval"
    });
    
    res.status(201).json({
      "withdrawalId": withdrawalIntent.id,
      "status": "pending_approval",
      "amount": amount,
      "asset": asset,
      "destinationAddress": destinationAddress,
      "message": "Withdrawal intent created, pending exchange approval"
    });
    
  } catch (error) {
    res.status(500).json({
      "message": "Withdrawal intent failed",
      "errorType": "withdrawal_error"
    });
  }
});
```

## Settlement Implementation

### GET /accounts/collateral/settlements

Get settlement instructions for CVA and exchange:

```javascript
app.get('/accounts/collateral/settlements', authenticateRequest, async (req, res) => {
  try {
    const { accountId, status } = req.query;
    
    const settlements = await getSettlementInstructions(accountId, status);
    
    // Return settlement instructions between CVA and exchange only
    const settlementInstructions = settlements.map(settlement => ({
      "settlementId": settlement.id,
      "accountId": settlement.accountId,
      "type": settlement.type, // "incoming" or "outgoing"
      "amount": settlement.amount,
      "asset": settlement.asset,
      "status": settlement.status,
      "createdAt": settlement.createdAt,
      "instructions": settlement.instructions,
      "forceSettlement": settlement.forceSettlement || false
    }));
    
    res.json({
      "settlements": settlementInstructions,
      "total": settlementInstructions.length
    });
    
  } catch (error) {
    res.status(500).json({
      "message": "Failed to get settlement instructions",
      "errorType": "settlement_error"
    });
  }
});
```

## API Validator Integration

Now let's test your implementation using the **Fireblocks API Validator** :

## Workshop Integration Workflow Tests

Based on the workshop diagrams, here are the key workflow tests your implementation should pass:

### 🔄 **Add Collateral Workflow Test**
1. **Check CVA Wallet** - Verify if wallet/asset exists
2. **Create Wallet** (if needed) - Create new CVA wallet  
3. **Notify Exchange** - POST /accounts/collateral/addresses
4. **Preflight Check** - Verify exchange allows deposit
5. **Process Deposit** - Handle collateral addition

### 🔄 **Remove Collateral Workflow Test**
1. **Preflight Check** - Verify withdrawal permissions
2. **Check Obligations** - Ensure no pending settlements
3. **Create Intent** - Generate withdrawal request
4. **Exchange Approval** - Wait for exchange confirmation

### 🔄 **Settlement Workflow Test**
1. **Get Instructions** - Retrieve settlement requirements
2. **Initiate Settlement** - Create settlement request
3. **Customer Review** - Handle approval/denial flow
4. **Execute Settlement** - Process actual settlement
5. **Force Settlement** - Handle forced execution if needed

## Submit Your Implementation

Once you have implemented the required endpoints above, test your implementation using our interactive API validator:

### 🚀 **Testing Instructions**

1. **Start your API server** on localhost:3000 (or update the URL in the validator)
2. **Configure your API credentials** in the validator interface
3. **Run individual endpoint tests** to verify each component
4. **Execute the full validation suite** to ensure complete compatibility

### ✅ **Success Criteria**

Your implementation should pass all these validation tests:

- **Mandatory Endpoints**: capabilities, accounts, assets, balances
- **Collateral Management**: deposits, withdrawal intents, balances
- **Settlement Operations**: instructions, execution, force settlement
- **Authentication Flow**: proper header validation and signature verification

## Performance Benchmarks

Your Off-Exchange API should meet these benchmarks from the workshop:

- **Authentication**: < 100ms response time
- **Collateral Operations**: < 500ms response time  
- **Settlement Processing**: < 1000ms response time
- **Concurrent Requests**: Handle 100+ simultaneous operations
- **Error Rate**: < 0.1% under normal load
- **Availability**: 99.9% uptime requirement

## API Validator Results Interpretation

### ✅ **Green (Passed) Tests**
- Endpoint returns expected HTTP status code
- Response format matches Off-Exchange specification
- Authentication headers properly validated
- Business logic correctly implemented

### ❌ **Red (Failed) Tests**  
- Incorrect HTTP status codes
- Missing required response fields
- Authentication failures
- Business rule violations

### ⚠️ **Yellow (Warning) Tests**
- Endpoint works but with performance issues
- Non-critical specification deviations
- Optional features not implemented

## Next Steps

Once your API Validator shows **all green results**, you're ready for:

1. **Workshop Phase 3**: Testing and Troubleshooting Integration
2. **Workshop Phase 4**: Hand over to Product (Beta phase)
3. **Production Onboarding**: Submit all required documentation
4. **Beta Testing**: Work with Fireblocks PM for beta enrollment

**Your Off-Exchange Provider implementation is production-ready!** 🎉 -->