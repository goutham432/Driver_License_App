# 🔧 Fix: Deployment Timeout Error
## "0 of 3 updated replicas are available" - Pods Not Starting

---

## ❌ Error

```
Waiting for deployment "driver-license-app" rollout to finish: 0 of 3 updated replicas are available...
error: timed out waiting for the condition
```

**This means:** The pods are not starting successfully. Common causes:
1. Image pull errors
2. Resource constraints (not enough CPU/memory)
3. Configuration errors
4. Health check failures

---

## ✅ Solutions Applied

### 1. Reduced Replicas (Cost-Optimized)
- **Changed:** 3 replicas → 2 replicas
- **Why:** With 2 nodes (s-1vcpu-2gb), 3 replicas might be too many
- **Benefit:** Better resource distribution, less likely to fail

### 2. Enhanced Workflow Debugging
The workflow now:
- ✅ Checks pod status before waiting
- ✅ Shows pod logs if there are errors
- ✅ Shows pod events for debugging
- ✅ Provides detailed error information

---

## 🔍 How to Debug Manually

If the workflow still fails, check manually:

### Step 1: Check Pod Status
```powershell
# Connect to cluster
doctl kubernetes cluster kubeconfig save driver-license-cluster

# Check pods
kubectl get pods -n driver-license-platform
```

### Step 2: Check Pod Logs
```powershell
# Get pod name
kubectl get pods -n driver-license-platform

# Check logs (replace POD_NAME)
kubectl logs POD_NAME -n driver-license-platform
```

### Step 3: Check Pod Events
```powershell
# Describe pod to see events
kubectl describe pod POD_NAME -n driver-license-platform
```

### Step 4: Check Resource Usage
```powershell
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n driver-license-platform
```

---

## 🎯 Common Issues & Fixes

### Issue 1: Image Pull Error
**Symptoms:** Pod status = `ImagePullBackOff` or `ErrImagePull`

**Fix:**
- Verify image exists in registry:
  ```powershell
  doctl registry repository list-tags driver-license-registry/driver-license-app
  ```
- Check registry authentication in cluster

### Issue 2: Resource Constraints
**Symptoms:** Pod status = `Pending`, events show "Insufficient CPU" or "Insufficient memory"

**Fix:**
- Reduce replicas (already done: 3 → 2)
- Reduce resource requests in deployment
- Use smaller node size (already using s-1vcpu-2gb)

### Issue 3: Health Check Failures
**Symptoms:** Pod starts but fails readiness/liveness probes

**Fix:**
- Check if `/health` endpoint works
- Verify port 5000 is correct
- Check application logs

### Issue 4: MongoDB Connection Issues
**Symptoms:** Pod starts but app can't connect to MongoDB

**Fix:**
- Verify MongoDB is running:
  ```powershell
  kubectl get pods -l app=mongodb -n driver-license-platform
  ```
- Check MongoDB service:
  ```powershell
  kubectl get svc mongodb-service -n driver-license-platform
  ```

---

## 📋 Updated Configuration

### Deployment (k8s/app-deployment.yaml)
- **Replicas:** 2 (reduced from 3)
- **Resources:** 
  - Requests: 200m CPU, 256Mi memory
  - Limits: 1000m CPU, 512Mi memory

### Why 2 Replicas?
- ✅ Matches your 2 nodes (better distribution)
- ✅ Less resource pressure
- ✅ Still provides redundancy
- ✅ Cost-optimized

---

## ⚠️ Load Balancer Warning (Not an Error)

The warning you see:
> "Load balancers and volumes should only be managed through kubectl"

**This is just informational!** It's telling you:
- ✅ Load balancer was created correctly
- ⚠️ Don't modify it in the UI (use kubectl instead)
- ✅ Your setup is correct

**You can ignore this warning** - it's not causing any issues.

---

## ✅ Next Steps

1. **Re-run the workflow** - It should work now with 2 replicas
2. **If it still fails:**
   - Check the pod logs in the workflow output
   - Follow the manual debugging steps above
   - Share the pod logs/events for further help

---

## 📊 Expected Pod Status

After successful deployment, you should see:
```
NAME                                  READY   STATUS    RESTARTS   AGE
driver-license-app-xxxxx-xxxxx       1/1     Running   0          2m
driver-license-app-xxxxx-xxxxx       1/1     Running   0          2m
mongodb-xxxxx                         1/1     Running   0          5m
```

**2 app pods + 1 MongoDB pod = 3 total pods**

---

**The deployment has been updated to use 2 replicas. Re-run the workflow!** 🚀

