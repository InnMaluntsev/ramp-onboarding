## Comming soon!


<!-- # Step 1: Understanding Hosted MPC Architecture

## Overview

Welcome to the Fireblocks Hosted MPC Workshop! In this lab, you'll learn how to deploy and manage your own Multi-Party Computation (MPC) infrastructure for complete control over your cryptographic key material.

**🎯 Learning Objectives:**
- Understand Hosted MPC architecture and benefits
- Learn about co-signer deployment patterns
- Explore security features and compliance requirements
- Set up the foundation for your own Hosted MPC environment

---

## What is Hosted MPC?

**Hosted MPC (Multi-Party Computation)** is Fireblocks' enterprise-grade solution that enables large institutions and regulated entities to take **complete control** of their wallet key material. Unlike standard Fireblocks SaaS deployments, Hosted MPC eliminates dependency on Fireblocks for transaction signing.

### Key Differences

| Standard Fireblocks | Hosted MPC |
|-------------------|------------|
| 1 key share on customer device | **All 3 key shares** customer-controlled |
| 2 shares managed by Fireblocks | **Zero shares** with Fireblocks |
| Cloud-based co-signers | **Customer-hosted** co-signers |
| Shared infrastructure | **Dedicated** secure enclaves |

---

## 🏗️ Architecture Overview

Hosted MPC distributes private key shares across **three distinct Co-Signers**, each operating within a trusted execution environment:

### The Three Co-Signers

#### 🛡️ **Guard Co-Signer #1**
- **Location**: Customer's cloud or on-premises environment
- **Security**: Intel SGX-protected secure enclave
- **Purpose**: Holds one MPC key share, serves as quorum backbone
- **Redundancy**: Part of logical "sets" for failover support

#### 🛡️ **Guard Co-Signer #2** 
- **Location**: Different availability zone/data center from Guard #1
- **Security**: Another customer-hosted secure enclave
- **Purpose**: Provides redundancy and high availability
- **Failover**: Can substitute if Guard #1 becomes unavailable

#### 📱 **Primary Co-Signer**
- **Options**: Mobile device (SDK) or backend enclave (API Co-Signer)
- **Security**: Secure enclave storage (Keychain/Trusty TEE)
- **Role**: Initiates signing process, contributes first key share
- **Authentication**: PIN + biometric or hardware security key

### Clique Formation

These three co-signers form a **"clique"** - a valid set of devices that can participate in signing transactions. The system dynamically selects cliques based on:
- Co-signer availability
- Health check status  
- Signing schema defined in workspace
- Failover requirements

---

## 🔐 Security Architecture

### Intel SGX Enclaves
- **Trusted Execution**: Co-signers operate inside trusted memory space
- **Code Integrity**: Runtime integrity enforced via SGX POST checks
- **Attestation**: Remote attestation ensures enclave authenticity

### MPC-CMP Protocol
- **4-Round Threshold Signing**: No key reconstruction required
- **Air-Gapped Support**: Enables offline signing capabilities
- **Preprocessed Signing**: Optimized for high-frequency operations

### Certificate-Based Identity
- **CSR Workflow**: Each co-signer gets unique Fireblocks-issued certificates
- **Mutual TLS**: All communication secured with mTLS
- **Identity Binding**: Cryptographic proof of co-signer authenticity

### Optional HSM Integration
- **Hardware Key Sealing**: DB-KEY encrypted with customer-managed HSM
- **PKCS#11 Interface**: Standard HSM integration protocol
- **Layered Protection**: Multiple levels of encryption

---

## 🌐 Communication Flow

```
┌─────────────────┐    mTLS    ┌─────────────────┐
│   Guard Co-     │◄──────────►│   Fireblocks    │
│   Signer #1     │            │   SaaS Services │
└─────────────────┘            │                 │
                               │ • Signing Engine│
┌─────────────────┐            │ • Policy Engine │
│   Guard Co-     │◄──────────►│ • Tx Manager    │
│   Signer #2     │            │ • Secure Vault  │
└─────────────────┘            └─────────────────┘
                               
┌─────────────────┐            
│   Primary       │◄──────────►
│   Co-Signer     │            
└─────────────────┘            
```

All communication between your hosted infrastructure and Fireblocks' cloud services uses **mutual TLS (mTLS)** for encrypted, authenticated channels.

---

## 🏢 Use Cases & Benefits

### Who Needs Hosted MPC?

#### **Banks & Financial Institutions**
- ✅ Regulatory compliance requirements
- ✅ Air-gapped deployment mandates
- ✅ Jurisdiction-specific data residency
- ✅ Internal security policy alignment

#### **Asset Custodians**
- ✅ Complete key material control
- ✅ Client fund segregation
- ✅ Audit trail transparency
- ✅ Insurance requirement compliance

#### **Crypto Exchanges**
- ✅ Hot wallet security enhancement
- ✅ Cold storage integration
- ✅ High-frequency trading support
- ✅ Multi-geography deployment

