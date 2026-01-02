# 🚀 Complete Beginner's Guide: Deploy to DigitalOcean Kubernetes (DOKS)
## Step-by-Step Guide with "Why" and "How" for Everything

**For:** DigitalOcean TAM Assessment  
**Target:** Complete beginner to Kubernetes and DigitalOcean  
**Goal:** Deploy scalable, reliable, highly available application on DOKS with Load Balancer and HPA

---

## 📋 Table of Contents

1. [Understanding What We're Building](#understanding-what-were-building)
2. [Prerequisites & Account Setup](#prerequisites--account-setup)
3. [Part 1: Push Code to GitHub](#part-1-push-code-to-github)
4. [Part 2: Set Up DigitalOcean Account](#part-2-set-up-digitalocean-account)
5. [Part 3: Build and Push Docker Image](#part-3-build-and-push-docker-image)
6. [Part 4: Create DOKS Cluster](#part-4-create-doks-cluster)
7. [Part 5: Deploy MongoDB on DOKS](#part-5-deploy-mongodb-on-doks)
8. [Part 6: Deploy Application](#part-6-deploy-application)
9. [Part 7: Configure Load Balancer](#part-7-configure-load-balancer)
10. [Part 8: Set Up Horizontal Pod Autoscaler (HPA)](#part-8-set-up-horizontal-pod-autoscaler-hpa)
11. [Part 9: Verify Everything Works](#part-9-verify-everything-works)
12. [Part 10: Cost Analysis](#part-10-cost-analysis)
13. [Troubleshooting Guide](#troubleshooting-guide)

---

## Understanding What We're Building

### 🎯 What is This Project?

**In Simple Terms:**
You're building a Driver License Platform that helps people:
- Take practice tests for their driver's license
- Book appointments at DMV offices
- Track their test scores

**For the Interview:**
You need to deploy this application on **DigitalOcean Kubernetes (DOKS)** using:
- **Docker:** Package your app into a container
- **Kubernetes:** Run multiple copies of your app automatically
- **Load Balancer:** Distribute traffic evenly (DigitalOcean Load Balancer)
- **HPA (Horizontal Pod Autoscaler):** Automatically add more servers when busy
- **GitHub:** Store your code and Kubernetes manifests

### 🏗️ Architecture Overview

```
GitHub (Your Code + Kubernetes Manifests)
    │
    │ (Push code)
    ▼
DigitalOcean Container Registry
    │
    │ (Pull Image)
    ▼
DigitalOcean Kubernetes Cluster (DOKS)
    │
    ├── DigitalOcean Load Balancer (Public IP)
    │       │
    │       ▼
    ├── Application Pods (2-10 copies, auto-scaled by HPA)
    │       │
    │       ▼
    └── MongoDB Pod (Database with persistent storage)
```

**Why This Architecture?**
- **Scalable:** Can handle 1 user or 10,000 users (HPA scales automatically)
- **Reliable:** If one server breaks, others keep running
- **Cost-Effective:** Only pay for what you use
- **Meets Assessment Requirements:** DOKS, Load Balancer, HPA

---

## Prerequisites & Account Setup

### What You Need Before Starting

#### 1. **GitHub Account** ✅
- **Why:** To store your code and Kubernetes manifests
- **Status:** Already have account `goutham432`
- **Action:** Code is already pushed!

#### 2. **DigitalOcean Account** ✅
- **Why:** To host your Kubernetes cluster
- **Status:** You already have this!
- **Action:** Ready to use

#### 3. **Local Tools** (Install on Your Computer)

**a) Git** (Version Control)
- **Why:** To push code to GitHub
- **Check:** `git --version`
- **If not installed:** Download from https://git-scm.com/download/win

**b) Docker Desktop** (Container Tool)
- **Why:** To build and test Docker images locally
- **Check:** `docker --version`
- **If not installed:** Download from https://www.docker.com/products/docker-desktop
- **Important:** Start Docker Desktop after installation!

**c) kubectl** (Kubernetes Command Tool)
- **Why:** To manage your Kubernetes cluster
- **Check:** `kubectl version --client`
- **If not installed:** 
  ```powershell
  # Download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
  # Or use Chocolatey:
  choco install kubernetes-cli
  ```

**d) doctl** (DigitalOcean CLI)
- **Why:** To manage DigitalOcean resources from command line
- **Check:** `doctl version`
- **If not installed:**
  ```powershell
  # Download from: https://docs.digitalocean.com/reference/doctl/how-to/install/
  # Or use Chocolatey:
  choco install doctl
  ```

---

## Part 1: Push Code to GitHub

### Step 1.1: Verify Code is Pushed

**Why:** Make sure your code and Kubernetes manifests are on GitHub.

**How:**

1. **Check GitHub:**
   - Go to: https://github.com/goutham432/Driver_License_App
   - Verify you see:
     - ✅ `Dockerfile`
     - ✅ `k8s/` folder with YAML files
     - ✅ `server.js`, `package.json`, etc.

2. **If code is not pushed:**
   ```powershell
   git add .
   git commit -m "Add Kubernetes manifests for DOKS deployment"
   git push origin main
   ```

**✅ Checkpoint:** Code is on GitHub!

---

## Part 2: Set Up DigitalOcean Account

### Step 2.1: Generate DigitalOcean API Token

**Why:** `doctl` (DigitalOcean CLI) needs this to manage your resources.

**How:**

1. **Go to:** https://cloud.digitalocean.com/account/api/tokens
2. **Click:** "Generate New Token"
3. **Settings:**
   - **Token name:** `DOKS-Deployment-Token`
   - **Expiration:** No expiration (or 90 days)
4. **Click:** "Generate Token"
5. **IMPORTANT:** Copy the token! It looks like: `dop_v1_xxxxxxxxxxxxxxxxxxxx`
   - Save it in a text file temporarily

### Step 2.2: Authenticate doctl

**Why:** This connects your computer to your DigitalOcean account.

**How:**

1. **Open PowerShell:**
   ```powershell
   doctl auth init
   ```

2. **Enter your API token** (the one you just copied)

3. **Verify it works:**
   ```powershell
   doctl account get
   ```
   - You should see your account information!

**✅ Checkpoint:** DigitalOcean account is set up!

---

## Part 3: Build and Push Docker Image

### Step 3.1: Create DigitalOcean Container Registry

**Why:** This is where Docker images are stored. Kubernetes needs this to pull your application.

**How:**

1. **Go to:** https://cloud.digitalocean.com/registry
2. **Click:** "Create Registry"
3. **Settings:**
   - **Registry name:** `driver-license-registry`
   - **Subscription plan:** Basic ($5/month) - cheapest option
   - **Region:** Choose closest to you (e.g., NYC1, SFO3)
4. **Click:** "Create Registry"
5. **Wait:** 1-2 minutes for registry to be created

### Step 3.2: Authenticate Docker with DigitalOcean Registry

**Why:** Docker needs permission to push images to DigitalOcean.

**How:**

1. **Open PowerShell:**
   ```powershell
   doctl registry login
   ```
   - This automatically configures Docker to use DigitalOcean registry

2. **Verify:**
   ```powershell
   docker login registry.digitalocean.com
   ```
   - Should say "Login Succeeded"

### Step 3.3: Build the Docker Image

**Why:** Create the package that will run on Kubernetes.

**How:**

1. **Navigate to project folder:**
   ```powershell
   cd "C:\Users\Goutham\Desktop\Goutham Folder\Cursor project"
   ```

2. **Build the image:**
   ```powershell
   docker build -t registry.digitalocean.com/driver-license-registry/driver-license-app:latest .
   ```
   
   **Breaking down the command:**
   - `docker build`: Build a Docker image
   - `-t`: Tag (name) the image
   - `registry.digitalocean.com/driver-license-registry/driver-license-app:latest`: Full image name
   - `.`: Current directory (where Dockerfile is)

3. **Wait:** This takes 3-5 minutes. You'll see:
   - Installing dependencies
   - Building React frontend
   - Creating final image

4. **Verify build:**
   ```powershell
   docker images
   ```
   - You should see `driver-license-app` in the list

### Step 3.4: Push Image to DigitalOcean Registry

**Why:** Kubernetes needs to download this image to run your app.

**How:**

1. **Push the image:**
   ```powershell
   docker push registry.digitalocean.com/driver-license-registry/driver-license-app:latest
   ```

2. **Wait:** 2-3 minutes (uploading image)

3. **Verify:**
   - Go to: https://cloud.digitalocean.com/registry
   - Click on your registry
   - You should see `driver-license-app:latest` in the list!

**✅ Checkpoint:** Docker image is in DigitalOcean!

---

## Part 4: Create DOKS Cluster

### Step 4.1: Understand Kubernetes

**Why Kubernetes?**
- **Kubernetes (K8s):** Manages containers automatically
- **Like:** A smart manager that:
  - Runs multiple copies of your app
  - Restarts failed containers
  - Distributes traffic evenly
  - Scales up/down automatically

**Key Concepts:**
- **Cluster:** A group of servers (nodes) that run your containers
- **Node:** A single server in the cluster
- **Pod:** A running container (or group of containers)
- **Deployment:** Manages multiple pods (replicas)
- **Service:** Provides a stable IP/URL to access pods
- **Load Balancer:** Distributes traffic from internet to pods
- **HPA:** Automatically scales pods based on CPU/memory

### Step 4.2: Create DOKS Cluster via Web UI

**Why:** Easier for beginners. You can also use `doctl` command line.

**How:**

1. **Go to:** https://cloud.digitalocean.com/kubernetes/clusters
2. **Click:** "Create Kubernetes Cluster"
3. **Cluster Settings:**
   - **Datacenter Region:** Choose closest to you
     - **NYC1** (New York)
     - **SFO3** (San Francisco)
     - **AMS3** (Amsterdam)
   - **Kubernetes Version:** Latest stable (e.g., 1.28.2-do.0)
   - **Cluster Name:** `driver-license-cluster`

4. **Node Pool Settings:**
   - **Node Plan:** 
     - **Basic:** `s-2vcpu-4gb` ($24/month per node) - **Recommended for assessment**
     - **Professional:** More expensive, better performance
   - **Node Count:** `2` (minimum for high availability)
     - **Why 2?** If one node fails, the other keeps running
   - **Auto-scaling:** Leave unchecked (we'll use HPA instead)

5. **Additional Settings:**
   - **Enable Monitoring:** ✅ Check this (free, helps with debugging)
   - **Enable Logs:** ✅ Check this (free, helps with debugging)

6. **Click:** "Create Cluster"
7. **Wait:** 5-10 minutes for cluster to be created
   - You'll see progress: "Provisioning" → "Running"

### Step 4.3: Connect kubectl to Your Cluster

**Why:** `kubectl` needs to know which cluster to manage.

**How:**

1. **Get cluster credentials:**
   ```powershell
   doctl kubernetes cluster kubeconfig save driver-license-cluster
   ```

2. **Verify connection:**
   ```powershell
   kubectl get nodes
   ```
   - You should see 2 nodes listed!
   - Example output:
     ```
     NAME                    STATUS   ROLES    AGE   VERSION
     driver-license-cluster-xxxxx   Ready    <none>   5m    v1.28.2
     driver-license-cluster-yyyyy   Ready    <none>   5m    v1.28.2
     ```

**✅ Checkpoint:** Kubernetes cluster is ready!

---

## Part 5: Deploy MongoDB on DOKS

### Step 5.1: Understand MongoDB Deployment

**Why Deploy MongoDB on DOKS?**
- **Requirement:** Assessment asks for MongoDB on DigitalOcean
- **Benefit:** Full control, no external dependencies
- **Storage:** Uses PersistentVolume (data survives pod restarts)

**Architecture:**
- **MongoDB Pod:** Runs MongoDB container
- **PersistentVolumeClaim:** 10GB storage for database data
- **Service:** Internal access (only from within cluster)

### Step 5.2: Create Namespace

**Why:** Organizes resources. Keeps your app separate from other apps.

**How:**

1. **Check if namespace exists:**
   ```powershell
   kubectl get namespace driver-license-platform
   ```

2. **If it doesn't exist, create it:**
   ```powershell
   kubectl create namespace driver-license-platform
   ```

3. **Verify:**
   ```powershell
   kubectl get namespaces
   ```
   - Should see `driver-license-platform`

### Step 5.3: Deploy MongoDB

**Why:** Your application needs a database to store data.

**How:**

1. **Navigate to project folder:**
   ```powershell
   cd "C:\Users\Goutham\Desktop\Goutham Folder\Cursor project"
   ```

2. **Deploy MongoDB:**
   ```powershell
   kubectl apply -f k8s/mongodb-deployment.yaml
   ```

3. **Wait for MongoDB to start:**
   ```powershell
   kubectl get pods -n driver-license-platform -w
   ```
   - Watch until you see `mongodb-xxxxx` status change to `Running`
   - Press `Ctrl+C` to stop watching

4. **Verify MongoDB is running:**
   ```powershell
   kubectl get pods -n driver-license-platform
   kubectl get svc -n driver-license-platform
   ```
   - Should see `mongodb` pod and `mongodb-service` service

### Step 5.4: Get MongoDB Connection String

**Why:** Your application needs to know how to connect to MongoDB.

**How:**

1. **MongoDB Service Name:** `mongodb-service`
2. **Connection String:**
   ```
   mongodb://mongodb-service:27017/driver-license-platform
   ```
   - **Why this format?**
     - `mongodb://`: MongoDB protocol
     - `mongodb-service`: Service name (Kubernetes DNS resolves this)
     - `27017`: MongoDB port
     - `driver-license-platform`: Database name

3. **Save this connection string** - you'll need it in the next step!

**✅ Checkpoint:** MongoDB is running on DOKS!

---

## Part 6: Deploy Application

### Step 6.1: Update Deployment File

**Why:** Point the deployment to your Docker image in DigitalOcean registry.

**How:**

1. **Open:** `k8s/app-deployment.yaml`

2. **Verify the image line (around line 20):**
   ```yaml
   image: registry.digitalocean.com/driver-license-registry/driver-license-app:latest
   ```
   - Should already be correct if you followed Part 3

3. **Save the file**

### Step 6.2: Create Kubernetes Secrets

**Why:** Store sensitive information (MongoDB password, JWT secret) securely.

**How:**

1. **Generate a strong JWT secret:**
   ```powershell
   # In PowerShell, generate random string:
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   - Copy the output (e.g., `aB3xK9mP2qR7sT4vW8yZ1cD5fG6hJ0`)

2. **Create secret:**
   ```powershell
   kubectl create secret generic app-secrets `
     --from-literal=mongodb-uri="mongodb://mongodb-service:27017/driver-license-platform" `
     --from-literal=jwt-secret="YOUR_JWT_SECRET_HERE" `
     -n driver-license-platform
   ```
   - Replace `YOUR_JWT_SECRET_HERE` with the random string from step 1

3. **Verify:**
   ```powershell
   kubectl get secrets -n driver-license-platform
   ```
   - Should see `app-secrets`

### Step 6.3: Deploy Application

**Why:** Get your application running on Kubernetes.

**How:**

1. **Deploy application:**
   ```powershell
   kubectl apply -f k8s/app-deployment.yaml
   ```

2. **Wait for pods to start:**
   ```powershell
   kubectl get pods -n driver-license-platform -w
   ```
   - Watch until all pods show `Running` status
   - Press `Ctrl+C` to stop watching

3. **Verify deployment:**
   ```powershell
   kubectl get deployment -n driver-license-platform
   kubectl get pods -n driver-license-platform
   ```
   - Should see `driver-license-app` deployment with 3 pods

### Step 6.4: Check Application Logs

**Why:** Make sure the application started correctly.

**How:**

1. **Get pod name:**
   ```powershell
   kubectl get pods -n driver-license-platform
   ```

2. **View logs:**
   ```powershell
   kubectl logs <pod-name> -n driver-license-platform
   ```
   - Replace `<pod-name>` with actual pod name (e.g., `driver-license-app-xxxxx`)

3. **Look for:**
   - ✅ "Server running on port 5000"
   - ✅ "MongoDB Connected"
   - ❌ Any error messages

**✅ Checkpoint:** Application is deployed!

---

## Part 7: Configure Load Balancer

### Step 7.1: Understand Load Balancer

**Why Load Balancer?**
- **Problem:** Your app runs on multiple pods (internal IPs)
- **Solution:** Load Balancer provides ONE public IP that distributes traffic
- **Benefit:** Users access your app via one URL, traffic goes to all pods
- **Requirement:** Assessment explicitly asks for "DigitalOcean Load Balancer"

**How It Works:**
```
Internet → DigitalOcean Load Balancer (Public IP) → Pod 1, Pod 2, Pod 3
```

### Step 7.2: Deploy Load Balancer Service

**Why:** Create the Load Balancer that exposes your app to the internet.

**How:**

1. **Deploy service:**
   ```powershell
   kubectl apply -f k8s/app-service.yaml
   ```

2. **Check service:**
   ```powershell
   kubectl get svc -n driver-license-platform
   ```

3. **Wait for EXTERNAL-IP:**
   - Initially shows `<pending>`
   - Wait 1-2 minutes
   - Run command again until you see an IP address

4. **Example output:**
   ```
   NAME                        TYPE           EXTERNAL-IP      PORT(S)
   driver-license-app-service  LoadBalancer   157.230.xxx.xxx  80:3xxxx/TCP
   ```

5. **Copy the EXTERNAL-IP** (e.g., `157.230.xxx.xxx`)

### Step 7.3: Test Your Application

**Why:** Make sure everything works!

**How:**

1. **Open browser:**
   ```
   http://YOUR-EXTERNAL-IP
   ```
   - Replace `YOUR-EXTERNAL-IP` with the IP from Step 7.2

2. **You should see:**
   - Your Driver License Platform homepage!
   - Try logging in with test account

3. **If it doesn't work:**
   - Check pod logs (see Part 6.4)
   - Check if pods are running: `kubectl get pods -n driver-license-platform`

### Step 7.4: Update CLIENT_URL in Deployment

**Why:** Your app needs to know its public URL for CORS and redirects.

**How:**

1. **Edit:** `k8s/app-deployment.yaml`

2. **Update CLIENT_URL:**
   ```yaml
   - name: CLIENT_URL
     value: "http://YOUR-EXTERNAL-IP"
   ```

3. **Apply changes:**
   ```powershell
   kubectl apply -f k8s/app-deployment.yaml
   ```

4. **Wait for pods to restart:**
   ```powershell
   kubectl get pods -n driver-license-platform -w
   ```

**✅ Checkpoint:** Load Balancer is configured and working!

---

## Part 8: Set Up Horizontal Pod Autoscaler (HPA)

### Step 8.1: Understand Horizontal Pod Autoscaler (HPA)

**Why HPA?**
- **Problem:** Traffic varies (busy during day, quiet at night)
- **Solution:** HPA automatically adds/removes pods based on CPU usage
- **Benefit:** 
  - Handles traffic spikes automatically
  - Saves money when traffic is low
- **Requirement:** Assessment explicitly asks for "horizontal pod autoscaling"

**How It Works:**
- **Monitors:** CPU usage of pods
- **Target:** 70% CPU utilization
- **Scales:** 
  - If CPU > 70% → Add more pods (up to 10)
  - If CPU < 70% → Remove pods (down to 2)

### Step 8.2: Deploy HPA

**Why:** Enable automatic scaling (required for assessment).

**How:**

1. **Deploy HPA:**
   ```powershell
   kubectl apply -f k8s/hpa.yaml
   ```

2. **Verify:**
   ```powershell
   kubectl get hpa -n driver-license-platform
   ```

3. **Example output:**
   ```
   NAME                        REFERENCE                          TARGETS         MINPODS   MAXPODS   REPLICAS
   driver-license-app-hpa      Deployment/driver-license-app      70%/70% (avg)   2         10        3
   ```

### Step 8.3: Test Auto-Scaling (Optional)

**Why:** Verify HPA actually works.

**How:**

1. **Watch HPA:**
   ```powershell
   kubectl get hpa -n driver-license-platform -w
   ```

2. **Generate load (in another terminal):**
   ```powershell
   # Install Apache Bench (if not installed):
   # choco install apache-httpd
   
   # Generate load:
   ab -n 10000 -c 100 http://YOUR-EXTERNAL-IP/
   ```

3. **Observe:**
   - HPA should detect high CPU
   - Pods should scale up (from 3 to maybe 6-8)
   - After load stops, pods should scale back down

**✅ Checkpoint:** Auto-scaling is configured!

---

## Part 9: Verify Everything Works

### Step 9.1: Complete Verification Checklist

**Run these commands to verify everything:**

```powershell
# 1. Check cluster
kubectl get nodes

# 2. Check namespaces
kubectl get namespaces

# 3. Check all pods
kubectl get pods -n driver-license-platform

# 4. Check services (Load Balancer)
kubectl get svc -n driver-license-platform

# 5. Check deployments
kubectl get deployment -n driver-license-platform

# 6. Check HPA
kubectl get hpa -n driver-license-platform

# 7. Check secrets
kubectl get secrets -n driver-license-platform
```

### Step 9.2: Test Application Functionality

**Test these features:**

1. **Homepage:** http://YOUR-LOAD-BALANCER-IP
2. **Registration:** Create a new account
3. **Login:** Login with test account
4. **Tests:** View available tests
5. **Take Test:** Complete a practice test
6. **Appointments:** View/book appointments

### Step 9.3: Initialize Sample Data

**Why:** Populate database with test data.

**How:**

1. **Port forward to MongoDB:**
   ```powershell
   kubectl port-forward -n driver-license-platform svc/mongodb-service 27017:27017
   ```

2. **In another terminal, run init script:**
   ```powershell
   # Update .env with:
   MONGODB_URI=mongodb://localhost:27017/driver-license-platform
   
   # Run init script:
   node scripts/init-comprehensive-sample-data.js
   ```

3. **Stop port forward:** Press `Ctrl+C` in first terminal

**✅ Checkpoint:** Everything is working!

---

## Part 10: Cost Analysis

### Step 10.1: Calculate Current Costs

**Why:** Show you understand cost optimization (required for assessment).

**Monthly Costs:**

| Resource | Plan | Cost per Month |
|----------|------|----------------|
| **Kubernetes Cluster** | | |
| - Node 1 | s-2vcpu-4gb | $24 |
| - Node 2 | s-2vcpu-4gb | $24 |
| **Container Registry** | Basic | $5 |
| **Load Balancer** | Standard | $12 |
| **MongoDB Storage** | 10GB | $1.20 |
| **Total** | | **$66.20/month** |

**Why These Costs:**
- **2 Nodes:** High availability (if one fails, other continues)
- **Basic Registry:** Sufficient for assessment
- **Load Balancer:** Required for public access (assessment requirement)
- **10GB Storage:** Enough for database

### Step 10.2: Cost Optimization Strategies

**1. Use Smaller Nodes for Development:**
- **Current:** s-2vcpu-4gb ($24/node)
- **Optimized:** s-1vcpu-2gb ($12/node)
- **Savings:** $24/month
- **Trade-off:** Less performance, but fine for assessment

**2. Scale Down When Not in Use:**
- **HPA:** Automatically scales pods (2-10)
- **When idle:** Only 2 pods running
- **When busy:** Scales up automatically
- **Savings:** Pay only for what you use

**3. Use DigitalOcean Credits:**
- **Assessment:** $200 credit
- **Duration:** ~3 months free
- **After:** $66.20/month

**4. Future Optimizations:**
- **Reserved Instances:** 20% discount for 1-year commitment
- **Spot Instances:** 50% discount (for non-critical workloads)
- **MongoDB Atlas:** Free tier available (but assessment requires DO)

### Step 10.3: Create Cost Analysis Document

**Why:** Required for assessment submission.

**See:** `Documentation/COST_ANALYSIS.md` (already created)

**✅ Checkpoint:** Cost analysis complete!

---

## Troubleshooting Guide

### Problem 1: Pods Not Starting

**Symptoms:**
```powershell
kubectl get pods
# Shows: Pending, CrashLoopBackOff, or Error
```

**Solutions:**

1. **Check pod logs:**
   ```powershell
   kubectl logs <pod-name> -n driver-license-platform
   ```

2. **Check pod events:**
   ```powershell
   kubectl describe pod <pod-name> -n driver-license-platform
   ```

3. **Common issues:**
   - **Image pull error:** Check image name in deployment.yaml
   - **MongoDB connection:** Check MongoDB service is running
   - **Secrets:** Verify secrets are created correctly

### Problem 2: Cannot Access Application

**Symptoms:** Browser shows "site can't be reached"

**Solutions:**

1. **Check Load Balancer IP:**
   ```powershell
   kubectl get svc -n driver-license-platform
   ```
   - Wait for EXTERNAL-IP (may take 2-3 minutes)

2. **Check pods are running:**
   ```powershell
   kubectl get pods -n driver-license-platform
   ```

3. **Check application logs:**
   ```powershell
   kubectl logs <pod-name> -n driver-license-platform
   ```

### Problem 3: MongoDB Connection Error

**Symptoms:** Application logs show "MongoDB connection error"

**Solutions:**

1. **Check MongoDB is running:**
   ```powershell
   kubectl get pods -n driver-license-platform | grep mongodb
   ```

2. **Check MongoDB service:**
   ```powershell
   kubectl get svc mongodb-service -n driver-license-platform
   ```

3. **Verify connection string in secret:**
   ```powershell
   kubectl get secret app-secrets -n driver-license-platform -o yaml
   ```

### Problem 4: HPA Not Working

**Symptoms:** HPA shows no metrics or doesn't scale

**Solutions:**

1. **Check HPA status:**
   ```powershell
   kubectl describe hpa -n driver-license-platform
   ```

2. **Check metrics server:**
   ```powershell
   kubectl get deployment metrics-server -n kube-system
   ```
   - Should be running (DOKS includes this by default)

3. **Check pod CPU usage:**
   ```powershell
   kubectl top pods -n driver-license-platform
   ```

---

## 🎉 Congratulations!

You've successfully deployed a scalable, reliable, highly available application on DigitalOcean Kubernetes with:
- ✅ Docker containerization
- ✅ Kubernetes orchestration (DOKS)
- ✅ DigitalOcean Load Balancer
- ✅ Horizontal Pod Autoscaler (HPA)
- ✅ MongoDB on DOKS
- ✅ Cost optimization

**You're ready for your DigitalOcean TAM interview!** 🚀

---

## 📚 Next Steps

1. **Create Architecture Diagram:**
   - Use Draw.io, Lucidchart, or any diagram tool
   - Show: GitHub → Registry → DOKS → Load Balancer → Users
   - Include: HPA, MongoDB, Pods

2. **Create QBR Summary:**
   - See `Documentation/QBR_DECK.html` for template
   - Include: Infrastructure summary, performance, recommendations

3. **Prepare Presentation:**
   - Walk through Kubernetes manifests
   - Explain HPA configuration
   - Discuss Load Balancer setup
   - Show cost optimization

---

**Questions? Check the troubleshooting guide or review each part's "Why" sections!**

