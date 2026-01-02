# Deployment Guide

Complete guide for deploying the Driver License Platform to production.

## Prerequisites

- DigitalOcean account
- Docker installed
- kubectl installed
- doctl (DigitalOcean CLI) installed

## Step 1: Build and Push Docker Image

1. **Build the Docker image:**
   ```bash
   docker build -t registry.digitalocean.com/your-registry/driver-license-platform:latest .
   ```

2. **Authenticate with DigitalOcean:**
   ```bash
   doctl registry login
   ```

3. **Push the image:**
   ```bash
   docker push registry.digitalocean.com/your-registry/driver-license-platform:latest
   ```

## Step 2: Create Kubernetes Cluster

1. Go to DigitalOcean → Kubernetes → Create Cluster
2. Choose:
   - Region: Closest to you
   - Node Pool: Basic (2 vCPU, 4GB RAM) - 2 nodes
   - Kubernetes Version: Latest stable
3. Wait for cluster creation (5-10 minutes)

## Step 3: Connect to Cluster

1. Download kubeconfig from DigitalOcean dashboard
2. Set KUBECONFIG environment variable:
   ```bash
   export KUBECONFIG=/path/to/kubeconfig.yaml
   ```

3. Verify connection:
   ```bash
   kubectl get nodes
   ```

## Step 4: Update Kubernetes Manifests

1. Update `k8s/app-deployment.yaml`:
   - Replace `your-registry` with your actual registry
   - Update image name

2. Update `k8s/app-deployment.yaml` environment variables:
   - Set MONGODB_URI (use MongoDB Atlas or internal service)
   - Set JWT_SECRET
   - Set CLIENT_URL

## Step 5: Deploy to Kubernetes

1. **Create namespace:**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

2. **Create secrets:**
   ```bash
   kubectl create secret generic app-secrets \
     --from-literal=mongodb-uri='your-mongodb-uri' \
     --from-literal=jwt-secret='your-jwt-secret' \
     --namespace=driver-license-platform
   ```

3. **Deploy MongoDB:**
   ```bash
   kubectl apply -f k8s/mongodb-deployment.yaml
   ```

4. **Deploy application:**
   ```bash
   kubectl apply -f k8s/app-deployment.yaml
   kubectl apply -f k8s/app-service.yaml
   kubectl apply -f k8s/hpa.yaml
   ```

5. **Deploy ingress (optional):**
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

## Step 6: Verify Deployment

1. **Check pods:**
   ```bash
   kubectl get pods -n driver-license-platform
   ```

2. **Check services:**
   ```bash
   kubectl get services -n driver-license-platform
   ```

3. **Get external IP:**
   ```bash
   kubectl get service driver-license-app-service -n driver-license-platform
   ```

4. **Check HPA:**
   ```bash
   kubectl get hpa -n driver-license-platform
   ```

## Step 7: Initialize Sample Data

1. **Port forward to MongoDB:**
   ```bash
   kubectl port-forward -n driver-license-platform svc/mongodb-service 27017:27017
   ```

2. **Run init script:**
   ```bash
   node scripts/init-sample-data.js
   ```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n driver-license-platform
kubectl logs <pod-name> -n driver-license-platform
```

### Image pull errors
- Verify image is pushed to registry
- Check image name in deployment.yaml
- Verify registry authentication

### MongoDB connection issues
- Check MongoDB service is running
- Verify MONGODB_URI in secrets
- Check network policies

## Cost Optimization

- Use smaller node sizes for development
- Scale down when not in use
- Use MongoDB Atlas instead of self-hosted MongoDB
- Monitor resource usage with `kubectl top pods`

---

For more details, see the main README.md