### Key Benefits

#### **🔒 Complete Control**
- All private key shares under customer control
- No dependency on third-party signing services
- Full cryptographic sovereignty

#### **🏛️ Regulatory Compliance**
- Meets strict compliance requirements
- Supports air-gapped deployments
- Enables jurisdiction-specific hosting

#### **⚡ High Availability**
- Redundant co-signer sets
- Automatic failover capabilities
- Geographic distribution support

#### **🔧 Scalability**
- Horizontal scaling of Guard Co-Signers
- Multiple Primary Co-Signers supported
- Parallel workspace environments (dev/staging/prod)

---

## 🏗️ Deployment Topology Example

```
                    Customer Infrastructure
    ┌─────────────────────────────────────────────────────┐
    │                                                     │
    │  ┌─────────────────┐     ┌─────────────────┐       │
    │  │ Availability    │     │ Availability    │       │
    │  │ Zone A          │     │ Zone B          │       │
    │  │                 │     │                 │       │
    │  │ ┌─────────────┐ │     │ ┌─────────────┐ │       │
    │  │ │Primary      │ │     │ │Primary      │ │       │
    │  │ │Co-Signer #1 │ │     │ │Co-Signer #2 │ │       │
    │  │ └─────────────┘ │     │ └─────────────┘ │       │
    │  │                 │     │                 │       │
    │  │ ┌─────────────┐ │     │ ┌─────────────┐ │       │
    │  │ │Guard        │ │     │ │Guard        │ │       │
    │  │ │Co-Signer #1 │ │     │ │Co-Signer #2 │ │       │
    │  │ └─────────────┘ │     │ └─────────────┘ │       │
    │  │       Set 1     │     │       Set 1     │       │
    │  │                 │     │                 │       │
    │  │ ┌─────────────┐ │     │ ┌─────────────┐ │       │
    │  │ │Guard        │ │     │ │Guard        │ │       │
    │  │ │Co-Signer #4 │ │     │ │Co-Signer #5 │ │       │
    │  │ └─────────────┘ │     │ └─────────────┘ │       │
    │  │       Set 2     │     │       Set 2     │       │
    │  └─────────────────┘     └─────────────────┘       │
    │                                                     │
    └─────────────────────────────────────────────────────┘
                                │
                                │ mTLS
                                ▼
                    ┌─────────────────────┐
                    │   Fireblocks SaaS   │
                    │   • Policy Engine   │
                    │   • Signing Engine  │ 
                    │   • Transaction Mgr │
                    └─────────────────────┘
```

### Sets and Cliques Explained

**Sets**: Logical groups of Guard Co-Signers
- Co-Signers in the same set cannot be in the same clique
- Provides redundancy and failover capabilities
- If one Guard Co-Signer fails, another from the same set can substitute

**Cliques**: Valid triplets of co-signers for transaction signing
- Must include exactly one Primary Co-Signer
- Must include one Guard from Set 1
- Must include one Guard from Set 2

---

## 📋 Infrastructure Requirements Preview

### Hardware Requirements
- **SGX-Capable Servers**: Intel SGX-enabled hardware (e.g., Azure DCsv3, on-prem SGX machines)
- **Operating System**: Ubuntu 20.04 LTS
- **Memory**: Minimum 16 GB RAM
- **Storage**: 128 GB SSD with encrypted volumes (LUKS or equivalent)

### Network Requirements
- **Outbound HTTPS**: Port 443 for Fireblocks APIs and RA server
- **Co-Signer Communication**: Port 51971 for inter-co-signer channels
- **IP Whitelisting**: Access to specific Fireblocks endpoints

### Security Requirements
- **SGX Drivers**: `/dev/sgx/enclave` and `/dev/sgx/provision` exposed to Docker
- **File Permissions**: Co-Signer containers run as UID 2000
- **Certificate Management**: CSR-based certificate provisioning
- **Optional HSM**: PKCS#11 interface for additional key sealing

---

## 🎯 What You'll Build

Throughout this workshop, you'll:

1. **Step 1** (Current): Understand architecture and requirements ✅
2. **Step 2**: Set up SGX-enabled infrastructure and dependencies
3. **Step 3**: Deploy and configure Guard Co-Signers with certificates
4. **Step 4**: Set up Primary Co-Signer and complete clique formation
5. **Step 5**: Test transaction signing and implement disaster recovery

By the end, you'll have a fully functional Hosted MPC environment that gives you complete control over your cryptographic operations while leveraging Fireblocks' enterprise-grade infrastructure.

---

## 🔄 Next Steps

Ready to start building? In the next step, we'll set up your SGX-enabled infrastructure and prepare the foundation for your Hosted MPC deployment.

**Coming up in Step 2:**
- SGX environment setup and validation
- Docker and container configuration
- Network and security preparation
- Certificate generation workflow -->