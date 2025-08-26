## Comming soon!


<!-- # Step 3: Deploy Guard Co-Signers

## Overview

In this step, you'll deploy and configure your Guard Co-Signers - the backbone of your Hosted MPC infrastructure. These SGX-protected services will hold MPC key shares and participate in the transaction signing quorum.

**🎯 Objectives:**
- Install Fireblocks-issued certificates
- Deploy Guard Co-Signer containers
- Complete SGX enclave initialization
- Verify remote attestation and key sealing

---

## 🔐 Certificate Management

### Step 1: Submit CSRs to Fireblocks

First, send your Certificate Signing Requests to Fireblocks:

```bash
cd ~/hosted-mpc

# Display CSRs for submission
echo "📧 Submit these CSRs to your Fireblocks contact:"
echo "================================================="
for cosigner in guard1 guard2 primary; do
    if [ -f "shared/certificates/$cosigner/request.csr" ]; then
        echo ""
        echo "🏷️ $cosigner CSR:"
        echo "📄 File: shared/certificates/$cosigner/request.csr"
        echo "📋 Content:"
        cat "shared/certificates/$cosigner/request.csr"
        echo ""
    fi
done
```

### Step 2: Install Fireblocks Certificates

Once you receive certificates from Fireblocks, install them:

```bash
# shared/scripts/install-fireblocks-certs.sh
#!/bin/bash

install_cert() {
    local cosigner=$1
    local fb_cert_dir=$2
    
    echo "📜 Installing certificates for $cosigner..."
    
    # Verify received files exist
    if [ ! -f "$fb_cert_dir/ra_cert.pem" ] || [ ! -f "$fb_cert_dir/ra_cert.key.pem" ]; then
        echo "❌ Missing certificate files for $cosigner"
        echo "Expected: ra_cert.pem and ra_cert.key.pem"
        return 1
    fi
    
    # Install certificates
    cp "$fb_cert_dir/ra_cert.pem" "$cosigner/certs/"
    cp "$fb_cert_dir/ra_cert.key.pem" "$cosigner/certs/"
    
    # Copy original private key if it exists
    if [ -f "shared/certificates/$cosigner/private.key" ]; then
        cp "shared/certificates/$cosigner/private.key" "$cosigner/certs/"
    fi
    
    # Set proper ownership and permissions
    sudo chown -R 2000:2000 "$cosigner/certs/"
    sudo chmod 600 "$cosigner/certs/"*.pem
    sudo chmod 600 "$cosigner/certs/"*.key
    
    echo "✅ Certificates installed for $cosigner"
    
    # Verify certificate
    echo "🔍 Certificate verification:"
    openssl x509 -in "$cosigner/certs/ra_cert.pem" -noout -subject -issuer -dates
    
    return 0
}

# Usage example:
# ./shared/scripts/install-fireblocks-certs.sh guard1 /path/to/fireblocks/guard1/certs
# ./shared/scripts/install-fireblocks-certs.sh guard2 /path/to/fireblocks/guard2/certs

if [ $# -ne 2 ]; then
    echo "Usage: $0 <cosigner> <fireblocks-cert-directory>"
    echo "Example: $0 guard1 /tmp/fireblocks-certs/guard1"
    exit 1
fi

install_cert $1 $2
```

---

## 🛡️ Guard Co-Signer Configuration

### Create Guard Configuration Files

