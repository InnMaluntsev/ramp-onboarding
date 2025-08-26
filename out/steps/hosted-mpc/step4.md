## Comming soon!


<!-- # Step 4: Primary Co-Signer & Workspace Configuration

## Overview

In this step, you'll complete your Hosted MPC setup by deploying the Primary Co-Signer and configuring the workspace schema. The Primary Co-Signer initiates transaction signing and works with your Guard Co-Signers to form complete signing cliques.

**🎯 Objectives:**
- Deploy and configure Primary Co-Signer (API-based)
- Set up workspace schema with Ops-Client
- Define sets, cliques, and signing policies
- Validate complete MPC architecture

---

## 📱 Primary Co-Signer Options

### Option A: API Co-Signer (Recommended for this workshop)
- **Deployment**: Docker container with SGX enclave
- **Integration**: REST API for programmatic signing
- **Security**: Backend SGX server with sealed key storage
- **Use Case**: Automated systems, high-frequency trading

### Option B: Mobile Co-Signer
- **Deployment**: Mobile app with SDK integration
- **Integration**: QR code enrollment and mobile signing
- **Security**: Secure enclave (Keychain/Trusty TEE)
- **Use Case**: Manual approval workflows, executive signing

For this workshop, we'll implement the **API Co-Signer** approach.

---

## 🔧 API Co-Signer Configuration

### Create Primary Co-Signer Configuration

```bash
# primary/config/primary_config.json
cat > primary/config/primary_config.json << 'EOF'
{
    "cosigner_id": "primary-1",
    "cosigner_type": "primary",
    "workspace_id": "${WORKSPACE_ID}",
    "pairing_token": "${PAIRING_TOKEN}",
    "callback_url": "https://your-callback-server.com/fireblocks/webhook",
    "callback_public_key": "${CALLBACK_PUBLIC_KEY}",
    "physical_device_id": "${PHYSICAL_DEVICE_ID}",
    "ra_server_url": "https://eu-guard-ra-server.fireblocks.io",
    "aggregator_url": "https://eu-aggregator.fireblocks.io",
    "signing_timeout": 60000,
    "approval_timeout": 300000,
    "auto_approve_policies": ["internal_transfer", "low_value"],
    "log_level": "info",
    "network": {
        "listen_port": 8080,
        "callback_port": 8443,
        "max_connections": 50
    },
    "security": {
        "sgx_mode": "production",
        "attestation_required": true,
        "enclave_measurement": "${ENCLAVE_MEASUREMENT}",
        "require_pin": true,
        "pin_hash": "${PIN_HASH}"
    },
    "backup": {
        "enabled": true,
        "encryption_public_key": "${BACKUP_PUBLIC_KEY}"
    }
}
EOF

# Set proper ownership
sudo chown 2000:2000 primary/config/primary_config.json
```

### Generate Configuration Parameters

