# 🚀 Create DigitalOcean Kubernetes (DOKS) Cluster
## Fix: "no cluster goes by the name driver-license-cluster" Error

---

## ❌ Error

```
Error: no cluster goes by the name "driver-license-cluster"
```

**This means:** The Kubernetes cluster doesn't exist yet!

---

## ✅ Solution: Create DOKS Cluster

### Option 1: Create via Web UI (Easiest - Recommended)

1. **Go to:** https://cloud.digitalocean.com/kubernetes/clusters
2. **Click:** "Create Kubernetes Cluster"
3. **Settings:**
   - **Cluster name:** `driver-license-cluster`
   - **Region:** Choose closest to you (e.g., NYC1, SFO3, AMS3)
   - **Kubernetes version:** Latest stable (default)
   - **Node pool:**
     - **Name:** `driver-license-pool`
     - **Node plan:** `s-1vcpu-2gb` ($12/month per node) ⚠️ **Cost-optimized for $25 credit**
     - **Node count:** `2` ✅ **Two nodes for high availability**
   - **Add tags (optional):** `driver-license`, `production`
4. **Click:** "Create Cluster"
5. **Wait:** 5-10 minutes for cluster to be created

**Cost:** $24/month (2 nodes × $12/month)

**Note:** Using 2 nodes provides high availability (production-ready) while staying within budget by using smaller node size.

### Option 2: Create via doctl (Command Line)

```powershell
# Authenticate first
doctl auth init
# Enter your token when prompted

# Create cluster (cost-optimized: 2 nodes for HA, smallest size)
doctl kubernetes cluster create driver-license-cluster `
  --region nyc1 `
  --node-pool "name=driver-license-pool;size=s-1vcpu-2gb;count=2" `
  --version latest
```

**Note:** Replace `nyc1` with your preferred region.

---

## ✅ Verify Cluster is Created

1. **Check in Web UI:**
   - Go to: https://cloud.digitalocean.com/kubernetes/clusters
   - You should see `driver-license-cluster` listed
   - Status should be "Running"

2. **Or check via command:**
   ```powershell
   doctl kubernetes cluster list
   ```

---

## 🔄 After Creating Cluster

1. **Re-run GitHub Actions workflow:**
   - Go to: https://github.com/goutham432/Driver_License_App/actions
   - Click on failed workflow
   - Click "Re-run all jobs"

2. **The workflow should now work!**

---

## 📋 Complete Setup Checklist

Before running the workflow, ensure:

- [ ] **Container Registry created:** `driver-license-registry`
- [ ] **Kubernetes Cluster created:** `driver-license-cluster`
- [ ] **GitHub Secret set:** `DIGITALOCEAN_ACCESS_TOKEN`
- [ ] **Cluster is running** (not provisioning)

---

## 💰 Cost Breakdown

| Resource | Cost/Month |
|----------|------------|
| Container Registry (Basic) | $5 |
| Kubernetes Nodes (2x s-1vcpu-2gb) | $24 |
| Load Balancer | $12 |
| MongoDB Storage (10GB) | $1.20 |
| **Total** | **~$42.20** |

**Note:** This is the cost-optimized configuration with high availability. Using smaller node size (s-1vcpu-2gb) saves $24/month vs s-2vcpu-4gb while maintaining 2 nodes for HA.

---

## 🎯 Quick Steps Summary

1. **Create Container Registry:**
   - https://cloud.digitalocean.com/registry
   - Name: `driver-license-registry`
   - Plan: Basic

2. **Create Kubernetes Cluster:**
   - https://cloud.digitalocean.com/kubernetes/clusters
   - Name: `driver-license-cluster`
   - Nodes: 2x s-1vcpu-2gb (cost-optimized with high availability)

3. **Set GitHub Secret:**
   - https://github.com/goutham432/Driver_License_App/settings/secrets/actions
   - Name: `DIGITALOCEAN_ACCESS_TOKEN`
   - Value: Your DigitalOcean API token

4. **Re-run Workflow:**
   - https://github.com/goutham432/Driver_License_App/actions

---

**Once the cluster is created, the workflow will work!** ✅

