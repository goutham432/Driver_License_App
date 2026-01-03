# Driver License Platform

A comprehensive SaaS web application for driver license test preparation and DMV appointment booking across multiple US states (California, Texas, Florida, New York).

**Repository:** https://github.com/goutham432/Driver_License_App  
**Deployed URL:** http://129.212.162.2  
**Platform:** DigitalOcean Kubernetes (DOKS)

---

## 🎯 Features

- **Multi-State Practice Tests** - Practice tests for CA, TX, FL, and NY with 10-15 questions each
- **Interactive Test Taking** - Timer-based tests with real-time progress tracking
- **Detailed Results & Analytics** - Comprehensive test results with explanations
- **DMV Appointment Booking** - Online appointment scheduling with real-time availability
- **User Dashboard** - Track progress, view statistics, and manage appointments
- **Secure Authentication** - JWT-based authentication with password hashing
- **Mobile Responsive** - Fully responsive design for all devices

---

## 🏗️ Technology Stack

### Frontend
- React 18 with functional components and hooks
- React Router 6 for navigation
- Tailwind CSS for styling
- Vite for build tooling
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Security middleware (Helmet, CORS, Rate Limiting)

### Infrastructure
- Docker with multi-stage builds
- Kubernetes (DigitalOcean Kubernetes - DOKS)
- Horizontal Pod Autoscaling (HPA)
- DigitalOcean Load Balancer
- GitHub Actions CI/CD

---

## 📋 Prerequisites

- DigitalOcean account with API token
- GitHub account
- kubectl installed
- doctl (DigitalOcean CLI) installed
- Git installed

---

## 🚀 Quick Start - Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/goutham432/Driver_License_App.git
cd Driver_License_App
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Set Up Environment Variables

```bash
cp env.example .env
# Edit .env with your configuration
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/driver-license-platform
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB

**Option A: Using Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

**Option B: Using MongoDB Atlas**
- Create account at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI` in `.env`

### 5. Initialize Sample Data (Optional)

```bash
node scripts/init-sample-data.js
```

### 6. Start the Application

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

### 7. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up -d
```

Access the application at: http://localhost:5000

---

## ☸️ Kubernetes Deployment (DigitalOcean)

### Prerequisites

1. **DigitalOcean Account Setup**
   - Create account: https://cloud.digitalocean.com
   - Generate API token: https://cloud.digitalocean.com/account/api/tokens
   - Install `doctl`: https://docs.digitalocean.com/reference/doctl/how-to/install/

2. **Install kubectl**
   ```bash
   # Windows (PowerShell)
   choco install kubernetes-cli
   
   # macOS
   brew install kubectl
   
   # Linux
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

### Step 1: Create DigitalOcean Resources

#### 1.1 Create Container Registry

```bash
doctl registry create driver-license-registry
doctl registry login
```

#### 1.2 Create Kubernetes Cluster

```bash
doctl kubernetes cluster create driver-license-cluster \
  --region nyc1 \
  --node-pool "name=driver-license-pool;size=s-1vcpu-2gb;count=2"
```

**Or via Web UI:**
1. Go to: https://cloud.digitalocean.com/kubernetes/clusters
2. Click "Create Kubernetes Cluster"
3. Name: `driver-license-cluster`
4. Node Pool: `s-1vcpu-2gb`, Count: `2`
5. Click "Create Cluster"
6. Wait 5-10 minutes

#### 1.3 Save Kubernetes Config

```bash
doctl kubernetes cluster kubeconfig save driver-license-cluster
kubectl get nodes  # Verify connection
```

### Step 2: Configure GitHub Secrets

1. Go to: https://github.com/goutham432/Driver_License_App/settings/secrets/actions
2. Click "New repository secret"
3. Add:
   - **Name:** `DIGITALOCEAN_ACCESS_TOKEN`
   - **Value:** Your DigitalOcean API token

### Step 3: Deploy Application

#### Option A: Automatic Deployment (Recommended)

The application automatically deploys via GitHub Actions when you push to `main`:

```bash
git add .
git commit -m "Deploy to DOKS"
git push origin main
```

Monitor deployment:
- Go to: https://github.com/goutham432/Driver_License_App/actions

#### Option B: Manual Deployment

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create registry credentials
kubectl create secret docker-registry registry-credentials \
  --docker-server=registry.digitalocean.com \
  --docker-username=$(doctl auth list -o json | jq -r '.[0].token') \
  --docker-password=$(doctl auth list -o json | jq -r '.[0].token') \
  -n driver-license-platform

# 3. Create application secrets
kubectl create secret generic app-secrets \
  --from-literal=mongodb-uri="mongodb://mongodb-service:27017/driver-license-platform" \
  --from-literal=jwt-secret=$(openssl rand -base64 32) \
  -n driver-license-platform

# 4. Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl wait --for=condition=ready pod -l app=mongodb -n driver-license-platform --timeout=300s

# 5. Deploy application
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
kubectl apply -f k8s/hpa.yaml

# 6. Check status
kubectl get pods -n driver-license-platform
kubectl get svc -n driver-license-platform
```

### Step 4: Get Application URL

```bash
kubectl get svc driver-license-app-service -n driver-license-platform
```

Look for `EXTERNAL-IP` in the output - this is your Load Balancer IP.

### Step 5: Initialize Sample Data

```bash
# Port forward MongoDB
kubectl port-forward svc/mongodb-service 27017:27017 -n driver-license-platform