```bash
# shared/scripts/generate-primary-config.sh
#!/bin/bash

echo "🔧 Generating Primary Co-Signer configuration parameters..."

CONFIG_DIR="shared/configs"
mkdir -p "$CONFIG_DIR"

# Generate physical device ID (unique identifier)
PHYSICAL_DEVICE_ID=$(uuidgen)
echo "PHYSICAL_DEVICE_ID=$PHYSICAL_DEVICE_ID" >> "$CONFIG_DIR/primary.env"

# Generate callback key pair for webhook verification
echo "🔐 Generating callback key pair..."
openssl genrsa -out "$CONFIG_DIR/callback_private.key" 4096
openssl rsa -in "$CONFIG_DIR/callback_private.key" -pubout -out "$CONFIG_DIR/callback_public.key"

# Extract public key in the required format
CALLBACK_PUBLIC_KEY=$(openssl rsa -in "$CONFIG_DIR/callback_private.key" -pubout -outform DER | base64 -w 0)
echo "CALLBACK_PUBLIC_KEY=$CALLBACK_PUBLIC_KEY" >> "$CONFIG_DIR/primary.env"

# Generate backup key pair for disaster recovery
echo "🗝️ Generating backup key pair..."
openssl genrsa -out "$CONFIG_DIR/backup_private.key" 4096
openssl rsa -in "$CONFIG_DIR/backup_private.key" -pubout -out "$CONFIG_DIR/backup_public.key"

BACKUP_PUBLIC_KEY=$(openssl rsa -in "$CONFIG_DIR/backup_private.key" -pubout -outform DER | base64 -w 0)
echo "BACKUP_PUBLIC_KEY=$BACKUP_PUBLIC_KEY" >> "$CONFIG_DIR/primary.env"

# Generate PIN hash (for demo - in production, use proper PIN entry)
read -s -p "Enter PIN for Primary Co-Signer (4-8 digits): " PIN
echo
PIN_HASH=$(echo -n "$PIN" | sha256sum | cut -d' ' -f1)
echo "PIN_HASH=$PIN_HASH" >> "$CONFIG_DIR/primary.env"

# Generate pairing token placeholder (will be provided by Fireblocks)
echo "PAIRING_TOKEN=REPLACE_WITH_FIREBLOCKS_PROVIDED_TOKEN" >> "$CONFIG_DIR/primary.env"

echo "✅ Configuration parameters generated"
echo "📄 Configuration file: $CONFIG_DIR/primary.env"
echo ""
echo "🚨 IMPORTANT: "
echo "   1. Keep backup_private.key secure - needed for disaster recovery"
echo "   2. Replace PAIRING_TOKEN with value from Fireblocks"
echo "   3. Configure callback_url to point to your webhook endpoint"

# Set secure permissions
chmod 600 "$CONFIG_DIR"/*.key
chmod 600 "$CONFIG_DIR/primary.env"
```

### Webhook Server for Callbacks

```bash
# shared/scripts/webhook-server.py
cat > shared/scripts/webhook-server.py << 'EOF'
#!/usr/bin/env python3
"""
Simple webhook server for Primary Co-Signer callbacks
"""

import json
import hmac
import hashlib
import base64
from flask import Flask, request, jsonify
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Load callback private key (for signature verification)
with open('shared/configs/callback_private.key', 'r') as f:
    CALLBACK_PRIVATE_KEY = f.read()

@app.route('/fireblocks/webhook', methods=['POST'])
def fireblocks_webhook():
    """Handle Fireblocks webhook callbacks"""
    
    try:
        # Get signature from headers
        signature = request.headers.get('X-Fireblocks-Signature')
        if not signature:
            return jsonify({'error': 'Missing signature'}), 400
        
        # Get request body
        body = request.get_data()
        payload = json.loads(body)
        
        # Verify signature (simplified - implement proper verification)
        # In production, verify using the callback public key
        
        logging.info(f"Received webhook: {payload.get('type', 'unknown')}")
        logging.info(f"Transaction ID: {payload.get('data', {}).get('id', 'N/A')}")
        
        # Handle different webhook types
        webhook_type = payload.get('type')
        
        if webhook_type == 'TRANSACTION_APPROVAL_STATUS_UPDATED':
            return handle_approval_status(payload)
        elif webhook_type == 'TRANSACTION_STATUS_UPDATED':
            return handle_transaction_status(payload)
        elif webhook_type == 'SIGNING_REQUEST':
            return handle_signing_request(payload)
        else:
            logging.warning(f"Unknown webhook type: {webhook_type}")
            return jsonify({'status': 'ignored'}), 200
            
    except Exception as e:
        logging.error(f"Webhook processing error: {e}")
        return jsonify({'error': 'Processing failed'}), 500

def handle_approval_status(payload):
    """Handle transaction approval status updates"""
    data = payload.get('data', {})
    status = data.get('status')
    tx_id = data.get('id')
    
    logging.info(f"Transaction {tx_id} approval status: {status}")
    
    if status == 'PENDING_AUTHORIZATION':
        # Auto-approve based on policy (demo only)
        auto_approve = should_auto_approve(data)
        if auto_approve:
            logging.info(f"Auto-approving transaction {tx_id}")
            # In real implementation, call Fireblocks API to approve
            return jsonify({'action': 'approved', 'tx_id': tx_id})
    
    return jsonify({'status': 'processed'})

def handle_transaction_status(payload):
    """Handle transaction status updates"""
    data = payload.get('data', {})
    status = data.get('status')
    tx_id = data.get('id')
    
    logging.info(f"Transaction {tx_id} status: {status}")
    
    return jsonify({'status': 'processed'})

def handle_signing_request(payload):
    """Handle MPC signing requests"""
    data = payload.get('data', {})
    signing_id = data.get('signing_id')
    
    logging.info(f"Signing request received: {signing_id}")
    
    # The Primary Co-Signer will automatically participate in signing
    # This webhook is for notification/logging purposes
    
    return jsonify({'status': 'acknowledged'})

def should_auto_approve(transaction_data):
    """Determine if transaction should be auto-approved"""
    # Demo policy - in production, implement proper policy engine
    amount = float(transaction_data.get('amount', {}).get('amount', 0))
    asset = transaction_data.get('amount', {}).get('asset', '')
    
    # Auto-approve small USD transactions
    if asset == 'USD' and amount < 1000:
        return True
    
    # Auto-approve internal transfers
    if transaction_data.get('operation') == 'TRANSFER' and \
       transaction_data.get('source', {}).get('type') == 'VAULT_ACCOUNT' and \
       transaction_data.get('destination', {}).get('type') == 'VAULT_ACCOUNT':
        return True
    
    return False

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8443, ssl_context='adhoc')
EOF

chmod +x shared/scripts/webhook-server.py
```

