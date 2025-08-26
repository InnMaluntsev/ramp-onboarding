## Comming soon!


<!-- # Step 2: Infrastructure Setup & SGX Environment

## Overview

In this step, you'll prepare the foundational infrastructure for your Hosted MPC deployment. This includes setting up SGX-enabled servers, configuring Docker environments, and preparing the security framework required for co-signer operations.

**🎯 Objectives:**
- Set up SGX-enabled infrastructure
- Configure Docker and container environments
- Prepare network security and certificates
- Validate SGX functionality

---

## 🖥️ Hardware Requirements

### SGX-Capable Servers

Your Hosted MPC deployment requires Intel SGX (Software Guard Extensions) capable hardware:

#### **Cloud Options (Recommended for Testing)**
```bash
# Azure DCsv3 Series (SGX-enabled)
Standard_DC2s_v3   # 2 vCPUs, 8 GB RAM, SGX EPC: 168 MB
Standard_DC4s_v3   # 4 vCPUs, 16 GB RAM, SGX EPC: 168 MB  
Standard_DC8s_v3   # 8 vCPUs, 32 GB RAM, SGX EPC: 168 MB

# AWS (SGX support via Nitro Enclaves - different implementation)
# Note: Fireblocks Hosted MPC specifically requires Intel SGX
```

#### **On-Premises Options**
- **Intel Xeon E-2100/E-2200 series** with SGX support
- **Intel Xeon Scalable processors** (Ice Lake or newer)
- **Desktop/Workstation**: Intel Core processors with SGX (for development)

### System Specifications

| Component | Minimum | Recommended | Production |
|-----------|---------|-------------|------------|
| **CPU** | 2 cores SGX-enabled | 4 cores | 8+ cores |
| **RAM** | 16 GB | 32 GB | 64+ GB |
| **Storage** | 128 GB SSD | 256 GB NVMe | 1+ TB NVMe |
| **Network** | 1 Gbps | 10 Gbps | 10+ Gbps |
| **SGX EPC** | 64 MB | 128 MB | 256+ MB |

---

## 🐧 Operating System Setup

### Ubuntu 20.04 LTS Installation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    openssl \
    build-essential \
    linux-headers-$(uname -r)

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker installation
docker --version
docker compose version
```

---

## 🔒 Intel SGX Setup

### Install SGX Drivers and Platform Software

```bash
# Download Intel SGX repository signing key
wget -qO - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | sudo apt-key add -

# Add Intel SGX repository
echo 'deb [arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu focal main' | sudo tee /etc/apt/sources.list.d/intel-sgx.list

# Update package list
sudo apt update

# Install SGX drivers and platform software
sudo apt install -y \
    sgx-aesm-service \
    libsgx-aesm-launch-plugin \
    libsgx-aesm-epid-plugin \
    libsgx-aesm-quote-ex-plugin \
    libsgx-aesm-ecdsa-plugin \
    libsgx-dcap-ql \
    libsgx-dcap-default-qpl

# Install SGX SDK (for development)
sudo apt install -y \
    libsgx-enclave-common-dev \
    libsgx-dcap-ql-dev \
    libsgx-dcap-default-qpl-dev
```

### Verify SGX Installation

```bash
# Check if SGX devices are available
ls -la /dev/sgx*

# Expected output:
# crw-rw-rw- 1 root sgx     10, 125 date time /dev/sgx/enclave
# crw-rw-rw- 1 root sgx     10, 126 date time /dev/sgx/provision

# Check SGX capabilities
sudo /opt/intel/sgxsdk/bin/x64/sgx_cap

# Start SGX services
sudo systemctl enable aesmd
sudo systemctl start aesmd
sudo systemctl status aesmd
```

### SGX Docker Integration

Create a Docker configuration to expose SGX devices:

```bash
# Create SGX device access script
sudo tee /usr/local/bin/sgx-docker-setup.sh << 'EOF'
#!/bin/bash

# Ensure SGX devices have proper permissions
sudo chmod 666 /dev/sgx/enclave
sudo chmod 666 /dev/sgx/provision

# Add SGX group if it doesn't exist
sudo groupadd -f sgx

# Add docker user to SGX group
sudo usermod -aG sgx docker

