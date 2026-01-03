# Driver License Platform - Setup Guide
## Step-by-Step Deployment Instructions

**Repository:** https://github.com/goutham432/Driver_License_App  
**Target Platform:** DigitalOcean Kubernetes (DOKS)  
**Estimated Time:** 30-45 minutes

---

## Prerequisites

Before starting, ensure you have:

- ✅ **DigitalOcean Account** with $25+ credit
- ✅ **GitHub Account** (for repository)
- ✅ **Git** installed on your local machine
- ✅ **Node.js 18+** installed (for local development)
- ✅ **kubectl** installed (for Kubernetes management)
- ✅ **doctl** installed (DigitalOcean CLI)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/goutham432/Driver_License_App.git
cd Driver_License_App
```

---

## Step 2: Set Up DigitalOcean Resources

### 2.1 Create Container Registry

**Option A: Via Web UI**
1. Go to: https://cloud.digitalocean.com/registry
2. Click "Create Registry"
3. Name: `driver-license-registry`
4. Select region closest to you
5. Click "Create Registry"

**Option B: Via CLI**
```bash
doctl registry create driver-license-registry
```

### 2.2 Create Kubernetes Cluster

**Option A: Via Web UI**
1. Go to: https://cloud.digitalocean.com/kubernetes/clusters
2. Click "Create Kubernetes Cluster"
3. **Cluster Name:** `driver-license-cluster`
4. **Region:** Choose closest to you
5. **Node Pool:**
   - **Name:** `driver-license-pool`
   - **Size:** `s-1vcpu-2gb` (2GB RAM, 1 vCPU)
   - **Count:** `2` (for high availability)
   - **Autoscaling:** Disabled (for cost control)
6. Click "Create Cluster"
7. Wait 5-10 minutes for cluster to be ready

**Option B: Via CLI**
```bash
doctl kubernetes cluster create driver-license-cluster \
  --region nyc1 \
  --node-pool "name=driver-license-pool;size=s-1vcpu-2gb;count=2"
```

### 2.3 Save Kubernetes Config

```bash
doctl kubernetes cluster kubeconfig save driver-license-cluster
```

Verify connection:
```bash
kubectl get nodes
```

---

## Step 3: Configure GitHub Secrets

1. Go to: https://github.com/goutham432/Driver_License_App/settings/secrets/actions
2. Click "New repository secret"
3. Add the following secret:
   - **Name:** `DIGITALOCEAN_ACCESS_TOKEN`
   - **Value:** Your DigitalOcean API token
     - Get token from: https://cloud.digitalocean.com/account/api/tokens
     - Click "Generate New Token"
     - Name: `github_token_for_Test`
     - Scopes: Read, Write
     - Copy the token and paste as secret value

---

## Step 4: Authenticate with Container Registry

```bash
# Login to DigitalOcean Container Registry
doctl registry login
```

---

## Step 5: Deploy Application

### 5.1 Automatic Deployment (Recommended)

The application will automatically deploy when you push to the `main` branch via GitHub Actions.

**To trigger deployment:**
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

**Monitor deployment:**
1. Go to: https://github.com/goutham432/Driver_License_App/actions
2. Click on the latest workflow run
3. Watch the deployment progress

### 5.2 Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# 1. Create namespace
kubectl create namespace driver-license-platform

# 2. Create registry credentials secret
kubectl create secret docker-registry registry-credentials \
  --docker-server=registry.digitalocean.com \
  --docker-username=$(doctl auth list -o json | jq -r '.[0].token') \
  --docker-password=$(doctl auth list -o json | jq -r '.[0].token') \
  -n driver-license-platform

# 3. Create application secrets
kubectl create secret generic app-secrets \
  --from-literal=mongodb-uri="mongodb://mongodb-service:27017/driver-license-platform" \
  --from-literal=jwt-secret=$(openssl rand -base64 32) \
  -n driver-license-platform

# 4. Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# 5. Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n driver-license-platform --timeout=300s

# 6. Deploy application
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/hpa.yaml

# 7. Check deployment status
kubectl get pods -n driver-license-platform
kubectl get svc -n driver-license-platform
```