```bash
# guard1/config/guard_config.json
cat > guard1/config/guard_config.json << 'EOF'
{
    "cosigner_id": "guard-1",
    "cosigner_type": "guard",
    "set_id": "set-1",
    "workspace_id": "${WORKSPACE_ID}",
    "ra_server_url": "https://eu-guard-ra-server.fireblocks.io",
    "aggregator_url": "https://eu-aggregator.fireblocks.io", 
    "signing_timeout": 30000,
    "health_check_interval": 5000,
    "backup_enabled": true,
    "hsm_enabled": false,
    "log_level": "info",
    "network": {
        "listen_port": 51971,
        "max_connections": 100,
        "connection_timeout": 30000
    },
    "security": {
        "sgx_mode": "production",
        "attestation_required": true,
        "enclave_measurement": "${ENCLAVE_MEASUREMENT}"
    }
}
EOF

# guard2/config/guard_config.json  
cat > guard2/config/guard_config.json << 'EOF'
{
    "cosigner_id": "guard-2", 
    "cosigner_type": "guard",
    "set_id": "set-1",
    "workspace_id": "${WORKSPACE_ID}",
    "ra_server_url": "https://eu-guard-ra-server.fireblocks.io",
    "aggregator_url": "https://eu-aggregator.fireblocks.io",
    "signing_timeout": 30000,
    "health_check_interval": 5000,
    "backup_enabled": true,
    "hsm_enabled": false,
    "log_level": "info",
    "network": {
        "listen_port": 51971,
        "max_connections": 100,
        "connection_timeout": 30000
    },
    "security": {
        "sgx_mode": "production",
        "attestation_required": true,
        "enclave_measurement": "${ENCLAVE_MEASUREMENT}"
    }
}
EOF

# Set proper ownership
sudo chown 2000:2000 guard*/config/*.json
```

### Updated Docker Compose for Guards

```yaml
# docker-compose.guards.yml
version: '3.8'

services:
  guard-cosigner-1:
    image: ${FIREBLOCKS_GUARD_IMAGE:-fireblocks/guard-cosigner:latest}
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
      - COSIGNER_CONFIG_FILE=/config/guard_config.json
      - WORKSPACE_ID=${WORKSPACE_ID}
      - ENCLAVE_MEASUREMENT=${ENCLAVE_MEASUREMENT}
      - LOG_LEVEL=${LOG_LEVEL:-info}
      - SGX_AESM_ADDR=1
    networks:
      cosigner-network:
        ipv4_address: 172.20.0.10
    ports:
      - "51971:51971"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  guard-cosigner-2:
    image: ${FIREBLOCKS_GUARD_IMAGE:-fireblocks/guard-cosigner:latest}
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
      - COSIGNER_CONFIG_FILE=/config/guard_config.json
      - WORKSPACE_ID=${WORKSPACE_ID}
      - ENCLAVE_MEASUREMENT=${ENCLAVE_MEASUREMENT}
      - LOG_LEVEL=${LOG_LEVEL:-info}
      - SGX_AESM_ADDR=1
    networks:
      cosigner-network:
        ipv4_address: 172.20.0.11
    ports:
      - "51972:51971"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

networks:
  cosigner-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 🚀 Guard Deployment Process

### Step 1: Pre-deployment Validation

```bash
# shared/scripts/pre-deploy-check.sh
#!/bin/bash

echo "🔍 Pre-deployment validation..."

# Check certificates
for cosigner in guard1 guard2; do
    echo "📜 Checking certificates for $cosigner..."
    
    if [ ! -f "$cosigner/certs/ra_cert.pem" ]; then
        echo "❌ Missing ra_cert.pem for $cosigner"
        exit 1
    fi
    
    if [ ! -f "$cosigner/certs/ra_cert.key.pem" ]; then
        echo "❌ Missing ra_cert.key.pem for $cosigner"
        exit 1
    fi
    
    # Verify certificate validity
    if ! openssl x509 -in "$cosigner/certs/ra_cert.pem" -noout -checkend 86400; then
        echo "⚠️ Certificate for $cosigner expires within 24 hours"
    fi
    
    echo "✅ Certificates valid for $cosigner"
done

# Check configuration files
for cosigner in guard1 guard2; do
    if [ ! -f "$cosigner/config/guard_config.json" ]; then
        echo "❌ Missing configuration for $cosigner"
        exit 1
    fi
    
    # Validate JSON syntax
    if ! jq empty "$cosigner/config/guard_config.json" 2>/dev/null; then
        echo "❌ Invalid JSON in $cosigner configuration"
        exit 1
    fi
    
    echo "✅ Configuration valid for $cosigner"
done

# Check directory permissions
for cosigner in guard1 guard2; do
    for dir in certs db log backup config; do
        if [ "$(stat -c %u:%g $cosigner/$dir)" != "2000:2000" ]; then
            echo "❌ Incorrect ownership for $cosigner/$dir"
            exit 1
        fi
    done
