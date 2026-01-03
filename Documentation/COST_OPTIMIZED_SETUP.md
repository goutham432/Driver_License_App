# 💰 Cost-Optimized Setup for $25 Credit
## Minimal Cost Configuration for DigitalOcean TAM Assessment

---

## 🎯 Budget Constraint

- **Credit Available:** $25
- **Target:** Keep total cost under $30-50/month
- **Solution:** Use smallest viable configuration

---

## 💵 Cost Breakdown (Optimized)

| Resource | Configuration | Cost/Month |
|----------|---------------|------------|
| Container Registry | Basic Plan | $5.00 |
| Kubernetes Node | 1x s-1vcpu-2gb | $12.00 |
| Load Balancer | Standard | $12.00 |
| MongoDB Storage | 10GB | $1.20 |
| **Total Monthly Cost** | | **$30.20** |

**With $25 credit:** You'll have ~$5.20 remaining, which covers about 5 days of operation.

**Note:** For the assessment, this is sufficient. After the assessment, you can delete resources to avoid charges.

---

## ✅ Will 1 vCPU / 2GB RAM Work?

**Yes!** For the TAM assessment, this configuration is sufficient:

- ✅ **Application runs fine** - Node.js/React app doesn't need much
- ✅ **MongoDB works** - Small database for demo data
- ✅ **Load Balancer works** - Single node is fine for demo
- ⚠️ **No High Availability** - Single node means if it fails, app goes down
- ⚠️ **Limited Scaling** - Can't handle high traffic, but fine for demo

**For Interview/Demo:** This is perfect! You're demonstrating Kubernetes concepts, not running production traffic.

---

## 🚀 Step-by-Step Cost-Optimized Setup

### Step 1: Create Container Registry ($5/month)

1. **Go to:** https://cloud.digitalocean.com/registry
2. **Click:** "Create Registry"
3. **Settings:**
   - **Registry name:** `driver-license-registry`
   - **Subscription plan:** Basic ($5/month) - **cheapest option**
   - **Region:** Choose closest to you
4. **Click:** "Create Registry"

**Cost:** $5/month

---

### Step 2: Create Kubernetes Cluster ($12/month)

1. **Go to:** https://cloud.digitalocean.com/kubernetes/clusters
2. **Click:** "Create Kubernetes Cluster"
3. **Settings:**
   - **Cluster name:** `driver-license-cluster`
   - **Region:** Choose closest to you
   - **Kubernetes version:** Latest stable (default)
   - **Node pool:**
     - **Name:** `driver-license-pool` (or leave default)
     - **Node plan:** `s-1vcpu-2gb` ⚠️ **Smallest option** ($12/month)
     - **Node count:** `1` ⚠️ **Single node** (not 2!)
4. **Click:** "Create Cluster"
5. **Wait:** 5-10 minutes for cluster to be created

**Cost:** $12/month

**Why 1 node?**
- Saves $12/month (half the cost)
- Sufficient for assessment/demo
- No high availability, but that's fine for interview

---

### Step 3: Set GitHub Secret

1. **Go to:** https://github.com/goutham432/Driver_License_App/settings/secrets/actions
2. **Add Secret:**
   - **Name:** `DIGITALOCEAN_ACCESS_TOKEN`
   - **Value:** Your DigitalOcean API token
3. **Click:** "Add secret"

**Cost:** Free

---

### Step 4: Run GitHub Actions Workflow

1. **Go to:** https://github.com/goutham432/Driver_License_App/actions
2. **Click:** "Deploy to DigitalOcean Kubernetes"
3. **Click:** "Run workflow"
4. **Wait:** 5-10 minutes for deployment

**Cost:** Free (uses existing resources)

---

## 📊 Total Monthly Cost

```
Container Registry:     $5.00
Kubernetes Node (1x):   $12.00
Load Balancer:          $12.00
MongoDB Storage:        $1.20
─────────────────────────────
Total:                  $30.20/month
```

**With $25 credit:** You can run for about **25 days** before needing to add payment method.

---

## ⚠️ Important Notes

### 1. **Single Node Limitation**
- No high availability (if node fails, app goes down)
- Fine for assessment/demo, not for production

### 2. **Resource Limits**
- 1 vCPU / 2GB RAM is minimal
- App will work, but won't handle high traffic
- Perfect for interview demonstration

### 3. **After Assessment**
- **Delete resources** to avoid charges:
  - Delete Kubernetes cluster
  - Delete Container Registry
  - Delete Load Balancer (if separate)
- Or keep running if you want to continue using it

---

## 🔄 Cost Optimization Tips

### Option 1: Use Spot Instances (Future)
- **Savings:** 50% off
- **Risk:** Can be terminated with 30-second notice
- **Best For:** Non-critical workloads

### Option 2: Scale Down When Not Using
- Delete cluster when not needed
- Recreate when needed (takes 5-10 minutes)
- **Savings:** Only pay when using

### Option 3: Use App Platform Instead
- **Cost:** $5/month (much cheaper!)
- **Trade-off:** Not Kubernetes (doesn't meet assessment requirement)
- **Best For:** After assessment, if you want to keep it running

---

## ✅ Verification Checklist

Before running workflow:

- [ ] Container Registry created: `driver-license-registry` ($5/month)
- [ ] Kubernetes Cluster created: `driver-license-cluster` (1x s-1vcpu-2gb, $12/month)
- [ ] GitHub Secret set: `DIGITALOCEAN_ACCESS_TOKEN`
- [ ] Cluster status: "Running" (not "Provisioning")
- [ ] Total cost: ~$30.20/month ✅

---

## 🎯 Quick Command Reference

### Create Cluster via doctl (Cost-Optimized)

```powershell
doctl kubernetes cluster create driver-license-cluster `
  --region nyc1 `
  --node-pool "name=driver-license-pool;size=s-1vcpu-2gb;count=1" `
  --version latest
```

**Key differences:**
- `size=s-1vcpu-2gb` (not s-2vcpu-4gb)
- `count=1` (not 2)

---

## 📋 Summary

**For $25 credit:**
- ✅ Use smallest node size: `s-1vcpu-2gb`
- ✅ Use single node: `count=1`
- ✅ Total cost: **$30.20/month**
- ✅ Will work perfectly for assessment/demo
- ✅ Credit covers ~25 days of operation

**This configuration is perfect for your TAM assessment!** 🚀