---

## 🚀 Primary Co-Signer Deployment

### Docker Compose for Primary Co-Signer

```yaml
# docker-compose.primary.yml
version: '3.8'

services:
  primary-cosigner:
    image: ${FIREBLOCKS_PRIMARY_IMAGE:-fireblocks/primary-cosigner:latest}
    container_name: primary-cosigner
    restart: unless-stopped
    user: "2000:2000"
    devices:
      - "/dev/sgx/enclave:/dev/sgx/enclave"
      - "/dev/sgx/provision:/dev/sgx/provision"
    volumes:
      - "./primary/certs:/certs:ro"
      - "./primary/db:/db"
      - "./primary/log:/log"
      - "./primary/backup:/backup"
      - "./primary/config:/config:ro"
    environment:
      - COSIGNER_CONFIG_FILE=/config/primary_config.json
      - WORKSPACE_ID=${WORKSPACE_ID}
      - PAIRING_TOKEN=${PAIRING_TOKEN}
      - CALLBACK_PUBLIC_KEY=${CALLBACK_PUBLIC_KEY}
      - PHYSICAL_DEVICE_ID=${PHYSICAL_DEVICE_ID}
      - PIN_HASH=${PIN_HASH}
      - BACKUP_PUBLIC_KEY=${BACKUP_PUBLIC_KEY}
      - ENCLAVE_MEASUREMENT=${ENCLAVE_MEASUREMENT}
      - LOG_LEVEL=${LOG_LEVEL:-info}
      - SGX_AESM_ADDR=1
    networks:
      cosigner-network:
        ipv4_address: 172.20.0.12
    ports:
      - "8080:8080"   # API port
      - "8443:8443"   # Webhook port
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  webhook-server:
    build:
      context: .
      dockerfile: shared/scripts/Dockerfile.webhook
    container_name: webhook-server
    restart: unless-stopped
    volumes:
      - "./shared/configs:/app/configs:ro"
      - "./shared/scripts:/app/scripts:ro"
    environment:
      - FLASK_ENV=production
    networks:
      cosigner-network:
        ipv4_address: 172.20.0.13
    ports:
      - "8444:8443"
    depends_on:
      - primary-cosigner

networks:
  cosigner-network:
    external: true
```

### Deploy Primary Co-Signer