done

echo "✅ All pre-deployment checks passed!"
```

### Step 2: Deploy Guard Co-Signers

```bash
# shared/scripts/deploy-guards.sh
#!/bin/bash

echo "🚀 Deploying Guard Co-Signers..."

# Run pre-deployment checks
./shared/scripts/pre-deploy-check.sh
if [ $? -ne 0 ]; then
    echo "❌ Pre-deployment checks failed"
    exit 1
fi

# Pull latest images (if updated)
echo "📥 Pulling latest Guard Co-Signer images..."
docker compose -f docker-compose.guards.yml pull

# Start Guard Co-Signers
echo "🏃 Starting Guard Co-Signers..."
docker compose -f docker-compose.guards.yml up -d

# Wait for startup
echo "⏳ Waiting for co-signers to initialize..."
sleep 30

# Check health status
echo "🏥 Checking health status..."
for i in {1..2}; do
    container="guard-cosigner-$i"
    if docker compose -f docker-compose.guards.yml ps | grep -q "$container.*healthy"; then
        echo "✅ $container is healthy"
    else
        echo "⚠️ $container status unknown (still starting up)"
    fi
done

echo "🎉 Guard Co-Signers deployment initiated!"
echo "📊 Monitor with: docker compose -f docker-compose.guards.yml logs -f"
```

### Step 3: Monitor Deployment

```bash
# shared/scripts/monitor-guards.sh
#!/bin/bash

echo "📊 Monitoring Guard Co-Signer deployment..."

# Function to check container status
check_container() {
    local container=$1
    local status=$(docker inspect --format='{{.State.Status}}' $container 2>/dev/null)
    local health=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null)
    
    echo "📦 $container:"
    echo "   Status: $status"
    echo "   Health: $health"
    
    # Show recent logs if there are issues
    if [ "$status" != "running" ] || [ "$health" = "unhealthy" ]; then
        echo "   📋 Recent logs:"
        docker logs --tail 10 $container | sed 's/^/      /'
    fi
    echo ""
}

# Monitor loop
while true; do
    clear
    echo "🛡️ Guard Co-Signer Status Monitor"
    echo "=================================="
    echo "$(date)"
    echo ""
    
    check_container "guard-cosigner-1"
    check_container "guard-cosigner-2"
    
    # Check SGX attestation status
    echo "🔒 SGX Attestation Status:"
    for i in {1..2}; do
        container="guard-cosigner-$i"
        if docker exec $container ls /tmp/attestation_success 2>/dev/null; then
            echo "   ✅ $container: Attestation successful"
        else
            echo "   ⏳ $container: Attestation pending"
        fi
    done
    
    echo ""
    echo "Press Ctrl+C to exit monitoring"
    sleep 5
done
```

---

## 🔐 SGX Enclave Initialization

### Verify SGX Attestation

```bash
# shared/scripts/verify-attestation.sh
#!/bin/bash

echo "🔍 Verifying SGX attestation for Guard Co-Signers..."

check_attestation() {
    local container=$1
    local cosigner_name=$2
    
    echo "🔒 Checking attestation for $cosigner_name..."
    
    # Check if enclave is loaded
    if docker exec $container pgrep -f "sgx_enclave" > /dev/null; then
        echo "✅ SGX enclave loaded in $container"
    else
        echo "❌ SGX enclave not loaded in $container"
        return 1
    fi
    
    # Check attestation logs
    if docker exec $container grep -q "Attestation successful" /log/cosigner.log 2>/dev/null; then
        echo "✅ Remote attestation successful for $cosigner_name"
    else
        echo "⏳ Remote attestation pending for $cosigner_name"
        echo "📋 Recent attestation logs:"
        docker exec $container tail -20 /log/cosigner.log | grep -i attestation | sed 's/^/   /'
    fi
    
    # Check key sealing
    if docker exec $container ls /db/sealed_key.bin 2>/dev/null; then
        echo "✅ MPC key share sealed for $cosigner_name"
        
        # Show key info (without exposing the key)
        local key_size=$(docker exec $container stat -c%s /db/sealed_key.bin)
        echo "   📊 Sealed key size: $key_size bytes"
    else
        echo "⏳ MPC key sealing pending for $cosigner_name"
    fi
    
    echo ""
}