echo "SGX devices configured for Docker access"
EOF

sudo chmod +x /usr/local/bin/sgx-docker-setup.sh
sudo /usr/local/bin/sgx-docker-setup.sh
```

---

## 🐳 Docker Environment Configuration

### Create Hosted MPC Directory Structure

```bash
# Create main directory structure
mkdir -p ~/hosted-mpc/{guard1,guard2,primary,shared}
cd ~/hosted-mpc

# Create subdirectories for each co-signer
for cosigner in guard1 guard2 primary; do
    mkdir -p $cosigner/{certs,db,log,backup,config}
    # Set proper ownership (UID 2000 as required by Fireblocks)
    sudo chown -R 2000:2000 $cosigner
done

# Create shared configuration
mkdir -p shared/{scripts,certificates,configs}
```

### Co-Signer Directory Structure

```
hosted-mpc/
├── guard1/                 # Guard Co-Signer #1
│   ├── certs/             # Certificates from Fireblocks
│   ├── db/                # Sealed keyshare database
│   ├── log/               # Application logs
│   ├── backup/            # Key dump location (DRS)
│   └── config/            # Operational configs
├── guard2/                # Guard Co-Signer #2
│   └── ... (same structure)
├── primary/               # Primary Co-Signer
│   └── ... (same structure)
└── shared/
    ├── scripts/           # Setup and management scripts
    ├── certificates/      # CSR and certificate management
    └── configs/           # Shared configuration files
```

### Docker Compose Base Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  guard-cosigner-1:
    image: ${FIREBLOCKS_GUARD_IMAGE}
    container_name: guard-cosigner-1
    restart: unless-stopped
    user: "2000:2000"
    devices:
      - "/dev/sgx/enclave:/dev/sgx/enclave"
      - "/dev/sgx/provision:/dev/sgx/provision"
    volumes:
      - "./guard1/certs:/certs:ro"
      - "./guard1/db:/db"
      - "./guard1/log:/log"
      - "./guard1/backup:/backup"
      - "./guard1/config:/config:ro"
    environment:
      - COSIGNER_TYPE=guard
      - COSIGNER_ID=guard-1
      - LOG_LEVEL=${LOG_LEVEL:-info}
    networks:
      - cosigner-network
    ports:
      - "51971:51971"  # Co-signer communication port

  guard-cosigner-2:
    image: ${FIREBLOCKS_GUARD_IMAGE}
    container_name: guard-cosigner-2
    restart: unless-stopped
    user: "2000:2000"
    devices:
      - "/dev/sgx/enclave:/dev/sgx/enclave"
      - "/dev/sgx/provision:/dev/sgx/provision"
    volumes:
      - "./guard2/certs:/certs:ro"
      - "./guard2/db:/db"
      - "./guard2/log:/log"
      - "./guard2/backup:/backup"
      - "./guard2/config:/config:ro"
    environment:
      - COSIGNER_TYPE=guard
      - COSIGNER_ID=guard-2
      - LOG_LEVEL=${LOG_LEVEL:-info}
    networks:
      - cosigner-network
    ports:
      - "51972:51971"

  primary-cosigner:
    image: ${FIREBLOCKS_PRIMARY_IMAGE}
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
      - COSIGNER_TYPE=primary
      - COSIGNER_ID=primary-1
      - LOG_LEVEL=${LOG_LEVEL:-info}
    networks:
      - cosigner-network
    ports:
      - "51973:51971"

networks:
  cosigner-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### Environment Configuration

```bash
# .env file
cat > .env << 'EOF'
# Fireblocks Docker Images (provided by Fireblocks)
FIREBLOCKS_GUARD_IMAGE=fireblocks/guard-cosigner:latest
FIREBLOCKS_PRIMARY_IMAGE=fireblocks/primary-cosigner:latest

# Logging
LOG_LEVEL=debug

# Network Configuration
COSIGNER_NETWORK_SUBNET=172.20.0.0/16

# Fireblocks API Configuration
FIREBLOCKS_API_BASE=https://api.fireblocks.io
FIREBLOCKS_RA_SERVER=https://eu-guard-ra-server.fireblocks.io