```bash
# shared/scripts/deploy-primary.sh
#!/bin/bash

echo "🚀 Deploying Primary Co-Signer..."

# Load configuration
if [ -f "shared/configs/primary.env" ]; then
    source shared/configs/primary.env
    echo "✅ Configuration loaded"
else
    echo "❌ Primary configuration not found"
    echo "Run: ./shared/scripts/generate-primary-config.sh"
    exit 1
fi

# Validate required parameters
required_vars=("PHYSICAL_DEVICE_ID" "CALLBACK_PUBLIC_KEY" "PIN_HASH" "BACKUP_PUBLIC_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required variable: $var"
        exit 1
    fi
done

# Check if pairing token is set
if [ "$PAIRING_TOKEN" = "REPLACE_WITH_FIREBLOCKS_PROVIDED_TOKEN" ]; then
    echo "⚠️ Pairing token not set"
    echo "Contact Fireblocks to get your pairing token"
    echo "Would you like to continue with a placeholder? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Ensure certificates are installed
if [ ! -f "primary/certs/ra_cert.pem" ]; then
    echo "❌ Primary Co-Signer certificates not installed"
    echo "Install certificates first: ./shared/scripts/install-fireblocks-certs.sh primary /path/to/certs"
    exit 1
fi

# Create webhook Dockerfile
cat > shared/scripts/Dockerfile.webhook << 'EOF'
FROM python:3.9-slim

WORKDIR /app

RUN pip install flask cryptography

COPY scripts/webhook-server.py .
COPY configs/ ./configs/

EXPOSE 8443

CMD ["python", "webhook-server.py"]
EOF

# Export environment variables for docker-compose
export WORKSPACE_ID
export PAIRING_TOKEN
export CALLBACK_PUBLIC_KEY
export PHYSICAL_DEVICE_ID
export PIN_HASH
export BACKUP_PUBLIC_KEY
export ENCLAVE_MEASUREMENT
export LOG_LEVEL

# Deploy Primary Co-Signer
echo "📦 Starting Primary Co-Signer..."
docker compose -f docker-compose.primary.yml up -d

# Wait for startup
echo "⏳ Waiting for Primary Co-Signer to initialize..."
sleep 45

# Check health
if docker compose -f docker-compose.primary.yml ps | grep -q "primary-cosigner.*healthy"; then
    echo "✅ Primary Co-Signer is healthy"
else
    echo "⚠️ Primary Co-Signer health status unknown"
    echo "📋 Recent logs:"
    docker compose -f docker-compose.primary.yml logs --tail 20 primary-cosigner
fi

echo "🎉 Primary Co-Signer deployment completed!"
```

---

## 🏗️ Workspace Schema Configuration

### Install Ops-Client

```bash
# shared/scripts/install-ops-client.sh
#!/bin/bash

echo "🛠️ Installing Fireblocks Ops-Client..."

# Create directory for Ops-Client
mkdir -p shared/tools
cd shared/tools

# Download Ops-Client (version will be provided by Fireblocks)
echo "📥 Downloading Ops-Client..."
# wget https://fireblocks-releases.s3.amazonaws.com/ops-client/latest/ops-client-linux-x64.tar.gz
# tar -xzf ops-client-linux-x64.tar.gz

# For this workshop, create a mock ops-client
cat > ops-client << 'EOF'
#!/bin/bash
# Mock Ops-Client for workshop
# In production, use the real Fireblocks Ops-Client

COMMAND=$1
shift

case $COMMAND in
    "register-cosigner")
        echo "✅ Registering co-signer: $1"
        echo "Co-signer ID: $1"
        echo "Status: registered"
        ;;
    "define-set")
        echo "✅ Defining set: $1"
        echo "Set ID: $1"
        echo "Members: $2"
        ;;
    "define-clique")
        echo "✅ Defining clique: $1"
        echo "Clique ID: $1"
        echo "Members: $2"
        ;;
    "workspace-status")
        echo "📊 Workspace Status:"
        echo "Workspace ID: $WORKSPACE_ID"
        echo "Co-signers: 3 registered"
        echo "Sets: 2 defined"
        echo "Cliques: 2 active"
        echo "Status: operational"
        ;;
    *)
        echo "Available commands:"
        echo "  register-cosigner <id> <type>"
        echo "  define-set <set-id> <member-list>"
        echo "  define-clique <clique-id> <member-list>"
        echo "  workspace-status"
        ;;
esac
EOF

chmod +x ops-client
cd ../..

echo "✅ Ops-Client installed (mock version for workshop)"
echo "💡 In production, use the real Fireblocks Ops-Client"
```

