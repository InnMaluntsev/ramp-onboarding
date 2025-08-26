# The Fireblocks Network for Payments: Powering Stablecoin Payments on Your Terms

## API Order Model Overview

Our API model is designed around three core use cases. For each, you can choose Order Flows and Order Pricing Methods that align with your business operation. The entire system is governed by our policies for PII and Compliance and supports a flexible Account Structure. These capabilities are accessible to Fireblocks customers through both API and UI.

## Order Flows

A provider must choose to support at least one of the following flows.

### Prefunded, Convert & Withdraw
Uses the available balance in an account to fund the conversion, then sends the resulting asset out to an external destination. All in one single action.

### Delivery, Convert & Withdraw ('DVP')
Funds the account on demand, then, when funds arrive, converts in real-time and then sends the resulting asset out to an external destination. All in one single action.

### Prefunded, Convert & Hold Flow ('Convert')
The release of the third core order flow, enabling users to convert assets from their balance and hold the result within their account for portfolio management.

## Order Pricing Method

Providers can select one of two methods to determine the price for any order.

### Market-Based Price
- Executes the order at the live, floating rate. This corresponds to using rate discovery for a market order.

### Quote-Based Price
- Executes the order at a locked-in price from a quote. This corresponds to using quote discovery for an order prior to the order submission.
- **Note on Quote Expiration**: For Delivery orders at a Quote-Based Price, late funding by the customer will result in rejection by default and the return of the funds. Providers can optionally implement a feature that allows customers to pre-authorize an automatic re-quote and execute if their funds arrive late.

## Handling PII and Compliance

This policy layer allows providers to control the source and destination of funds based on ownership.

### First-Party
The originator/beneficiary is owned by the same entity (customer or sub-account user) executing the order. Those accounts are KYC by the provider prior to the order creation.

### Third-Party
The originator/beneficiary is owned by someone other than the entity executing the order. The originator and beneficiary PII will be attached to each order.

As a provider, you can configure to accept orders based on your compliance measurements to support only first-party, only third-party, or both. Our API enforces this by requiring PII for both the originator and beneficiary on each order.

## Account Structure

Our platform supports a versatile B2B2C account model, allowing you to serve both individual customers and businesses that have their own client base.

### Primary Accounts
Your direct customer can use their account for their own purposes.

### Sub-Accounts
Your customer can also create and manage a hierarchy of sub-accounts for their own end-users.

## Customer Interfaces

All capabilities described in this model—including use cases, order flows, and configurations—are accessible to clients via our comprehensive API and an UI within the Fireblocks console.

## Next in Line (Roadmap)

We are continuously working to expand our platform's capabilities. Here are some of the key features on our near-term roadmap:

1. **Account Management via Fireblocks**: Enhanced tools for managing main accounts and sub-accounts through a direct Fireblocks integration.

2. **KYC Management**: Tools for your customers to manage KYC for both themselves and their own end-clients directly through the network.