# 🚀 Deployment Guide - Driver License Platform

This guide provides step-by-step instructions for deploying the Driver License Platform in various environments.

## 📋 Prerequisites

### Required Tools
- **Docker** (20.10+)
- **Kubernetes** (1.24+)
- **kubectl** configured with cluster access
- **Git** for source code management
- **Node.js** (18+) for local development

### Cloud Provider Requirements
- **Kubernetes cluster** (EKS, GKE, AKS, or self-managed)
- **Container registry** (Docker Hub, ECR, GCR, ACR)
- **Persistent storage** support
- **Load balancer** support (for ingress)

## 🏗️ Deployment Options

### Option 1: Local Development with Docker Compose

**Best for**: Development, testing, and local demos

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd driver-license-platform

# 2. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 3. Start all services
docker-compose up -d

# 4. Verify deployment
curl http://localhost:5000/health
```

**Access Points**:
- Application: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Kubernetes Production Deployment

**Best for**: Production, staging, and scalable environments

#### Step 1: Prepare Container Image

```bash
# 1. Build the Docker image
docker build -t your-registry/driver-license-platform:v1.0.0 .

# 2. Push to your container registry
docker push your-registry/driver-license-platform:v1.0.0
```

#### Step 2: Configure Kubernetes Manifests

Update the following files with your specific configuration:

**k8s/app-deployment.yaml**:
```yaml
# Update the image reference
image: your-registry/driver-license-platform:v1.0.0
```

**k8s/ingress.yaml**:
```yaml
# Update with your domain
- host: your-domain.com
```

**k8s/mongodb-secret.yaml** and **k8s/app-secret.yaml**:
```bash
# Generate secure secrets
echo -n "your-secure-password" | base64
echo -n "your-jwt-secret-key" | base64
```

#### Step 3: Deploy to Kubernetes

```bash
# 1. Make deployment script executable
chmod +x scripts/deploy.sh

# 2. Run deployment
./scripts/deploy.sh v1.0.0

# 3. Verify deployment
kubectl get pods -n driver-license-platform
kubectl get services -n driver-license-platform
```

#### Step 4: Configure Domain and SSL

```bash
# 1. Update DNS to point to your ingress IP
kubectl get ingress -n driver-license-platform

# 2. Install cert-manager for SSL (if not already installed)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# 3. Create ClusterIssuer for Let's Encrypt
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## 🔧 Configuration Management

### Environment Variables

Create appropriate configuration for each environment:

**Development (.env)**:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/driver-license-platform
JWT_SECRET=dev-secret-key
```

**Production (Kubernetes ConfigMap/Secret)**:
```yaml
# ConfigMap for non-sensitive data
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  PORT: "5000"
  MONGODB_URI: "mongodb://mongo-service:27017/driver-license-platform"

---
# Secret for sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
```

### Database Configuration

**MongoDB Connection Strings**:
- **Local**: `mongodb://localhost:27017/driver-license-platform`
- **Docker Compose**: `mongodb://mongodb:27017/driver-license-platform`
- **Kubernetes**: `mongodb://mongo-service:27017/driver-license-platform`

## 📊 Monitoring and Health Checks

### Health Check Endpoints

```bash
# Application health
curl http://your-domain.com/health

# API functionality
curl http://your-domain.com/api/states
```

### Kubernetes Monitoring

```bash
# Check pod status
kubectl get pods -n driver-license-platform

# View application logs
kubectl logs -f deployment/driver-license-app -n driver-license-platform

# Check HPA status
kubectl get hpa -n driver-license-platform

# Monitor resource usage
kubectl top pods -n driver-license-platform
```

## 🔐 Security Configuration

### SSL/TLS Setup

1. **Automatic with cert-manager** (Recommended):
   ```yaml
   annotations:
     cert-manager.io/cluster-issuer: "letsencrypt-prod"
   ```

2. **Manual certificate**:
   ```bash
   kubectl create secret tls driver-license-tls \
     --cert=path/to/cert.pem \
     --key=path/to/key.pem \
     -n driver-license-platform
   ```

### Security Best Practices

- Use strong, unique passwords for MongoDB
- Generate secure JWT secrets (32+ characters)
- Enable network policies in Kubernetes
- Regular security updates for base images
- Implement proper RBAC in Kubernetes

## 🚀 Scaling Configuration

### Horizontal Pod Autoscaler (HPA)

The application includes HPA configuration:

```yaml
# Current HPA settings
minReplicas: 3
maxReplicas: 10
targetCPUUtilizationPercentage: 70
targetMemoryUtilizationPercentage: 80
```

### Manual Scaling

```bash
# Scale application pods
kubectl scale deployment driver-license-app --replicas=5 -n driver-license-platform

# Scale MongoDB (not recommended for production)
kubectl scale deployment mongodb --replicas=1 -n driver-license-platform
```

## 🔄 Updates and Rollbacks

### Rolling Updates

```bash
# Update to new version
kubectl set image deployment/driver-license-app \
  app=your-registry/driver-license-platform:v1.1.0 \
  -n driver-license-platform

# Check rollout status
kubectl rollout status deployment/driver-license-app -n driver-license-platform
```

### Rollback

```bash
# View rollout history
kubectl rollout history deployment/driver-license-app -n driver-license-platform

# Rollback to previous version
kubectl rollout undo deployment/driver-license-app -n driver-license-platform

# Rollback to specific revision
kubectl rollout undo deployment/driver-license-app --to-revision=2 -n driver-license-platform
```

## 🗄️ Backup and Recovery

### MongoDB Backup

```bash
# Create backup
kubectl exec -it deployment/mongodb -n driver-license-platform -- \
  mongodump --db driver-license-platform --out /tmp/backup

# Copy backup from pod
kubectl cp driver-license-platform/mongodb-pod:/tmp/backup ./backup
```

### Persistent Volume Backup

```bash
# Create volume snapshot (cloud provider specific)
kubectl create -f - <<EOF
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: mongodb-snapshot
  namespace: driver-license-platform
spec:
  source:
    persistentVolumeClaimName: mongodb-pvc
EOF
```

## 🛠️ Troubleshooting

### Common Issues

1. **Pods not starting**:
   ```bash
   kubectl describe pod <pod-name> -n driver-license-platform
   kubectl logs <pod-name> -n driver-license-platform
   ```

2. **Database connection issues**:
   ```bash
   # Check MongoDB service
   kubectl get svc mongo-service -n driver-license-platform
   
   # Test connection from app pod
   kubectl exec -it deployment/driver-license-app -n driver-license-platform -- \
     curl mongo-service:27017
   ```

3. **Ingress not working**:
   ```bash
   # Check ingress controller
   kubectl get pods -n ingress-nginx
   
   # Check ingress configuration
   kubectl describe ingress driver-license-ingress -n driver-license-platform
   ```

### Performance Issues

1. **High CPU usage**:
   - Check HPA scaling
   - Review application logs for errors
   - Consider increasing resource limits

2. **Memory leaks**:
   - Monitor pod memory usage
   - Check for memory leaks in application code
   - Restart pods if necessary

3. **Database performance**:
   - Monitor MongoDB metrics
   - Check for slow queries
   - Consider adding database indexes

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review Kubernetes events: `kubectl get events -n driver-license-platform`
3. Check application logs for error messages
4. Verify all configuration values are correct

## 🎯 Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure automated backups
3. Implement CI/CD pipeline
4. Set up log aggregation
5. Configure performance monitoring