### Configure Workspace Schema

```bash
# shared/scripts/configure-workspace.sh
#!/bin/bash

echo "🏗️ Configuring Hosted MPC workspace schema..."

OPS_CLIENT="./shared/tools/ops-client"

if [ ! -x "$OPS_CLIENT" ]; then
    echo "❌ Ops-Client not found or not executable"
    echo "Run: ./shared/scripts/install-ops-client.sh"
    exit 1
fi

# Set workspace environment
export WORKSPACE_ID=${WORKSPACE_ID:-"workshop-hosted-mpc-$(date +%Y%m%d)"}

echo "🏷️ Workspace ID: $WORKSPACE_ID"
echo ""

# Step 1: Register co-signers
echo "1️⃣ Registering co-signers..."
$OPS_CLIENT register-cosigner "guard-1" "guard"
$OPS_CLIENT register-cosigner "guard-2" "guard"  
$OPS_CLIENT register-cosigner "primary-1" "primary"
echo ""

# Step 2: Define sets (logical groups of guards)
echo "2️⃣ Defining co-signer sets..."
$OPS_CLIENT define-set "set-1" "guard-1,guard-2"
echo "ℹ️ Set-1 contains both guards for redundancy"
echo ""

# Step 3: Define cliques (valid signing triplets)
echo "3️⃣ Defining signing cliques..."
$OPS_CLIENT define-clique "clique-1" "primary-1,guard-1,guard-2"
echo "ℹ️ Clique-1: Primary + both guards (3-of-3 signing)"
echo ""

# Alternative: Define multiple cliques for high availability
# $OPS_CLIENT define-clique "clique-2" "primary-1,guard-1,guard-3"
# $OPS_CLIENT define-clique "clique-3" "primary-1,guard-2,guard-3"

# Step 4: Configure signing policies
echo "4️⃣ Configuring signing policies..."
cat > shared/configs/signing-policy.json << 'EOF'
{
    "default_policy": {
        "clique_selection": "round_robin",
        "required_approvals": 1,
        "timeout_seconds": 300,
        "auto_approve_rules": [
            {
                "name": "internal_transfers",
                "conditions": {
                    "operation": "TRANSFER",
                    "source_type": "VAULT_ACCOUNT", 
                    "destination_type": "VAULT_ACCOUNT",
                    "max_amount_usd": 10000
                },
                "action": "auto_approve"
            },
            {
                "name": "small_withdrawals", 
                "conditions": {
                    "operation": "TRANSFER",
                    "destination_type": "EXTERNAL_WALLET",
                    "max_amount_usd": 1000
                },
                "action": "auto_approve"
            }
        ]
    },
    "high_value_policy": {
        "conditions": {
            "amount_usd": "> 50000"
        },
        "required_approvals": 2,
        "timeout_seconds": 3600,
        "clique_selection": "all_available"
    }
}
EOF

echo "✅ Signing policy configured"
echo ""

# Step 5: Validate workspace configuration
echo "5️⃣ Validating workspace configuration..."
$OPS_CLIENT workspace-status
echo ""

echo "🎉 Workspace schema configuration completed!"
echo ""
echo "📋 Summary:"
echo "   • Co-signers: 3 registered (2 guards + 1 primary)"
echo "   • Sets: 1 defined (redundant guards)"
echo "   • Cliques: 1 active (3-of-3 signing)"
echo "   • Policies: Auto-approval rules configured"
echo ""
echo "✅ Ready for transaction signing tests!"
```

---

## 🔧 Complete System Integration

### Full Stack Deployment