# Check both guards
check_attestation "guard-cosigner-1" "Guard #1"
check_attestation "guard-cosigner-2" "Guard #2"

# Overall status
echo "🏁 Attestation verification complete"
echo "💡 If attestation is pending, check network connectivity to:"
echo "   - eu-guard-ra-server.fireblocks.io"
echo "   - pccs.fireblocks.io"
```

### Troubleshoot Common Issues

```bash
# shared/scripts/troubleshoot-guards.sh
#!/bin/bash

echo "🔧 Guard Co-Signer Troubleshooting"
echo "=================================="

troubleshoot_container() {
    local container=$1
    local cosigner=$2
    
    echo "🔍 Troubleshooting $container ($cosigner)..."
    
    # Check if container is running
    if ! docker ps | grep -q $container; then
        echo "❌ Container $container is not running"
        echo "📋 Container logs:"
        docker logs --tail 20 $container | sed 's/^/   /'
        echo ""
        return 1
    fi
    
    # Check SGX device access
    if docker exec $container ls /dev/sgx/enclave /dev/sgx/provision 2>/dev/null; then
        echo "✅ SGX devices accessible in $container"
    else
        echo "❌ SGX devices not accessible in $container"
        echo "💡 Fix: Ensure SGX devices are properly mapped in docker-compose.yml"
    fi
    
    # Check certificate files
    cert_files=("ra_cert.pem" "ra_cert.key.pem")
    for cert in "${cert_files[@]}"; do
        if docker exec $container ls /certs/$cert 2>/dev/null; then
            echo "✅ Certificate $cert found in $container"
        else
            echo "❌ Certificate $cert missing in $container"
        fi
    done
    
    # Check network connectivity
    if docker exec $container ping -c 1 eu-guard-ra-server.fireblocks.io 2>/dev/null; then
        echo "✅ Network connectivity OK for $container"
    else
        echo "❌ Network connectivity issues for $container"
        echo "💡 Check firewall and DNS resolution"
    fi
    
    # Check file permissions
    if docker exec $container test -r /certs/ra_cert.pem; then
        echo "✅ Certificate permissions OK for $container"
    else
        echo "❌ Certificate permission issues for $container"
        echo "💡 Fix: sudo chown -R 2000:2000 $cosigner/certs/"
    fi
    
    echo ""
}

# Troubleshoot both guards
troubleshoot_container "guard-cosigner-1" "guard1"
troubleshoot_container "guard-cosigner-2" "guard2"

# System-wide checks
echo "🖥️ System-wide checks..."

# Check SGX service
if systemctl is-active --quiet aesmd; then
    echo "✅ SGX AESM service running"
else
    echo "❌ SGX AESM service not running"
    echo "💡 Fix: sudo systemctl start aesmd"
fi

# Check Docker daemon
if systemctl is-active --quiet docker; then
    echo "✅ Docker service running"
else
    echo "❌ Docker service not running"
    echo "💡 Fix: sudo systemctl start docker"
fi

echo ""
echo "🔗 Useful commands:"
echo "   📊 View logs: docker compose -f docker-compose.guards.yml logs -f"
echo "   🔄 Restart: docker compose -f docker-compose.guards.yml restart"
echo "   🛑 Stop: docker compose -f docker-compose.guards.yml down"
echo "   📈 Stats: docker stats guard-cosigner-1 guard-cosigner-2"
```

---

## 🔑 MPC Key Generation

### Initiate Key Generation

```bash
# shared/scripts/init-key-generation.sh
#!/bin/bash

echo "🔑 Initiating MPC key generation..."

# Verify both guards are healthy
for i in {1..2}; do
    container="guard-cosigner-$i"
    health=$(docker inspect --format='{{.State.Health.Status}}' $container)
    if [ "$health" != "healthy" ]; then
        echo "❌ $container is not healthy ($health)"
        echo "Cannot proceed with key generation"
        exit 1
    fi
done

echo "✅ Both Guard Co-Signers are healthy"