# In another terminal
export MONGODB_URI="mongodb://localhost:27017/driver-license-platform"
node scripts/init-k8s-sample-data.js
```

**Or use PowerShell script (Windows):**
```powershell
.\INIT_SAMPLE_DATA.ps1
```

---

## 📁 Project Structure

```
driver-license-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml
│   ├── app-deployment.yaml
│   ├── app-service.yaml
│   ├── mongodb-deployment.yaml
│   ├── hpa.yaml
│   └── ingress.yaml
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Test.js
│   └── Appointment.js
├── routes/                 # Express routes
│   ├── auth.js
│   ├── tests.js
│   ├── appointments.js
│   └── states.js
├── middleware/             # Custom middleware
│   └── auth.js
├── scripts/                 # Utility scripts
│   ├── init-sample-data.js
│   └── init-k8s-sample-data.js
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
├── server.js               # Main server file
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Local development
├── package.json
└── README.md
```

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Tests
- `GET /api/tests/state/:state` - Get tests by state
- `GET /api/tests/:testId` - Get specific test
- `POST /api/tests/:testId/submit` - Submit test answers (protected)
- `GET /api/tests/user/history` - Get user's test history (protected)

### Appointments
- `GET /api/appointments/slots/:state/:date` - Get available slots
- `POST /api/appointments/book` - Book appointment (protected)
- `GET /api/appointments/my-appointments` - Get user's appointments (protected)
- `PATCH /api/appointments/:id/cancel` - Cancel appointment (protected)

### States
- `GET /api/states` - List all supported states
- `GET /api/states/:stateCode` - Get state information
- `GET /api/states/:stateCode/locations` - Get DMV locations

### Health
- `GET /health` - Health check endpoint

---

## 📊 Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  state: String,
  testScores: [{
    testId: ObjectId,
    score: Number,
    passed: Boolean,
    completedAt: Date
  }],
  appointments: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Tests Collection
```javascript
{
  title: String (required),
  state: String (required),
  category: String,
  description: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  passingScore: Number,
  timeLimit: Number,
  difficulty: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Appointments Collection
```javascript
{
  user: ObjectId (ref: User),
  state: String (required),
  location: String (required),
  appointmentType: String,
  scheduledDate: Date (required),
  timeSlot: String (required),
  status: String (enum: ['scheduled', 'completed', 'cancelled']),
  confirmationNumber: String (unique),
  notes: String,
  createdAt: Date
}
```

---

## 🔒 Security Features

- **JWT Authentication** - Tokens expire after 7 days
- **Password Hashing** - bcryptjs with 10 salt rounds
- **CORS Configuration** - Configured for production
- **Helmet.js** - Security headers (CSP disabled for static assets)
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Mongoose schema validation
- **Environment Variables** - Sensitive data in secrets

---

## 📱 Supported States

- **California (CA)** - Los Angeles, San Francisco, San Diego
- **Texas (TX)** - Houston, Dallas, Austin
- **Florida (FL)** - Miami, Orlando, Tampa
- **New York (NY)** - Manhattan, Brooklyn, Queens

---

## 💰 Cost Breakdown

**Monthly Infrastructure Costs (DigitalOcean):**
- Kubernetes Nodes (2x s-1vcpu-2gb): $24.00
- Load Balancer: $12.00
- Container Registry: $5.00
- MongoDB Storage (10GB): $1.20
- **Total: ~$42.20/month**

---

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

---

## 🚨 Troubleshooting

### Pods Not Starting
```bash
kubectl describe pod POD_NAME -n driver-license-platform
kubectl logs POD_NAME -n driver-license-platform
```

### Cannot Access Application
1. Check Load Balancer has external IP: `kubectl get svc -n driver-license-platform`
2. Verify pods are running: `kubectl get pods -n driver-license-platform`
3. Test health endpoint: `curl http://LOAD_BALANCER_IP/health`

### Database Connection Errors
1. Check MongoDB pod: `kubectl get pods -l app=mongodb -n driver-license-platform`
2. Verify service: `kubectl get svc mongodb-service -n driver-license-platform`
3. Check secrets: `kubectl get secret app-secrets -n driver-license-platform -o yaml`

---

## 📚 Additional Documentation

- **Setup Guide:** See `SUBMISSION/SETUP_GUIDE.md` for detailed step-by-step instructions
- **Architecture:** See `SUBMISSION/ARCHITECTURE_DIAGRAM.html` for visual architecture
- **QBR Report:** See `SUBMISSION/QBR_REPORT.md` for business review
- **DOKS Deployment:** See `README_DOKS_DEPLOYMENT.md` for advanced deployment options

---

## 🔄 CI/CD Pipeline

The application uses GitHub Actions for automated deployment:

1. **Trigger:** Push to `main` branch
2. **Build:** Docker image built and pushed to DigitalOcean Container Registry
3. **Deploy:** Kubernetes manifests applied to DOKS cluster
4. **Verify:** Health checks and pod status verification

Workflow file: `.github/workflows/deploy.yml`

---

## 📝 License

MIT License

---

## 👤 Author

Goutham

---

## 🙏 Acknowledgments

- Built for DigitalOcean TAM interview assessment
- Uses modern web technologies and best practices
- Demonstrates production-ready Kubernetes deployment

---

**For detailed setup instructions, see `SUBMISSION/SETUP_GUIDE.md`**