```bash
# shared/scripts/deploy-full-stack.sh
#!/bin/bash

echo "🚀 Deploying complete Hosted MPC stack..."

# Ensure all prerequisites are met
echo "🔍 Pre-deployment validation..."

# Check Guard Co-Signers
if ! docker compose -f docker-compose.guards.yml ps | grep -q "healthy.*healthy"; then
    echo "❌ Guard Co-Signers not healthy"
    echo "Fix guards first: ./shared/scripts/troubleshoot-guards.sh"
    exit 1
fi

echo "✅ Guard Co-Signers operational"

# Deploy Primary Co-Signer
echo "📦 Deploying Primary Co-Signer..."
./shared/scripts/deploy-primary.sh

if [ $? -ne 0 ]; then
    echo "❌ Primary Co-Signer deployment failed"
    exit 1
fi

# Configure workspace
echo "🏗️ Configuring workspace schema..."
./shared/scripts/configure-workspace.sh

# Create unified docker-compose file
echo "🔗 Creating unified configuration..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  guard-cosigner-1:
    extends:
      file: docker-compose.guards.yml
      service: guard-cosigner-1

  guard-cosigner-2:
    extends:
      file: docker-compose.guards.yml
      service: guard-cosigner-2

  primary-cosigner:
    extends:
      file: docker-compose.primary.yml
      service: primary-cosigner

  webhook-server:
    extends:
      file: docker-compose.primary.yml
      service: webhook-server

networks:
  cosigner-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
EOF

echo "✅ Unified configuration created"

# Final validation
echo "🔍 Final system validation..."
./shared/scripts/validate-full-system.sh

echo "🎉 Complete Hosted MPC stack deployed successfully!"
echo ""
echo "📊 System Status:"
docker compose ps
echo ""
echo "🔄 Next: Run transaction signing tests in Step 5"
```

### System Validation Script