# Check if keys already exist
for i in {1..2}; do
    container="guard-cosigner-$i"
    if docker exec $container ls /db/sealed_key.bin 2>/dev/null; then
        echo "⚠️ Sealed key already exists in $container"
        echo "❓ Do you want to regenerate keys? This will invalidate existing keys! (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo "❌ Aborting key generation"
            exit 1
        fi
        
        # Backup existing keys
        backup_dir="/backup/$(date +%Y%m%d_%H%M%S)"
        docker exec $container mkdir -p $backup_dir
        docker exec $container cp /db/sealed_key.bin $backup_dir/ 2>/dev/null || true
        echo "📦 Existing key backed up to $backup_dir"
    fi
done

# Trigger key generation via API call to guards
echo "🚀 Triggering key generation ceremony..."

# Call key generation endpoint on each guard
for i in {1..2}; do
    port=$((51970 + i))
    echo "📞 Initiating key generation on Guard $i (port $port)..."
    
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"action":"generate_keyshare","workspace_id":"'${WORKSPACE_ID}'"}' \
        http://localhost:$port/api/v1/key-generation)
    
    if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
        echo "✅ Key generation initiated on Guard $i"
    else
        echo "❌ Failed to initiate key generation on Guard $i"
        echo "Response: $response"
        exit 1
    fi
done

echo "⏳ Key generation in progress..."
echo "📊 Monitor progress with: ./shared/scripts/monitor-key-generation.sh"
```

### Monitor Key Generation

```bash
# shared/scripts/monitor-key-generation.sh
#!/bin/bash

echo "📊 Monitoring MPC key generation..."

monitor_key_generation() {
    while true; do
        clear
        echo "🔑 MPC Key Generation Status"
        echo "============================"
        echo "$(date)"
        echo ""
        
        local all_complete=true
        
        for i in {1..2}; do
            container="guard-cosigner-$i"
            echo "🛡️ Guard Co-Signer $i:"
            
            # Check if key file exists
            if docker exec $container ls /db/sealed_key.bin 2>/dev/null; then
                local key_size=$(docker exec $container stat -c%s /db/sealed_key.bin)
                echo "   ✅ Key sealed (${key_size} bytes)"
                
                # Check key validation
                if docker exec $container grep -q "Key validation successful" /log/cosigner.log 2>/dev/null; then
                    echo "   ✅ Key validation passed"
                else
                    echo "   ⏳ Key validation pending"
                    all_complete=false
                fi
            else
                echo "   ⏳ Key generation in progress"
                all_complete=false
            fi
            
            # Show recent key-related logs
            echo "   📋 Recent activity:"
            docker exec $container tail -5 /log/cosigner.log 2>/dev/null | \
                grep -i "key\|mpc\|generation" | \
                sed 's/^/      /' || echo "      (no recent key activity)"
            
            echo ""
        done
        
        if [ "$all_complete" = true ]; then
            echo "🎉 MPC key generation completed successfully!"
            echo ""
            echo "🔐 Key Share Summary:"
            for i in {1..2}; do
                container="guard-cosigner-$i"
                key_hash=$(docker exec $container sha256sum /db/sealed_key.bin | cut -d' ' -f1)
                echo "   Guard $i: ${key_hash:0:16}..."
            done
            echo ""
            echo "✅ Ready to proceed to Primary Co-Signer setup"
            break
        fi
        
        echo "⏳ Generation in progress... (Press Ctrl+C to exit monitoring)"
        sleep 10
    done
}

monitor_key_generation
```

---

## 📊 Validation & Health Checks

### Comprehensive Guard Validation

```bash
# shared/scripts/validate-guards.sh
#!/bin/bash

echo "🔍 Comprehensive Guard Co-Signer Validation"
echo "==========================================="

