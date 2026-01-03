# 🌐 How to Get Load Balancer IP Address
## Multiple Methods to Find Your Application URL

---

## 🚀 Method 1: PowerShell Script (Easiest)

### Step 1: Run the Script

```powershell
.\GET_LOAD_BALANCER_IP.ps1
```

**What it does:**
- ✅ Connects to your Kubernetes cluster
- ✅ Gets the Load Balancer IP automatically
- ✅ Shows you the application URL
- ✅ Checks pod status

**Output:**
```
✅ Load Balancer IP Found!

Your Application URL:
  http://157.230.123.45
```

---

## 🔧 Method 2: Command Line (Manual)

### Step 1: Connect to Cluster

```powershell
# Authenticate with DigitalOcean (if not done)
doctl auth init
# Enter your token when prompted (get from: https://cloud.digitalocean.com/account/api/tokens)

# Connect to cluster
doctl kubernetes cluster kubeconfig save driver-license-cluster
```

### Step 2: Get Load Balancer IP

```powershell
# Get just the IP address
kubectl get svc driver-license-app-service -n driver-license-platform -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

**Output:** Just the IP (e.g., `157.230.123.45`)

### Step 3: Get Full Service Details

```powershell
# Get full service information
kubectl get svc driver-license-app-service -n driver-license-platform
```

**Output:**
```
NAME                        TYPE           EXTERNAL-IP      PORT(S)        AGE
driver-license-app-service  LoadBalancer   157.230.123.45   80:31234/TCP   15m
```

**Your IP is in the EXTERNAL-IP column!**

---

## 🌐 Method 3: DigitalOcean Web UI

### Option A: Via Kubernetes Cluster Page

1. **Go to:** https://cloud.digitalocean.com/kubernetes/clusters
2. **Click on:** `driver-license-cluster`
3. **Look for:** "Services" section (might be in Overview or Resources tab)
4. **Find:** `driver-license-app-service`
5. **Click on it** to see details
6. **Look for:** "External IP" or "Load Balancer IP"

### Option B: Via Networking → Load Balancers

1. **Go to:** https://cloud.digitalocean.com/networking/load_balancers
2. **Find:** Load balancer created by Kubernetes (name might be auto-generated)
3. **Click on it**
4. **Look for:** IP address

### Option C: Via Cluster Overview

1. **Go to:** https://cloud.digitalocean.com/kubernetes/clusters
2. **Click on:** `driver-license-cluster`
3. **In the Overview tab**, scroll down
4. **Look for:** "Services" or "Resources" section
5. **Find:** Service with type "LoadBalancer"

---

## 📋 Step-by-Step: DigitalOcean UI (Detailed)

### If You Can't Find Services Tab

**The Services tab might be in a different location:**

1. **Go to:** https://cloud.digitalocean.com/kubernetes/clusters
2. **Click:** `driver-license-cluster`
3. **Look for these tabs/sections:**
   - **Overview** (might show services here)
   - **Resources** (services might be here)
   - **Services** (if visible)
   - **Workloads** (services might be here)

4. **Alternative:** Look for "View in Control Panel" or "Manage" button
5. **Or:** Use the search bar in DigitalOcean dashboard and search for "driver-license-app-service"

### Quick Alternative: Check Load Balancers Directly

1. **Go to:** https://cloud.digitalocean.com/networking/load_balancers
2. **You should see:** A load balancer (might have an auto-generated name)
3. **Click on it**
4. **The IP address** is shown at the top

---

## ✅ Verify Everything is Working

### Check Pods Are Running

```powershell
kubectl get pods -n driver-license-platform
```

**Should show:**
```
NAME                                  READY   STATUS    RESTARTS   AGE
driver-license-app-xxxxx-xxxxx        1/1     Running   0          5m
driver-license-app-xxxxx-xxxxx        1/1     Running   0          5m
mongodb-xxxxx                         1/1     Running   0          10m
```

### Check Service Status

```powershell
kubectl get svc -n driver-license-platform
```

**Should show:**
```
NAME                        TYPE           EXTERNAL-IP      PORT(S)
driver-license-app-service  LoadBalancer   157.230.123.45    80:31234/TCP
mongodb-service             ClusterIP      <none>           27017/TCP
```

**If EXTERNAL-IP shows `<pending>`:**
- Wait 2-3 minutes (Load Balancer is being created)
- Run the command again

---

## 🎯 Quick Command Reference

### One-Liner to Get IP

```powershell
doctl kubernetes cluster kubeconfig save driver-license-cluster; kubectl get svc driver-license-app-service -n driver-license-platform -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

**This will:**
1. Connect to cluster
2. Output just the IP address

### One-Liner to Open in Browser (Windows)

```powershell
$ip = kubectl get svc driver-license-app-service -n driver-license-platform -o jsonpath='{.status.loadBalancer.ingress[0].ip}'; Start-Process "http://$ip"
```

**This will:**
1. Get the IP
2. Open it in your default browser automatically!

---

## 🔍 Troubleshooting

### "Cluster not found"

**Solution:**
```powershell
# List all clusters
doctl kubernetes cluster list

# If cluster exists with different name, use that name
doctl kubernetes cluster kubeconfig save YOUR-CLUSTER-NAME
```

### "Service not found"

**Solution:**
```powershell
# List all services
kubectl get svc -n driver-license-platform

# Check if namespace exists
kubectl get namespace driver-license-platform
```

### "EXTERNAL-IP is <pending>"

**This is normal!** Load Balancer takes 2-5 minutes to provision.

**Solution:**
- Wait 2-3 minutes
- Run the command again
- Check DigitalOcean dashboard for Load Balancer status

---

## 📝 Summary

**Easiest Method:**
1. Run: `.\GET_LOAD_BALANCER_IP.ps1`
2. Copy the URL shown
3. Open in browser

**Manual Method:**
1. Connect: `doctl kubernetes cluster kubeconfig save driver-license-cluster`
2. Get IP: `kubectl get svc driver-license-app-service -n driver-license-platform`
3. Look for EXTERNAL-IP column
4. Open `http://YOUR_IP` in browser

---

**Once you have the IP, open it in your browser to access the application!** 🚀

