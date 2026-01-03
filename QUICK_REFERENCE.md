# Quick Reference - All Commands

## Navigation Commands

### CMD (Command Prompt):
```cmd
cd /d "C:\Users\Goutham\Desktop\Goutham Folder\Cursor project"
```

### PowerShell:
```powershell
cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project'
```

---

## Database Access

### Quick Access:
```powershell
# 1. Navigate to project
cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project'

# 2. Connect to cluster
doctl kubernetes cluster kubeconfig save driver-license-cluster

# 3. Port forward MongoDB
kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform

# 4. In another terminal, connect:
mongosh mongodb://localhost:27017/driver-license-platform
```

### View Records:
```javascript
use driver-license-platform
show collections
db.users.find().pretty()
db.tests.find().pretty()
db.appointments.find().pretty()
```

---

## Common Tasks

### Initialize Sample Data:
```powershell
cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project'
.\INIT_SAMPLE_DATA.ps1
```

### Check Deployment:
```powershell
kubectl get pods -n driver-license-platform
kubectl get svc -n driver-license-platform
kubectl logs -l app=driver-license-app -n driver-license-platform --tail=50
```

### Get Load Balancer IP:
```powershell
kubectl get svc driver-license-app-service -n driver-license-platform
```

---

## Project Location

**Full Path:**
```
C:\Users\Goutham\Desktop\Goutham Folder\Cursor project
```

**CD Command (CMD):**
```cmd
cd /d "C:\Users\Goutham\Desktop\Goutham Folder\Cursor project"
```

**CD Command (PowerShell):**
```powershell
cd 'C:\Users\Goutham\Desktop\Goutham Folder\Cursor project'
```

