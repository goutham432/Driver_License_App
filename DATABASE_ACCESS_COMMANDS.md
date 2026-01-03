# Database Access Commands

## Quick Reference

### CD Command for CMD (Command Prompt)

```cmd
cd /d "C:\Users\Goutham\Desktop\Goutham Folder\Cursor project"
```

### CD Command for PowerShell

```powershell
cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project'
```

---

## Accessing MongoDB Database

### Step 1: Connect to Kubernetes Cluster

```powershell
# Authenticate (if not already done)
doctl auth init

# Connect to cluster
doctl kubernetes cluster kubeconfig save driver-license-cluster
```

### Step 2: Port Forward MongoDB

**Option A: PowerShell (Background Job)**
```powershell
# Start port-forward in background
Start-Job -ScriptBlock {
    kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform
}

# Wait a moment
Start-Sleep -Seconds 3
```

**Option B: Separate Terminal**
```powershell
# Keep this terminal open
kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform
```

### Step 3: Connect to MongoDB

**Option A: MongoDB Shell (mongosh)**
```powershell
# Connect to MongoDB
mongosh mongodb://localhost:27017/driver-license-platform

# Once connected, run:
use driver-license-platform
show collections
db.users.find().pretty()
db.tests.find().pretty()
db.appointments.find().pretty()
```

**Option B: MongoDB Compass (GUI)**
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `driver-license-platform`

**Option C: Node.js Script**
```powershell
# Set connection string
$env:MONGODB_URI = "mongodb://localhost:27017/driver-license-platform"

# Run script
node scripts/view-database.js
```

---

## Quick Database Commands

### View All Collections:
```javascript
show collections
```

### Count Documents:
```javascript
db.users.countDocuments()
db.tests.countDocuments()
db.appointments.countDocuments()
```

### View Users:
```javascript
db.users.find().pretty()
db.users.find({email: "user@example.com"}).pretty()
```

### View Tests:
```javascript
db.tests.find().pretty()
db.tests.find({state: "CA"}).pretty()
```

### View Appointments:
```javascript
db.appointments.find().pretty()
db.appointments.find({status: "scheduled"}).pretty()
```

### Delete All Data (Careful!):
```javascript
db.users.deleteMany({})
db.tests.deleteMany({})
db.appointments.deleteMany({})
```

---

## Complete Workflow Script

Save this as `ACCESS_DATABASE.ps1`:

```powershell
# Navigate to project
cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project'

# Connect to cluster
doctl kubernetes cluster kubeconfig save driver-license-cluster

# Port forward MongoDB
Write-Host "Starting port-forward..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock {
    kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform
}

Start-Sleep -Seconds 3
Write-Host "✅ Port-forward active" -ForegroundColor Green
Write-Host ""
Write-Host "Connect to MongoDB:" -ForegroundColor Cyan
Write-Host "  mongosh mongodb://localhost:27017/driver-license-platform" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop port-forward when done" -ForegroundColor Yellow
```

---

## Alternative: Direct kubectl exec

### Connect to MongoDB Pod Directly:

```powershell
# Get MongoDB pod name
$pod = kubectl get pods -l app=mongodb -n driver-license-platform -o jsonpath='{.items[0].metadata.name}'

# Connect to MongoDB shell
kubectl exec -it $pod -n driver-license-platform -- mongosh

# Then run:
use driver-license-platform
show collections
db.users.find().pretty()
```

---

## View Database Records - Quick Commands

### Check if MongoDB is Running:
```powershell
kubectl get pods -l app=mongodb -n driver-license-platform
```

### View MongoDB Logs:
```powershell
kubectl logs -l app=mongodb -n driver-license-platform --tail=50
```

### Check MongoDB Service:
```powershell
kubectl get svc mongodb-service -n driver-license-platform
```

---

## Common Database Queries

### Find User by Email:
```javascript
db.users.findOne({email: "user@example.com"})
```

### Find All Tests for a State:
```javascript
db.tests.find({state: "CA", isActive: true})
```

### Find Upcoming Appointments:
```javascript
db.appointments.find({
    scheduledDate: { $gte: new Date() },
    status: { $in: ["scheduled", "confirmed"] }
}).sort({ scheduledDate: 1 })
```

### Count Users by State:
```javascript
db.users.aggregate([
    { $group: { _id: "$state", count: { $sum: 1 } } }
])
```

---

## Troubleshooting

### Port 27017 Already in Use:
```powershell
# Find and kill process
netstat -ano | findstr :27017
taskkill /PID <PID> /F
```

### Cannot Connect to MongoDB:
1. Check if MongoDB pod is running: `kubectl get pods -n driver-license-platform`
2. Check port-forward is active
3. Verify service exists: `kubectl get svc -n driver-license-platform`

### MongoDB Pod Not Found:
```powershell
# Check all pods
kubectl get pods -n driver-license-platform

# If MongoDB not found, deploy it:
kubectl apply -f k8s/mongodb-deployment.yaml
```

---

**Quick Start:**
1. `cd /d "C:\Users\Goutham\Desktop\Goutham Folder\Cursor project"`
2. `kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform`
3. `mongosh mongodb://localhost:27017/driver-license-platform`

