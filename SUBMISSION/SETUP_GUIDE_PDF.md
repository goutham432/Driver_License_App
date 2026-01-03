# Driver License Platform
## Complete Setup Guide for DigitalOcean Kubernetes Deployment

**Version:** 1.0.0  
**Date:** January 2025  
**Repository:** https://github.com/goutham432/Driver_License_App  
**Target Platform:** DigitalOcean Kubernetes (DOKS)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: DigitalOcean Account Setup](#step-1-digitalocean-account-setup)
4. [Step 2: Create Container Registry](#step-2-create-container-registry)
5. [Step 3: Create Kubernetes Cluster](#step-3-create-kubernetes-cluster)
6. [Step 4: Configure GitHub Secrets](#step-4-configure-github-secrets)
7. [Step 5: Deploy Application](#step-5-deploy-application)
8. [Step 6: Access Application](#step-6-access-application)
9. [Step 7: Initialize Sample Data](#step-7-initialize-sample-data)
10. [Step 8: Verify Deployment](#step-8-verify-deployment)
11. [Troubleshooting](#troubleshooting)
12. [Architecture Overview](#architecture-overview)
13. [Cost Breakdown](#cost-breakdown)
14. [Next Steps](#next-steps)

---

## Overview

This guide provides step-by-step instructions for deploying the Driver License Platform to DigitalOcean Kubernetes (DOKS). The application is a full-stack SaaS platform for driver's license test preparation and DMV appointment booking.

**Estimated Deployment Time:** 30-45 minutes  
**Monthly Cost:** ~$42.20  
**Infrastructure:** 2-node Kubernetes cluster with Load Balancer

---

## Prerequisites

Before starting, ensure you have:

- ✅ **DigitalOcean Account** with $25+ credit
- ✅ **GitHub Account** (for repository and CI/CD)
- ✅ **Git** installed on your local machine
- ✅ **kubectl** installed (Kubernetes CLI)
- ✅ **doctl** installed (DigitalOcean CLI)
- ✅ **Node.js 18+** (optional, for local development)

### Installing Prerequisites

#### Install kubectl (Windows)

```powershell
# Using Chocolatey
choco install kubernetes-cli

# Or download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
```

#### Install doctl (Windows)

```powershell
# Using Chocolatey
choco install doctl

# Or download from: https://github.com/digitalocean/doctl/releases
```

#### Install Git (Windows)

```powershell
# Using Chocolatey
choco install git

# Or download from: https://git-scm.com/download/win
```

---

## Step 1: DigitalOcean Account Setup

### 1.1 Create DigitalOcean Account

1. Go to: https://cloud.digitalocean.com
2. Click "Sign Up" and create an account
3. Verify your email address

### 1.2 Generate API Token

1. Go to: https://cloud.digitalocean.com/account/api/tokens
2. Click "Generate New Token"
3. **Token Name:** `github_token_for_Test` (or any name)
4. **Expiration:** No expiration (or set as needed)
5. **Scopes:** Select "Read" and "Write"
6. Click "Generate Token"
7. **IMPORTANT:** Copy the token immediately (you won't see it again)
   - Token format: `dop_v1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 1.3 Authenticate doctl

```bash
doctl auth init
# Enter your API token when prompted
```

Verify authentication:
```bash
doctl account get
```

---

## Step 2: Create Container Registry

The Container Registry stores Docker images for your application.

### Option A: Via Web UI

1. Go to: https://cloud.digitalocean.com/registry
2. Click "Create Registry"
3. **Registry Name:** `driver-license-registry`
4. **Region:** Choose closest to you (e.g., `nyc1`, `sfo3`)
5. Click "Create Registry"
6. Wait 1-2 minutes for registry to be ready

### Option B: Via CLI

```bash
doctl registry create driver-license-registry
```

### 2.1 Login to Registry

```bash
doctl registry login
```

Verify login:
```bash
doctl registry get
```

---

## Step 3: Create Kubernetes Cluster

### Option A: Via Web UI (Recommended for Beginners)

1. Go to: https://cloud.digitalocean.com/kubernetes/clusters
2. Click "Create Kubernetes Cluster"
3. **Cluster Name:** `driver-license-cluster`
4. **Region:** Choose closest to you
5. **Kubernetes Version:** Latest stable (default)
6. **Node Pool Configuration:**
   - **Name:** `driver-license-pool`
   - **Size:** `s-1vcpu-2gb` (2GB RAM, 1 vCPU)
   - **Count:** `2` (for high availability)
   - **Autoscaling:** Disabled (for cost control)
7. Click "Create Cluster"
8. **Wait 5-10 minutes** for cluster to be ready

### Option B: Via CLI

```bash
doctl kubernetes cluster create driver-license-cluster \
  --region nyc1 \
  --node-pool "name=driver-license-pool;size=s-1vcpu-2gb;count=2"
```

### 3.1 Save Kubernetes Config

Once the cluster is ready:

```bash
doctl kubernetes cluster kubeconfig save driver-license-cluster
```

Verify connection:
```bash
kubectl get nodes
```

You should see 2 nodes in `Ready` state.

---

## Step 4: Configure GitHub Secrets

GitHub Actions needs your DigitalOcean API token to deploy automatically.

### 4.1 Add Secret to GitHub

1. Go to: https://github.com/goutham432/Driver_License_App
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. **Name:** `DIGITALOCEAN_ACCESS_TOKEN`
6. **Value:** Paste your DigitalOcean API token (from Step 1.2)
7. Click "Add secret"

### 4.2 Verify Secret

The secret should appear in the list. It will be used automatically by GitHub Actions.

---

## Step 5: Deploy Application

### Option A: Automatic Deployment (Recommended)

The application automatically deploys via GitHub Actions when you push to the `main` branch.

#### 5.1 Clone Repository (if not already done)

```bash
git clone https://github.com/goutham432/Driver_License_App.git
cd Driver_License_App
```

#### 5.2 Push to GitHub

```bash
git add .
git commit -m "Initial deployment to DOKS"
git push origin main
```

#### 5.3 Monitor Deployment

1. Go to: https://github.com/goutham432/Driver_License_App/actions
2. Click on the latest workflow run
3. Watch the deployment progress:
   - ✅ Build Docker image
   - ✅ Push to Container Registry
   - ✅ Deploy to Kubernetes
   - ✅ Verify pods are running

**Expected Time:** 5-10 minutes

### Option B: Manual Deployment

If you prefer manual deployment:

#### 5.1 Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

#### 5.2 Create Registry Credentials Secret

```bash
# Get your DigitalOcean token
TOKEN=$(doctl auth list -o json | jq -r '.[0].token')

# Create secret
kubectl create secret docker-registry registry-credentials \
  --docker-server=registry.digitalocean.com \
  --docker-username=$TOKEN \
  --docker-password=$TOKEN \
  -n driver-license-platform
```

#### 5.3 Create Application Secrets

```bash
# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create secret
kubectl create secret generic app-secrets \
  --from-literal=mongodb-uri="mongodb://mongodb-service:27017/driver-license-platform" \
  --from-literal=jwt-secret="$JWT_SECRET" \
  -n driver-license-platform
```

#### 5.4 Deploy MongoDB

```bash
kubectl apply -f k8s/mongodb-deployment.yaml
```

Wait for MongoDB to be ready:
```bash
kubectl wait --for=condition=ready pod -l app=mongodb -n driver-license-platform --timeout=300s
```

#### 5.5 Deploy Application

```bash
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/hpa.yaml
```

#### 5.6 Verify Deployment

```bash
kubectl get pods -n driver-license-platform
kubectl get svc -n driver-license-platform
```

All pods should be in `Running` state.

---

## Step 6: Access Application

### 6.1 Get Load Balancer IP

**Option A: Via kubectl**

```bash
kubectl get svc driver-license-app-service -n driver-license-platform
```

Look for `EXTERNAL-IP` in the output.

**Option B: Via DigitalOcean UI**

1. Go to: https://cloud.digitalocean.com/networking/load_balancers
2. Find the load balancer for your cluster
3. Copy the IP address

**Option C: Via Script (Windows PowerShell)**

```powershell
.\GET_LOAD_BALANCER_IP.ps1
```

### 6.2 Access Application

Open your browser and navigate to:
```
http://YOUR_LOAD_BALANCER_IP
```

Example: `http://129.212.162.2`

You should see the Driver License Platform homepage.

---

## Step 7: Initialize Sample Data

The database starts empty. To populate it with practice tests:

### Option A: Via PowerShell Script (Windows)

```powershell
.\INIT_SAMPLE_DATA.ps1
```

This script will:
1. Connect to the Kubernetes cluster
2. Port-forward MongoDB
3. Run the initialization script
4. Populate database with sample tests

### Option B: Manual

#### 7.1 Port Forward MongoDB

```bash
kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform
```

Keep this terminal open.

#### 7.2 Run Initialization Script

In another terminal:

```bash
# Set MongoDB URI
export MONGODB_URI="mongodb://localhost:27017/driver-license-platform"

# Run script
node scripts/init-k8s-sample-data.js
```

#### 7.3 Verify Data

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/driver-license-platform

# Check collections
show collections

# Count documents
db.tests.countDocuments()
db.users.countDocuments()
```

---

## Step 8: Verify Deployment

### 8.1 Check Pod Status

```bash
kubectl get pods -n driver-license-platform
```

Expected output:
```
NAME                                  READY   STATUS    RESTARTS   AGE
driver-license-app-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
driver-license-app-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
mongodb-xxxxxxxxxx-xxxxx              1/1     Running   0          10m
```

All pods should be `Running` and `READY 1/1`.

### 8.2 Check Services

```bash
kubectl get svc -n driver-license-platform
```

Expected output:
```
NAME                        TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)        AGE
driver-license-app-service  LoadBalancer  10.xxx.xxx.xxx  129.212.162.2   80:3xxxx/TCP   5m
mongodb-service            ClusterIP      10.xxx.xxx.xxx   <none>          27017/TCP      10m
```

Load Balancer should have an `EXTERNAL-IP`.

### 8.3 Test Application

1. **Homepage:** Open `http://YOUR_LOAD_BALANCER_IP`
2. **Register:** Create a new account
3. **Login:** Sign in with your credentials
4. **Practice Tests:** Navigate to "Practice Tests" and select a state
5. **Book Appointment:** Try booking a DMV appointment
6. **Dashboard:** View your statistics and appointments

### 8.4 Check Logs

```bash
# Application logs
kubectl logs -l app=driver-license-app -n driver-license-platform --tail=50

# MongoDB logs
kubectl logs -l app=mongodb -n driver-license-platform --tail=50
```

### 8.5 Health Check

```bash
curl http://YOUR_LOAD_BALANCER_IP/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-01-XX..."}
```

---

## Troubleshooting

### Issue: Pods Not Starting

**Symptoms:** Pods stuck in `Pending` or `ImagePullBackOff` state

**Solutions:**
1. Check pod events:
   ```bash
   kubectl describe pod POD_NAME -n driver-license-platform
   ```

2. Check logs:
   ```bash
   kubectl logs POD_NAME -n driver-license-platform
   ```

3. Verify registry credentials:
   ```bash
   kubectl get secret registry-credentials -n driver-license-platform
   ```

4. Common causes:
   - Insufficient CPU/memory (reduce replicas or increase node size)
   - Image pull authentication failed (recreate registry secret)
   - MongoDB not ready (wait for MongoDB pod)

### Issue: Cannot Access Application

**Symptoms:** Blank page or connection refused

**Solutions:**
1. Verify Load Balancer has external IP:
   ```bash
   kubectl get svc driver-license-app-service -n driver-license-platform
   ```

2. Check pods are running:
   ```bash
   kubectl get pods -n driver-license-platform
   ```

3. Test health endpoint:
   ```bash
   curl http://YOUR_LOAD_BALANCER_IP/health
   ```

4. Check application logs:
   ```bash
   kubectl logs -l app=driver-license-app -n driver-license-platform --tail=50
   ```

### Issue: Database Connection Errors

**Symptoms:** "MongoDB connection error" in logs

**Solutions:**
1. Verify MongoDB pod is running:
   ```bash
   kubectl get pods -l app=mongodb -n driver-license-platform
   ```

2. Check MongoDB service:
   ```bash
   kubectl get svc mongodb-service -n driver-license-platform
   ```

3. Verify connection string in secrets:
   ```bash
   kubectl get secret app-secrets -n driver-license-platform -o yaml
   ```

4. Check MongoDB logs:
   ```bash
   kubectl logs -l app=mongodb -n driver-license-platform
   ```

### Issue: Practice Tests Not Available

**Symptoms:** No tests shown in UI

**Solution:** Initialize sample data (see Step 7)

### Issue: GitHub Actions Deployment Fails

**Symptoms:** Workflow fails with authentication errors

**Solutions:**
1. Verify `DIGITALOCEAN_ACCESS_TOKEN` secret is set correctly
2. Check token has "Read" and "Write" scopes
3. Verify cluster name matches: `driver-license-cluster`
4. Check registry name matches: `driver-license-registry`

---

## Architecture Overview

### 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Tier 1: Presentation                │
│                  (User's Web Browser)                   │
└────────────────────┬──────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     │
┌────────────────────▼──────────────────────────────────┐
│              Tier 2: Application Layer                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │     DigitalOcean Load Balancer                     │ │
│  │     (Public IP: 129.212.162.2)                    │ │
│  └────────────────────┬──────────────────────────────┘ │
│                       │                                  │
│  ┌────────────────────▼──────────────────────────────┐ │
│  │     Kubernetes Cluster (DOKS)                     │ │
│  │                                                     │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │  Application Pods (2-10 replicas)            │ │ │
│  │  │  - React Frontend (static files)             │ │ │
│  │  │  - Node.js Backend (Express.js)               │ │ │
│  │  │  - Auto-scaled by HPA                         │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │                                                     │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │  MongoDB Pod (1 replica)                    │ │ │
│  │  │  - 10GB Persistent Storage                  │ │ │
│  │  │  - ClusterIP Service                         │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │                                                     │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │  Horizontal Pod Autoscaler (HPA)            │ │ │
│  │  │  - CPU: 70% threshold                        │ │ │
│  │  │  - Memory: 80% threshold                    │ │ │
│  │  │  - Min: 2 pods, Max: 10 pods                │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘
│                                                          │
┌──────────────────────────────────────────────────────────┐
│                    Tier 3: Data Layer                     │
│              (MongoDB Database - Logical)                  │
│         (Physically located in Tier 2/Kubernetes)         │
└──────────────────────────────────────────────────────────┘
```

### Key Components

1. **Load Balancer:** Distributes traffic to application pods
2. **Application Pods:** Run React frontend and Node.js backend
3. **MongoDB Pod:** Self-hosted database inside Kubernetes
4. **HPA:** Automatically scales application pods based on metrics
5. **Services:** Internal networking (ClusterIP) and external access (LoadBalancer)

---

## Cost Breakdown

### Monthly Infrastructure Costs

| Component | Specification | Monthly Cost |
|-----------|--------------|--------------|
| Kubernetes Nodes | 2x s-1vcpu-2gb | $24.00 |
| Load Balancer | Standard | $12.00 |
| Container Registry | Basic | $5.00 |
| MongoDB Storage | 10GB | $1.20 |
| **Total** | | **$42.20** |

### Cost Optimization Tips

1. **Reserved Instances:** 20% savings with 1-year commitment
2. **App Platform:** Could reduce to ~$20/month (less Kubernetes control)
3. **Managed MongoDB:** $57/month (saves operational overhead)
4. **Spot Instances:** 50% savings (risk of interruption)

---

## Next Steps

### Immediate (Next 30 Days)

1. ✅ **Deployment Complete** - Application deployed on DOKS
2. ⏳ **Monitoring Setup** - Implement Prometheus/Grafana
3. ⏳ **Backup Strategy** - Configure automated MongoDB backups
4. ⏳ **SSL Certificate** - Set up HTTPS with Let's Encrypt (requires domain)

### Short-term (Next 90 Days)

1. **Performance Optimization:**
   - Database query optimization
   - CDN integration
   - Caching layer

2. **Cost Optimization:**
   - Evaluate App Platform migration
   - Reserved instance purchase
   - Resource right-sizing

3. **Feature Enhancements:**
   - Email notifications
   - Test result analytics
   - Multi-language support

### Long-term (6+ Months)

1. **Scalability:**
   - Multi-region deployment
   - Database sharding
   - Microservices architecture (if needed)

2. **Advanced Features:**
   - Mobile app development
   - Real-time notifications
   - Advanced analytics dashboard

---

## Support & Resources

- **Repository:** https://github.com/goutham432/Driver_License_App
- **DigitalOcean Docs:** https://docs.digitalocean.com/products/kubernetes/
- **Kubernetes Docs:** https://kubernetes.io/docs/
- **MongoDB Docs:** https://docs.mongodb.com/

---

## Conclusion

You have successfully deployed the Driver License Platform to DigitalOcean Kubernetes! The application is now:

- ✅ **Running** on a 2-node high-availability cluster
- ✅ **Auto-scaling** from 2 to 10 pods based on load
- ✅ **Accessible** via Load Balancer IP
- ✅ **Cost-optimized** at ~$42/month
- ✅ **Production-ready** with health checks and monitoring

For questions or issues, refer to the troubleshooting section or check the repository documentation.

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Author:** Goutham