# HSM Configuration (optional)
HSM_ENABLED=false
HSM_LIBRARY_PATH=/opt/hsm/lib/libpkcs11.so
HSM_SLOT_ID=0
EOF
```

---

## 🌐 Network Configuration

### Firewall Rules

```bash
# Configure UFW firewall
sudo ufw enable

# Allow SSH (adjust port as needed)
sudo ufw allow 22/tcp

# Allow Docker subnet
sudo ufw allow from 172.20.0.0/16

# Allow co-signer communication ports
sudo ufw allow 51971:51973/tcp

# Allow outbound HTTPS (for Fireblocks API)
sudo ufw allow out 443/tcp

# Check firewall status
sudo ufw status numbered
```

### Required Outbound URLs

Create a verification script to check connectivity:

```bash
# shared/scripts/check-connectivity.sh
#!/bin/bash

echo "🌐 Checking connectivity to Fireblocks endpoints..."

ENDPOINTS=(
    "eu-aggregator-preproc.fireblocks.io"
    "eu-aggregator.fireblocks.io"
    "eu-guard-ra-server.fireblocks.io"
    "pccs.fireblocks.io"
    "eu-mobile-api-fireblocks.io" 
    "eu-signurl.fireblocks.io"
    "fireblocks-eu-prod-fr-customers.s3.amazonaws.com"
    "fireblocks-eu-prod-fr-certificates.s3.amazonaws.com"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -s --connect-timeout 5 "https://$endpoint" > /dev/null 2>&1; then
        echo "✅ $endpoint - Reachable"
    else
        echo "❌ $endpoint - Not reachable"
    fi
done

echo "🏁 Connectivity check complete"
```

```bash
chmod +x shared/scripts/check-connectivity.sh
./shared/scripts/check-connectivity.sh
```

---

## 🔐 Certificate Management Setup

### Generate CSR (Certificate Signing Request)

```bash
# shared/scripts/generate-csr.sh
#!/bin/bash

COSIGNER_NAME=$1
if [ -z "$COSIGNER_NAME" ]; then
    echo "Usage: $0 <cosigner-name>"
    echo "Example: $0 guard-1"
    exit 1
fi

CSR_DIR="shared/certificates/$COSIGNER_NAME"
mkdir -p "$CSR_DIR"

echo "🔐 Generating CSR for $COSIGNER_NAME..."

# Generate private key
openssl genrsa -out "$CSR_DIR/private.key" 4096

# Generate CSR
openssl req -new -key "$CSR_DIR/private.key" -out "$CSR_DIR/request.csr" \
    -subj "/C=US/ST=CA/L=San Francisco/O=YourCompany/OU=Hosted-MPC/CN=$COSIGNER_NAME.your-domain.com"

echo "✅ CSR generated for $COSIGNER_NAME"
echo "📄 Private key: $CSR_DIR/private.key" 
echo "📄 CSR file: $CSR_DIR/request.csr"
echo ""
echo "📧 Send the CSR file to Fireblocks to receive:"
echo "   - ra_cert.pem"
echo "   - ra_cert.key.pem"
```

### Certificate Installation Script

```bash
# shared/scripts/install-certificates.sh
#!/bin/bash

COSIGNER_NAME=$1
CERT_DIR=$2

if [ -z "$COSIGNER_NAME" ] || [ -z "$CERT_DIR" ]; then
    echo "Usage: $0 <cosigner-name> <fireblocks-cert-directory>"
    echo "Example: $0 guard-1 /path/to/fireblocks/certs"
    exit 1
fi

echo "📜 Installing certificates for $COSIGNER_NAME..."

# Copy Fireblocks-issued certificates
cp "$CERT_DIR/ra_cert.pem" "$COSIGNER_NAME/certs/"
cp "$CERT_DIR/ra_cert.key.pem" "$COSIGNER_NAME/certs/"

# Set proper ownership
sudo chown -R 2000:2000 "$COSIGNER_NAME/certs/"
sudo chmod 600 "$COSIGNER_NAME/certs/"*.pem

echo "✅ Certificates installed for $COSIGNER_NAME"
```

---

## 🧪 Environment Validation

### SGX Validation Test

```bash
# shared/scripts/validate-sgx.sh
#!/bin/bash

echo "🔍 Validating SGX environment..."

# Check SGX devices
if [ ! -c "/dev/sgx/enclave" ] || [ ! -c "/dev/sgx/provision" ]; then
    echo "❌ SGX devices not found"
    echo "Expected: /dev/sgx/enclave and /dev/sgx/provision"
    exit 1
fi

echo "✅ SGX devices found"

# Check SGX service
if ! systemctl is-active --quiet aesmd; then
    echo "❌ SGX AESM service not running"
    echo "Run: sudo systemctl start aesmd"
    exit 1
fi

echo "✅ SGX AESM service running"

# Test SGX capabilities (if sgx_cap tool is available)
if command -v sgx_cap &> /dev/null; then
    echo "📊 SGX Capabilities:"
    sgx_cap
else
    echo "ℹ️ SGX capability tool not available (install SGX SDK for detailed info)"
fi

# Check Docker SGX access
if docker run --rm \
    --device=/dev/sgx/enclave \
    --device=/dev/sgx/provision \
    ubuntu:20.04 ls -la /dev/sgx/ 2>/dev/null | grep -q enclave; then
    echo "✅ Docker can access SGX devices"
else
    echo "❌ Docker cannot access SGX devices"
    echo "Run: sudo /usr/local/bin/sgx-docker-setup.sh"
    exit 1
fi

echo "🎉 SGX environment validation complete!"
```

### Full System Check

```bash
# shared/scripts/system-check.sh
#!/bin/bash

echo "🔧 Running complete system validation..."

# Check OS version
if ! grep -q "Ubuntu 20.04" /etc/os-release; then
    echo "⚠️ Warning: OS is not Ubuntu 20.04 LTS"
fi

# Check Docker
if ! docker --version > /dev/null 2>&1; then
    echo "❌ Docker not installed or not accessible"
    exit 1
fi
echo "✅ Docker installed"

# Check Docker Compose
if ! docker compose version > /dev/null 2>&1; then
    echo "❌ Docker Compose not available"
    exit 1
fi
echo "✅ Docker Compose available"

# Check connectivity
echo "🌐 Testing connectivity..."
./shared/scripts/check-connectivity.sh

# Check SGX
echo "🔒 Testing SGX..."
./shared/scripts/validate-sgx.sh

# Check directory structure
for dir in guard1 guard2 primary; do
    for subdir in certs db log backup config; do
        if [ ! -d "$dir/$subdir" ]; then
            echo "❌ Missing directory: $dir/$subdir"
            exit 1
        fi
    done
done
echo "✅ Directory structure valid"

# Check permissions
for dir in guard1 guard2 primary; do
    if [ "$(stat -c %u:%g $dir)" != "2000:2000" ]; then
        echo "❌ Incorrect ownership for $dir (should be 2000:2000)"
        exit 1
    fi
done
echo "✅ Directory permissions correct"

echo "🎉 System check complete! Ready for co-signer deployment."
```

---

## 📋 Pre-Deployment Checklist

Before proceeding to Step 3, ensure:

- [ ] **Hardware**: SGX-capable servers provisioned
- [ ] **OS**: Ubuntu 20.04 LTS installed and updated
- [ ] **SGX**: Drivers installed and AESM service running
- [ ] **Docker**: Installed with SGX device access configured
- [ ] **Networking**: Firewall configured, outbound connectivity verified
- [ ] **Directories**: Proper structure created with correct permissions
- [ ] **Scripts**: All validation scripts executable and passing
- [ ] **CSRs**: Generated for all co-signers (ready to send to Fireblocks)

### Quick Verification

```bash
# Run this command to verify everything is ready
cd ~/hosted-mpc
chmod +x shared/scripts/*.sh
./shared/scripts/system-check.sh
```

---

## 🔄 Next Steps

Excellent! Your infrastructure foundation is now ready. In Step 3, we'll:

- Deploy Guard Co-Signers with Fireblocks certificates
- Configure SGX enclaves and remote attestation
- Set up co-signer communication channels
- Initialize the MPC key generation process

**Coming up in Step 3:**
- Certificate installation and validation
- Guard Co-Signer container deployment
- SGX enclave initialization and attestation
- MPC -->