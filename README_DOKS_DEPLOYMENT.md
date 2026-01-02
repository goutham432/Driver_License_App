# Driver License Platform - DOKS Deployment Guide
## DigitalOcean Kubernetes (DOKS) Deployment Instructions

**For:** DigitalOcean TAM Assessment  
**Repository:** https://github.com/goutham432/Driver_License_App

---

## 📋 Overview

This guide provides step-by-step instructions to deploy the Driver License Platform on **DigitalOcean Kubernetes (DOKS)** with:
- ✅ Docker containerization
- ✅ DigitalOcean Load Balancer
- ✅ Horizontal Pod Autoscaler (HPA)
- ✅ MongoDB on DOKS
- ✅ Cost optimization

---

## 🏗️ Architecture

```
GitHub Repository
    │
    ├── Dockerfile (Multi-stage build)
    ├── k8s/ (Kubernetes manifests)
    │   ├── app-deployment.yaml
    │   ├── app-service.yaml (LoadBalancer)
    │   ├── hpa.yaml (Horizontal Pod Autoscaler)
    │   └── mongodb-deployment.yaml
    │
    ▼
DigitalOcean Container Registry
    │
    ▼
DigitalOcean Kubernetes Cluster (DOKS)
    │
    ├── DigitalOcean Load Balancer
    │       │
    │       ▼
    ├── Application Pods (2-10, auto-scaled by HPA)
    │       │
    │       ▼
    └── MongoDB Pod (Persistent storage)
```

---

## 📦 Prerequisites

- **DigitalOcean Account** (with $200 assessment credit)
- **GitHub Account** (code already pushed)
- **Local Tools:**
  - Git
  - Docker Desktop
  - kubectl
  - doctl (DigitalOcean CLI)

---

## 🚀 Quick Start

### 1. Set Up DigitalOcean

```powershell
# Authenticate doctl
doctl auth init
# Enter API token from: https://cloud.digitalocean.com/account/api/tokens
```

### 2. Create Container Registry

1. Go to: https://cloud.digitalocean.com/registry
2. Create registry: `driver-license-registry`
3. Authenticate:
   ```powershell
   doctl registry login
   ```

### 3. Build and Push Docker Image

```powershell
# Build image
docker build -t registry.digitalocean.com/driver-license-registry/driver-license-app:latest .

# Push image
docker push registry.digitalocean.com/driver-license-registry/driver-license-app:latest
```

### 4. Create DOKS Cluster

1. Go to: https://cloud.digitalocean.com/kubernetes/clusters
2. Create cluster:
   - **Name:** `driver-license-cluster`
   - **Region:** Closest to you
   - **Node Plan:** s-2vcpu-4gb
   - **Node Count:** 2
3. Connect kubectl:
   ```powershell
   doctl kubernetes cluster kubeconfig save driver-license-cluster
   ```

### 5. Deploy to Kubernetes

```powershell
# Create namespace
kubectl create namespace driver-license-platform

# Create secrets
kubectl create secret generic app-secrets `
  --from-literal=mongodb-uri="mongodb://mongodb-service:27017/driver-license-platform" `
  --from-literal=jwt-secret="YOUR_JWT_SECRET" `
  -n driver-license-platform

# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Deploy application
kubectl apply -f k8s/app-deployment.yaml

# Deploy Load Balancer
kubectl apply -f k8s/app-service.yaml