validate_guard() {
    local container=$1
    local guard_num=$2
    local port=$((51970 + guard_num))
    
    echo "🛡️ Validating Guard Co-Signer $guard_num..."
    
    local checks_passed=0
    local total_checks=8
    
    # 1. Container health
    if docker inspect --format='{{.State.Health.Status}}' $container | grep -q "healthy"; then
        echo "   ✅ Container health check"
        ((checks_passed++))
    else
        echo "   ❌ Container health check"
    fi
    
    # 2. SGX enclave loaded
    if docker exec $container pgrep -f "sgx_enclave" > /dev/null; then
        echo "   ✅ SGX enclave loaded"
        ((checks_passed++))
    else
        echo "   ❌ SGX enclave not loaded"
    fi
    
    # 3. Remote attestation
    if docker exec $container grep -q "Attestation successful" /log/cosigner.log 2>/dev/null; then
        echo "   ✅ Remote attestation successful"
        ((checks_passed++))
    else
        echo "   ❌ Remote attestation failed"
    fi
    
    # 4. Key sealing
    if docker exec $container ls /db/sealed_key.bin 2>/dev/null; then
        echo "   ✅ MPC key share sealed"
        ((checks_passed++))
    else
        echo "   ❌ MPC key share not sealed"
    fi
    
    # 5. Certificate validation
    if docker exec $container openssl x509 -in /certs/ra_cert.pem -noout -checkend 0 2>/dev/null; then
        echo "   ✅ Certificate valid"
        ((checks_passed++))
    else
        echo "   ❌ Certificate invalid or expired"
    fi
    
    # 6. Network connectivity
    if docker exec $container curl -s --connect-timeout 5 https://eu-guard-ra-server.fireblocks.io > /dev/null; then
        echo "   ✅ Network connectivity"
        ((checks_passed++))
    else
        echo "   ❌ Network connectivity issues"
    fi
    
    # 7. API endpoint responsive
    if curl -s --connect-timeout 5 http://localhost:$port/health > /dev/null; then
        echo "   ✅ API endpoint responsive"
        ((checks_passed++))
    else
        echo "   ❌ API endpoint not responding"
    fi
    
    # 8. Log file accessibility
    if docker exec $container test -r /log/cosigner.log; then
        echo "   ✅ Log file accessible"
        ((checks_passed++))
    else
        echo "   ❌ Log file not accessible"
    fi
    
    echo "   📊 Health Score: $checks_passed/$total_checks"
    
    if [ $checks_passed -eq $total_checks ]; then
        echo "   🎉 Guard $guard_num fully operational"
        return 0
    else
        echo "   ⚠️ Guard $guard_num has issues"
        return 1
    fi
}

# Validate both guards
validate_guard "guard-cosigner-1" 1
echo ""
validate_guard "guard-cosigner-2" 2
echo ""

# Overall system validation
echo "🏁 Overall System Status:"
if docker compose -f docker-compose.guards.yml ps | grep -q "healthy.*healthy"; then
    echo "✅ Both Guard Co-Signers are operational"
    echo "🎯 Ready to proceed to Step 4: Primary Co-Signer setup"
else
    echo "❌ One or more Guard Co-Signers have issues"
    echo "🔧 Run troubleshooting: ./shared/scripts/troubleshoot-guards.sh"
fi
```

---

## 📋 Step 3 Completion Checklist

Before proceeding to Step 4, verify:

- [ ] **Certificates**: Fireblocks-issued certificates installed for both guards
- [ ] **Deployment**: Both Guard Co-Signers deployed and running
- [ ] **Health**: Container health checks passing
- [ ] **SGX**: Enclaves loaded and attested successfully
- [ ] **Keys**: MPC key shares generated and sealed
- [ ] **Network**: Connectivity to Fireblocks services verified
- [ ] **Logs**: No critical errors in co-signer logs
- [ ] **API**: Health endpoints responding correctly

### Quick Validation

```bash
# Run this to verify Step 3 completion
cd ~/hosted-mpc
./shared/scripts/validate-guards.sh
```

---

## 🔄 Next Steps

Excellent! Your Guard Co-Signers are now deployed and operational. In Step 4, we'll:

- Set up the Primary Co-Signer (API or Mobile)
- Configure workspace schema and clique definitions
- Complete the MPC signing architecture
- Perform end-to-end transaction signing tests

**Coming up in Step 4:**
- Primary Co-Signer deployment options
- Workspace schema configuration with Ops-Client
- Clique formation and validation
- First MPC transaction signing test -->