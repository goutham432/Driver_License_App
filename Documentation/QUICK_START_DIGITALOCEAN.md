# 🚀 Quick Start: DigitalOcean Deployment
## Fast Reference for Experienced Users

---

## Prerequisites Checklist

- [ ] GitHub account created
- [ ] DigitalOcean account created ($200 credit)
- [ ] Git installed (`git --version`)
- [ ] Docker Desktop installed and running (`docker --version`)
- [ ] kubectl installed (`kubectl version --client`)
- [ ] doctl installed (`doctl version`)

---

## 5-Minute Setup

### 1. Push to GitHub
```powershell
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/goutham432/Driver_License_App.git
git push -u origin main
```

### 2. DigitalOcean Setup
```powershell
# Authenticate
doctl auth init
# Enter API token from: https://cloud.digitalocean.com/account/api/tokens

# Create registry (via web UI: https://cloud.digitalocean.com/registry)
# Name: driver-license-registry

# Login to registry
doctl registry login
```

### 3. Build & Push Docker Image
```powershell
docker build -t registry.digitalocean.com/driver-license-registry/driver-license-app:latest .
docker push registry.digitalocean.com/driver-license-registry/driver-license-app:latest
```

### 4. Create Kubernetes Cluster
- **Web UI:** https://cloud.digitalocean.com/kubernetes/clusters
- **Settings:**
  - Name: `driver-license-cluster`
  - Region: Closest to you
  - Node Plan: `s-2vcpu-4gb`
  - Node Count: `2`
- **Wait:** 5-10 minutes

### 5. Connect kubectl
```powershell
doctl kubernetes cluster kubeconfig save driver-license-cluster
kubectl get nodes
```

### 6. Deploy Everything
```powershell
# Create namespace
kubectl create namespace driver-license-platform

# Create secrets
kubectl create secret generic app-secrets `
  --from-literal=mongodb-uri="mongodb://mongodb-service:27017/driver-license-platform" `
  --from-literal=jwt-secret="$(openssl rand -base64 32)" `
  -n driver-license-platform

# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Deploy application
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/hpa.yaml
```

### 7. Get Load Balancer IP
```powershell
kubectl get svc driver-license-app-service -n driver-license-platform
# Wait for EXTERNAL-IP (1-2 minutes)
# Visit: http://YOUR-EXTERNAL-IP
```

### 8. Set Up GitHub Actions
1. **Add Secret:** https://github.com/goutham432/Driver_License_App/settings/secrets/actions
   - Name: `DIGITALOCEAN_ACCESS_TOKEN`
   - Value: Your DigitalOcean API token
2. **Push code:** Workflow auto-deploys!

---

## Verify Deployment

```powershell
# Check everything
kubectl get all -n driver-license-platform
kubectl get hpa -n driver-license-platform
kubectl get svc -n driver-license-platform
```

---

## Common Commands

```powershell
# View logs
kubectl logs -f <pod-name> -n driver-license-platform

# Restart deployment
kubectl rollout restart deployment/driver-license-app -n driver-license-platform

# Scale manually
kubectl scale deployment/driver-license-app --replicas=5 -n driver-license-platform

# Port forward to MongoDB
kubectl port-forward -n driver-license-platform svc/mongodb-service 27017:27017
```

---

## Cost Summary

- **Monthly:** $66.20
  - Kubernetes: $48 (2 nodes)
  - Registry: $5
  - Load Balancer: $12
  - Storage: $1.20

---

**For detailed instructions, see:** `Documentation/BEGINNER_PLAYBOOK_DIGITALOCEAN.md`