# Deploy HPA
kubectl apply -f k8s/hpa.yaml
```

### 6. Get Load Balancer IP

```powershell
kubectl get svc -n driver-license-platform
# Wait for EXTERNAL-IP (1-2 minutes)
# Visit: http://YOUR-EXTERNAL-IP
```

---

## 📁 Kubernetes Manifests

### Deployment (`k8s/app-deployment.yaml`)
- **Replicas:** 3 (initial)
- **Image:** From DigitalOcean Container Registry
- **Resources:** CPU 200m-1000m, Memory 256Mi-512Mi
- **Health Checks:** Liveness and readiness probes
- **Environment Variables:** From Kubernetes secrets

### Service (`k8s/app-service.yaml`)
- **Type:** LoadBalancer (DigitalOcean Load Balancer)
- **Port:** 80 → 5000
- **Purpose:** Expose application to internet

### HPA (`k8s/hpa.yaml`)
- **Min Replicas:** 2
- **Max Replicas:** 10
- **Target CPU:** 70%
- **Purpose:** Auto-scale based on traffic

### MongoDB (`k8s/mongodb-deployment.yaml`)
- **Replicas:** 1
- **Storage:** 10GB PersistentVolumeClaim
- **Service:** ClusterIP (internal only)

---

## 🔧 Configuration

### Environment Variables

Set via Kubernetes secrets:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT token secret
- `CLIENT_URL`: Application public URL
- `NODE_ENV`: production
- `PORT`: 5000

### Update Image in Deployment

Edit `k8s/app-deployment.yaml`:
```yaml
image: registry.digitalocean.com/YOUR-REGISTRY/driver-license-app:latest
```

---

## 📊 Cost Analysis

### Monthly Costs

| Component | Specification | Monthly Cost |
|-----------|---------------|--------------|
| Kubernetes Nodes (2x) | s-2vcpu-4gb | $48.00 |
| Container Registry | Basic | $5.00 |
| Load Balancer | Standard | $12.00 |
| MongoDB Storage | 10GB | $1.20 |
| **Total** | | **$66.20** |

### Cost Optimization

1. **HPA:** Automatically scales pods (2-10), saves ~30% during low traffic
2. **Right-sizing:** Can use s-1vcpu-2gb nodes for development ($24/month savings)
3. **Reserved Instances:** 20% discount for 1-year commitment

**See:** `Documentation/COST_ANALYSIS.md` for detailed analysis

---

## ✅ Verification

### Check Deployment Status

```powershell
# Check pods
kubectl get pods -n driver-license-platform

# Check services (Load Balancer)
kubectl get svc -n driver-license-platform

# Check HPA
kubectl get hpa -n driver-license-platform

# Check deployments
kubectl get deployment -n driver-license-platform
```

### Test Application

1. **Get Load Balancer IP:**
   ```powershell
   kubectl get svc driver-license-app-service -n driver-license-platform
   ```

2. **Visit:** `http://YOUR-EXTERNAL-IP`

3. **Test Health Endpoint:**
   ```powershell
   curl http://YOUR-EXTERNAL-IP/health
   ```

---

## 🔍 Troubleshooting

### Pods Not Starting

```powershell
# Check pod logs
kubectl logs <pod-name> -n driver-license-platform

# Check pod events
kubectl describe pod <pod-name> -n driver-license-platform
```

### Load Balancer Not Working

```powershell
# Check service
kubectl get svc -n driver-license-platform

# Check endpoints
kubectl get endpoints -n driver-license-platform
```

### HPA Not Scaling

```powershell
# Check HPA status
kubectl describe hpa -n driver-license-platform

# Check pod metrics
kubectl top pods -n driver-license-platform
```

---

## 📚 Documentation

- **Complete Beginner Guide:** `Documentation/DOKS_BEGINNER_GUIDE.md`
- **Cost Analysis:** `Documentation/COST_ANALYSIS.md`
- **Architecture Diagram:** `Documentation/ARCHITECTURE_ONE_PAGE.html`
- **QBR Deck:** `Documentation/QBR_DECK.html`

---

## 🎯 Assessment Requirements Checklist

- [x] Deploy on DigitalOcean Kubernetes (DOKS)
- [x] Docker containerization (Dockerfile)
- [x] DigitalOcean Load Balancer (Service type: LoadBalancer)
- [x] Horizontal Pod Autoscaler (HPA)
- [x] MongoDB on DigitalOcean
- [x] Kubernetes manifests (YAML files)
- [x] README with deployment instructions
- [x] Cost analysis
- [x] Architecture diagram

---

## 🚀 Next Steps

1. **Follow the complete guide:** `Documentation/DOKS_BEGINNER_GUIDE.md`
2. **Create architecture diagram** (Draw.io, Lucidchart)
3. **Prepare QBR summary** (see `Documentation/QBR_DECK.html`)
4. **Test all features** on deployed application

---

**Repository:** https://github.com/goutham432/Driver_License_App  
**For detailed instructions, see:** `Documentation/DOKS_BEGINNER_GUIDE.md`

