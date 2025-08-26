# Step 1: Understanding Network Link v2

## What is Network Link v2?

Fireblocks Network Link v2 is a **secure API framework** that enables third-party providers—exchanges, custodians, OTC desks, and banks—to integrate directly into the Fireblocks Console. This allows **1,800+ institutional clients** to interact with external services without leaving the Fireblocks environment.

## **Enablement Session Recording**

To better understand the concepts covered in this lab, watch this comprehensive enablement session:

🔗 **[Network Link v2 Enablement Session](https://drive.google.com/file/d/1c8c1liDQWbG6QhLJtHsfkB9gB-rlVY1G/view)**

*This recording provides detailed explanations and real-world examples that complement the hands-on exercises in this lab.*

## Why It Matters

**Seamless Integration**  
Connect your services directly to the Fireblocks ecosystem while customers maintain full custody and control over their assets. This direct integration enables real-time data synchronization with existing systems.

**Enhanced Security**  
Customers can interact with external services while keeping their assets secure within Fireblocks infrastructure. Every request uses cryptographic signatures with multi-signature authentication schemes including HMAC, RSA, and ECDSA.

**Foundation for Off-Exchange**   
Network Link is a foundational requirement for Off-Exchange functionality, reducing centralized system reliance and mitigating counterparty risk through standardized RESTful APIs.

**Institutional Access**   
Providers gain visibility to Fireblocks customers, enhancing access to institutional liquidity from trading desks, hedge funds, custodians, and brokerages worldwide.

## Architecture Overview

```
┌─────────────────┐    Network Link v2    ┌──────────────────┐
│                 │◄──────────────────────►│                  │
│   Fireblocks    │    Secure API calls   │   Your Service   │
│    Console      │    with signatures    │   (Exchange,     │
│                 │                       │   Bank, etc.)    │
└─────────────────┘                       └──────────────────┘
```

The integration works both ways: Fireblocks calls your APIs to get account info and balances, while you can call Fireblocks APIs for settlements and notifications.


## What You&apos;ll Build

In this hands-on lab, you&apos;ll implement the 4 mandatory endpoints that every Network Link v2 integration requires:

1. **GET /capabilities** - Declare what your system can do
2. **GET /capabilities/assets** - Define supported assets  
3. **GET /accounts** - List available accounts
4. **GET /accounts/{id}/balances** - Provide real-time balance data

## Ready to Start?

By the end of this lab, you&apos;ll have a production-ready Network Link v2 integration that can authenticate securely with Fireblocks, handle real-time data requests, pass validation tests, and scale to enterprise requirements.

Ready to dive into the authentication fundamentals! 🎯