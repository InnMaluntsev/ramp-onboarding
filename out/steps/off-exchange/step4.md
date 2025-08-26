## Comming soon!


<!-- # Step 4: Production Onboarding & Deployment

## Onboarding Requirements (Workshop Specification)

Based on the Fireblocks workshop, Off-Exchange onboarding requires **two distinct parts**: Network Link requirements plus Off-Exchange specific requirements.

## Network Link Part ✅

### **Provider Information**
- **List of potential users** (Fireblocks and partner customers)
- **Workspace environment** (testnet/mainnet)  
- **Validation tool test results** - All tests must be green ✅
- **Logo image** - 32x32 .svg file for Fireblocks console
- **Display name** - Public name shown to customers

### **Technical Requirements**
- **API URL** - Must be HTTPS for production
- **Authentication preference** - HMAC, RSA, or ECDSA configuration
- **Test account credentials** - For Fireblocks validation testing
- **API documentation** - For publication in Help Center

## Off-Exchange Specific Part ⚡

### **Security & Compliance**
- **CSR certificate** from partner for secure communications
- **Public Key for DRS backup** - Essential for collateral workspace recovery
- **Notifications URL** - Webhook endpoint for settlement and collateral events
- **Fee preference** - Net or Gross fee calculation method

### **Legal & Business**
- **Legal agreement** between partner and Fireblocks
- **Separate CVA workspace** for each exchange provider
- **Risk management policies** for collateral and settlement operations
- **Compliance documentation** for regulatory requirements

## API Validator Certification

### **Mandatory Test Results**

Your API implementation must pass **all validation tests** before onboarding:

```
✅ Capabilities Endpoint - GET /capabilities
✅ Assets Endpoint - GET /capabilities/assets  
✅ Accounts Endpoint - GET /accounts
✅ Balances Endpoint - GET /accounts/{id}/balances
✅ Add Collateral - POST /accounts/collateral/deposits
✅ Remove Collateral - POST /accounts/collateral/intents/withdrawals
✅ Settlement Instructions - GET /accounts/collateral/settlements
✅ Execute Settlement - POST /accounts/collateral/settlements
✅ Authentication Flow - All security headers validated
✅ Error Handling - Proper HTTP status codes and error messages
```

### **Performance Benchmarks**

Your implementation must meet these production requirements:

- **Response Time**: < 500ms for all endpoints
- **Availability**: 99.9% uptime SLA
- **Throughput**: Handle 100+ concurrent requests
- **Error Rate**: < 0.1% under normal conditions
- **Security**: Pass all authentication and signature validation tests

## Fireblocks Integration Process

### **Backend Updates Required**

Fireblocks engineering team will implement:

**Provider Configuration** 🔧
- Add your exchange to the supported providers list
- Configure authentication parameters and endpoints
- Set up monitoring and alerting for your integration
- Enable Off-Exchange capabilities for your provider

**Workspace Management** 🏗️
- Create separate CVA workspace configuration
- Implement DRS backup automation using your public key
- Configure settlement and collateral operation workflows
- Set up automated CSR certificate validation

### **Frontend Changes Required**

Fireblocks will update the console interface:

**Exchange Selection** 💻
- Add your logo and display name to exchange picker
- Create provider-specific connection flow
- Implement account linking UI for CVA management
- Add collateral management interface elements

**User Experience** ✨
- Integrate your exchange into the "Connect Exchange Account" dialog
- Display account support status (Sub & trading account support)
- Provide clear collateral operation controls
- Show real-time settlement status and history

## Production Deployment Checklist

### **Phase 1: Pre-Production** 📋

- [ ] **API Validator Results** - All tests green ✅
- [ ] **Documentation Complete** - API specs, error handling, workflow guides
- [ ] **Security Audit** - Penetration testing, vulnerability assessment
- [ ] **Performance Testing** - Load testing, stress testing, failover testing
- [ ] **Legal Review** - Contracts signed, compliance verified
- [ ] **DRS Backup Setup** - Public key provided, backup process tested

### **Phase 2: Beta Testing** 🧪

- [ ] **Limited Customer Access** - Select beta customers onboarded
- [ ] **Monitoring Implementation** - Full observability and alerting
- [ ] **Support Process** - Customer support procedures established
- [ ] **Incident Response** - On-call procedures and escalation paths
- [ ] **Performance Monitoring** - Real-time metrics and SLA tracking
- [ ] **Feedback Collection** - Customer feedback and improvement tracking

### **Phase 3: General Availability** 🚀

- [ ] **Full Production Launch** - Available to all eligible customers
- [ ] **Marketing Coordination** - Launch announcements and communications
- [ ] **Customer Onboarding** - Self-service onboarding process
- [ ] **Ongoing Maintenance** - Regular updates and improvements
- [ ] **Compliance Monitoring** - Ongoing regulatory compliance
- [ ] **Performance Optimization** - Continuous improvement based on usage

## Supported Exchange Network

### **Current Live Integrations**
- **Deribit** (Generally Available)

### **Beta Program Participants** 
- **Bybit** (Beta testing)
- **HTX** (Beta testing)
- **Gate.io** (Beta testing)

### **Integration Benefits**

**For Exchanges** 🏦
- Access to 1,800+ institutional Fireblocks customers
- Reduced counterparty risk through collateral management
- Enhanced security through CVA isolation
- Automated settlement and reconciliation

**For Customers** 💼  
- Maintain custody while trading on exchanges
- Reduced exposure to exchange insolvency risk
- Seamless integration within Fireblocks console
- Professional-grade collateral management

## Off-Exchange as Service Integration

### **Advanced Implementation**

For custodians wanting to offer Off-Exchange as a service to their customers:

**Service Architecture** 🏗️
- **Partner's Main Workspace** - Customer exchange accounts
- **Partner's CVA Workspace** - Dedicated collateral vaults per exchange
- **Multiple Provider Support** - Bybit, OKX, Deribit, Gate.io connections
- **API Key Management** - Secure customer API key handling

**Legal Requirements** ⚖️
- **Legal agreements** between custodian and each off-exchange provider
- **Customer consent** for API key sharing and collateral management
- **Regulatory compliance** for custody and settlement operations
- **Risk management** policies and procedures

## Next Steps After Onboarding

### **Go-Live Process** 🚀

1. **Final Validation** - Fireblocks runs production validation tests
2. **Backend Deployment** - Fireblocks deploys your integration
3. **Frontend Release** - Console updates with your exchange option
4. **Customer Communication** - Announcements to eligible customers
5. **Monitoring Activation** - Full production monitoring enabled

### **Ongoing Partnership** 🤝

- **Regular Reviews** - Quarterly business and technical reviews
- **Feature Development** - Collaborative roadmap planning
- **Performance Optimization** - Continuous improvement initiatives
- **Customer Success** - Joint customer support and success programs

## 🎉 Congratulations!

You've successfully completed the Off-Exchange Provider implementation! Your integration is now ready to:

- ✅ **Provide secure collateral management** for institutional clients
- ✅ **Enable custody-preserving trading** on your exchange
- ✅ **Integrate seamlessly** with the Fireblocks ecosystem
- ✅ **Meet enterprise security** and compliance requirements
- ✅ **Support production-scale** operations with 99.9% uptime

**Welcome to the Fireblocks Off-Exchange Provider Network!** 🚀 -->