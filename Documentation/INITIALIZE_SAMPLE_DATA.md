# Initialize Sample Data in Kubernetes MongoDB

The database in your Kubernetes cluster is empty. You need to initialize sample data (practice tests) so users can take tests.

## Option 1: Run Script from Local Machine (Recommended)

**Prerequisites:**
- Node.js installed locally
- MongoDB connection string pointing to Kubernetes MongoDB

**Steps:**

1. **Port forward MongoDB to your local machine:**
   ```powershell
   kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform
   ```

2. **Set environment variable:**
   ```powershell
   $env:MONGODB_URI = "mongodb://localhost:27017/driver-license-platform"
   ```

3. **Run the initialization script:**
   ```powershell
   node scripts/init-k8s-sample-data.js
   ```

## Option 2: Run Script Inside Kubernetes Pod

**Steps:**

1. **Copy the script to a MongoDB pod:**
   ```powershell
   # Get MongoDB pod name
   $podName = kubectl get pods -l app=mongodb -n driver-license-platform -o jsonpath='{.items[0].metadata.name}'
   
   # Copy script
   kubectl cp scripts/init-k8s-sample-data.js ${podName}:/tmp/init.js -n driver-license-platform
   ```

2. **Run the script using Node.js (if Node.js is available in pod):**
   ```powershell
   kubectl exec -it $podName -n driver-license-platform -- node /tmp/init.js
   ```

   **OR use MongoDB shell:**
   ```powershell
   # This won't work directly - you need Node.js to run the script
   # Instead, use Option 1 or Option 3
   ```

## Option 3: Create a Kubernetes Job (Advanced)

Create a one-time Kubernetes Job that runs the initialization script:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: init-sample-data
  namespace: driver-license-platform
spec:
  template:
    spec:
      containers:
      - name: init-data
        image: node:18-alpine
        command: ["sh", "-c"]
        args:
          - |
            npm install mongoose bcryptjs dotenv
            node /tmp/init.js
        env:
        - name: MONGODB_URI
          value: "mongodb://mongodb-service:27017/driver-license-platform"
        volumeMounts:
        - name: init-script
          mountPath: /tmp
      volumes:
      - name: init-script
        configMap:
          name: init-script
      restartPolicy: Never
```

## What Gets Initialized

The script will create:
- **4 Practice Tests** (one for each state: CA, TX, FL, NY)
- **10-15 questions per test**
- **Scorecards and explanations**

## Verify Data

After running the script, verify the data:

```powershell
# Port forward MongoDB
kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform

# Connect to MongoDB
mongosh mongodb://localhost:27017/driver-license-platform

# Check tests
db.tests.find().pretty()

# Count tests
db.tests.countDocuments()
```

## Troubleshooting

**Error: "Cannot connect to MongoDB"**
- Make sure MongoDB pod is running: `kubectl get pods -n driver-license-platform`
- Check MongoDB service: `kubectl get svc -n driver-license-platform`
- Verify port forwarding is active

**Error: "Module not found"**
- Make sure you're running from the project root directory
- Install dependencies: `npm install`

**Error: "Tests already exist"**
- The script will clear existing tests before inserting new ones
- If you want to keep existing data, modify the script to skip clearing