```bash
# shared/scripts/validate-full-system.sh
#!/bin/bash

echo "🔍 Comprehensive Hosted MPC System Validation"
echo "============================================="

validation_score=0
total_checks=12

# 1. Guard Co-Signer 1 Health
if docker inspect --format='{{.State.Health.Status}}' guard-cosigner-1 | grep -q "healthy"; then
    echo "✅ Guard Co-Signer 1 healthy"
    ((validation_score++))
else
    echo "❌ Guard Co-Signer 1 unhealthy"
fi

# 2. Guard Co-Signer 2 Health  
if docker inspect --format='{{.State.Health.Status}}' guard-cosigner-2 | grep -q "healthy"; then
    echo "✅ Guard Co-Signer 2 healthy"
    ((validation_score++))
else
    echo "❌ Guard Co-Signer 2 unhealthy"
fi

# 3. Primary Co-Signer Health
if docker inspect --format='{{.State.Health.Status}}' primary-cosigner | grep -q "healthy"; then
    echo "✅ Primary Co-Signer healthy"
    ((validation_score++))
else
    echo "❌ Primary Co-Signer unhealthy"
fi

# 4. SGX Attestation Status
attestation_count=0
for container in guard-cosigner-1 guard-cosigner-2 primary-cosigner; do
    if docker exec $container grep -q "Attestation successful" /log/cosigner.log 2>/dev/null; then
        ((attestation_count++))
    fi
done

if [ $attestation_count -eq 3 ]; then
    echo "✅ All co-signers attested successfully"
    ((validation_score++))
else
    echo "❌ Attestation incomplete ($attestation_count/3)"
fi

# 5. MPC Key Shares Sealed
key_count=0
for container in guard-cosigner-1 guard-cosigner-2 primary-cosigner; do
    if docker exec $container ls /db/sealed_key.bin 2>/dev/null; then
        ((key_count++))
    fi
done

if [ $key_count -eq 3 ]; then
    echo "✅ All MPC key shares sealed"
    ((validation_score++))
else
    echo "❌ Key sealing incomplete ($key_count/3)"
fi

# 6. Network Connectivity
if curl -s --connect-timeout 5 http://localhost:8080/health > /dev/null; then
    echo "✅ Primary Co-Signer API accessible"
    ((validation_score++))
else
    echo "❌ Primary Co-Signer API not accessible"
fi

# 7. Inter-cosigner Communication
comm_test=0
for port in 51971 51972; do
    if nc -z localhost $port 2>/dev/null; then
        ((comm_test++))
    fi
done

if [ $comm_test -eq 2 ]; then
    echo "✅ Co-signer communication ports open"
    ((validation_score++))
else
    echo "❌ Co-signer communication issues"
fi

# 8. Certificate Validity
cert_valid=0
for cosigner in guard1 guard2 primary; do
    if [ -f "$cosigner/certs/ra_cert.pem" ] && \
       openssl x509 -in "$cosigner/certs/ra_cert.pem" -noout -checkend 86400 2>/dev/null; then
        ((cert_valid++))
    fi
done

if [ $cert_valid -eq 3 ]; then
    echo "✅ All certificates valid"
    ((validation_score++))
else
    echo "❌ Certificate issues ($cert_valid/3 valid)"
fi

# 9. Webhook Server
if curl -s --connect-timeout 5 http://localhost:8444/health > /dev/null 2>&1; then
    echo "✅ Webhook server accessible"
    ((validation_score++))
else
    echo "⚠️ Webhook server not accessible (optional)"
fi

# 10. Log Files Accessible
log_accessible=0
for container in guard-cosigner-1 guard-cosigner-2 primary-cosigner; do
    if docker exec $container test -r /log/cosigner.log; then
        ((log_accessible++))
    fi
done

if [ $log_accessible -eq 3 ]; then
    echo "✅ All log files accessible"
    ((validation_score++))
else
    echo "❌ Log access issues ($log_accessible/3)"
fi

# 11. Workspace Configuration
if [ -f "shared/configs/signing-policy.json" ]; then
    echo "✅ Workspace configuration present"
    ((validation_score++))
else
    echo "❌ Workspace configuration missing"
fi

# 12. System Resources
if [ $(docker stats --no-stream --format "table {{.CPUPerc}}" | grep -v CPU | wc -l) -eq 4 ]; then
    echo "✅ All containers consuming resources"
    ((validation_score++))
else
    echo "❌ Some containers not active"
fi

echo ""
echo "📊 Overall System Health: $validation_score/$total_checks"

if [ $validation_score -ge 10 ]; then
    echo "🎉 System is operational and ready for production use!"
    echo "✅ Proceed to Step 5 for transaction signing tests"
elif [ $validation_score -ge 8 ]; then
    echo "⚠️ System is mostly operational with minor issues"
    echo "🔧 Address issues before proceeding to Step 5"
else
    echo "❌ System has significant issues requiring attention"
    echo "🚨 Do not proceed to Step 5 until issues are resolved"
fi

echo ""
echo "🔗 Useful commands:"
echo "   📊 Monitor: docker compose logs -f"
echo "   🔄 Restart: docker compose restart"
echo "   📈 Stats: docker stats"
echo "   🐛 Debug: ./shared/scripts/troubleshoot-guards.sh"
```

---

## 📋 Step 4 Completion Checklist

Before proceeding to Step 5, verify:

- [ ] **Primary Co-Signer**: Deployed and healthy
- [ ] **API Endpoint**: Primary Co-Signer API responding on port 8080
- [ ] **SGX Attestation**: All three co-signers attested successfully
- [ ] **Key Sealing**: MPC key shares sealed in all co-signers
- [ ] **Workspace Schema**: Co-signers registered, sets and cliques defined
- [ ] **Certificates**: Valid certificates installed for all co-signers
- [ ] **Communication**: Inter-cosigner communication established
- [ ] **Webhook Server**: Callback endpoint operational (optional)
- [ ] **Policies**: Signing policies configured
- [ ] **Logs**: No critical errors in any co-signer logs

### Quick Validation

```bash
# Run this to verify Step 4 completion
cd ~/hosted-mpc
./shared/scripts/validate-full-system.sh
```

---

## 🔄 Next Steps

Outstanding! Your complete Hosted MPC infrastructure is now operational. In Step 5, we'll:

- Perform end-to -->