---

## Step 6: Get Application URL

### Option A: Via kubectl

```bash
kubectl get svc driver-license-app-service -n driver-license-platform
```

Look for the `EXTERNAL-IP` column - this is your Load Balancer IP.

### Option B: Via DigitalOcean UI

1. Go to: https://cloud.digitalocean.com/networking/load_balancers
2. Find the load balancer for your cluster
3. Copy the IP address

### Option C: Via Script

```powershell
# Windows PowerShell
.\GET_LOAD_BALANCER_IP.ps1
```

---

## Step 7: Initialize Sample Data

The database starts empty. To populate it with practice tests:

### Option A: Via PowerShell Script (Windows)

```powershell
.\INIT_SAMPLE_DATA.ps1
```

### Option B: Manual

```bash
# 1. Port forward MongoDB
kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform

# 2. In another terminal, set environment variable
export MONGODB_URI="mongodb://localhost:27017/driver-license-platform"

# 3. Run initialization script
node scripts/init-k8s-sample-data.js
```

---

## Step 8: Verify Deployment

1. **Check Pods:**
   ```bash
   kubectl get pods -n driver-license-platform
   ```
   All pods should be in `Running` state.

2. **Check Services:**
   ```bash
   kubectl get svc -n driver-license-platform
   ```
   Load Balancer should have an `EXTERNAL-IP`.

3. **Test Application:**
   - Open browser: `http://YOUR_LOAD_BALANCER_IP`
   - You should see the application homepage
   - Try registering a new account
   - Test booking an appointment
   - Take a practice test

4. **Check Logs:**
   ```bash
   kubectl logs -l app=driver-license-app -n driver-license-platform --tail=50
   ```

---

## Troubleshooting

### Issue: Pods not starting

**Check:**
```bash
kubectl describe pod POD_NAME -n driver-license-platform
kubectl logs POD_NAME -n driver-license-platform
```

**Common causes:**
- Insufficient resources (CPU/memory)
- Image pull errors (check registry credentials)
- MongoDB not ready

### Issue: Cannot access application

**Check:**
1. Load Balancer has external IP
2. Service is pointing to correct pods
3. Pods are running and healthy
4. Health endpoint works: `http://IP/health`

### Issue: Database connection errors

**Check:**
1. MongoDB pod is running
2. MongoDB service is accessible
3. Connection string in secrets is correct

---

## Architecture Overview

```
User Browser
    ↓
DigitalOcean Load Balancer (Public IP)
    ↓
Kubernetes Cluster (DOKS)
    ├── Application Pods (2-10 replicas, auto-scaled)
    │   ├── React Frontend (built, static)
    │   └── Node.js Backend (Express.js)
    └── MongoDB Pod (1 replica, 10GB storage)
```

---

## Cost Breakdown

**Monthly Infrastructure Costs:**
- Kubernetes Nodes (2x s-1vcpu-2gb): $24.00
- Load Balancer: $12.00
- Container Registry: $5.00
- MongoDB Storage (10GB): $1.20
- **Total: ~$42.20/month**

---

## Next Steps

1. **Set up custom domain** (optional)
   - Point DNS to Load Balancer IP
   - Configure SSL with cert-manager

2. **Set up monitoring** (optional)
   - Install Prometheus/Grafana
   - Configure alerts

3. **Configure backups** (recommended)
   - Set up automated MongoDB backups
   - Test restore procedures

---

## Support & Resources

- **Repository:** https://github.com/goutham432/Driver_License_App
- **Documentation:** See `README.md` and `Documentation/` folder
- **DigitalOcean Docs:** https://docs.digitalocean.com/products/kubernetes/

---

**Last Updated:** January 2025  
**Version:** 1.0.0

