# Deployment Quick Reference Card

## 🚀 Quick Commands

### Local Setup
```powershell
# Start backend
npm run dev

# Start frontend (in another terminal)
cd client
npm run dev
```

### Push to GitHub
```powershell
.\GITHUB_PUSH.ps1
# OR manually:
git add .
git commit -m "Your message"
git push -u origin main
```

### Build Docker Image
```powershell
docker build -t goutham432/driver-license-app:latest .
docker push goutham432/driver-license-app:latest
```

### Deploy to Kubernetes
```powershell
# Connect to cluster
doctl kubernetes cluster kubeconfig save driver-license-cluster

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=mongo_uri="YOUR_MONGO_URI" \
  --from-literal=jwt_secret="YOUR_JWT_SECRET" \
  -n driver-license-app

# Deploy
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/hpa.yaml

# Check status
kubectl get pods -n driver-license-app
kubectl get svc -n driver-license-app
```

### Useful Commands
```powershell
# View logs
kubectl logs -f <pod-name> -n driver-license-app

# Check HPA
kubectl get hpa -n driver-license-app

# Scale manually
kubectl scale deployment driver-license-app-deployment --replicas=5 -n driver-license-app

# Delete everything
kubectl delete -f k8s/ -n driver-license-app
```

---

## 📊 Architecture Summary

**Local:** 2 processes (backend + frontend)  
**Production:** 1 Docker container, multiple replicas (2-10 pods)  
**Load Balancer:** DigitalOcean Load Balancer  
**Auto-Scaling:** HPA (70% CPU, 2-10 pods)  
**Database:** MongoDB Atlas (cloud)

---

**Full guide:** See `COMPLETE_SETUP_AND_DEPLOYMENT_GUIDE.md`


