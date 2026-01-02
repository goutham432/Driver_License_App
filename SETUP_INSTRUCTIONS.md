# Complete Setup Instructions

## 🚀 Quick Start Guide

### Step 1: Install Prerequisites

1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (Choose one):
   - **Local MongoDB**: https://www.mongodb.com/try/download/community
   - **MongoDB Atlas** (Cloud - Recommended): https://www.mongodb.com/cloud/atlas

3. **Git** (for version control)
   - Download: https://git-scm.com/download/win
   - Verify: `git --version`

### Step 2: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

Or use the setup script:
```bash
# On Linux/Mac
chmod +x scripts/setup.sh
./scripts/setup.sh

# On Windows (PowerShell)
# Run npm install commands manually
```

### Step 3: Configure Environment

1. Copy environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file:
   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/driver-license-platform

   # OR for MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/driver-license-platform

   # Change this to a strong random string
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

### Step 4: Initialize Sample Data

```bash
node scripts/init-sample-data.js
```

This creates sample practice tests for all states.

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 6: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Build Docker Image

```bash
docker build -t driver-license-platform:latest .
```

## ☸️ Kubernetes Deployment

See `DEPLOYMENT.md` for complete Kubernetes deployment instructions.

## 📝 Testing the Application

1. **Register a new account:**
   - Go to http://localhost:3000/register
   - Fill in your details and select a state

2. **Take a practice test:**
   - Go to Tests page
   - Select a test
   - Answer questions and submit

3. **Book an appointment:**
   - Go to Book Appointment
   - Follow the 3-step process
   - Confirm booking

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Check MongoDB is running: `mongod --version`
- Verify MONGODB_URI in .env
- For MongoDB Atlas: Check IP whitelist and credentials

### Port Already in Use
- Change PORT in .env file
- Or stop the process using the port

### Module Not Found Errors
- Run `npm install` in both root and client directories
- Delete node_modules and reinstall

### CORS Errors
- Verify CLIENT_URL in .env matches frontend URL
- Check backend is running on correct port

## 📚 Next Steps

1. Review the code structure
2. Customize for your needs
3. Deploy to production
4. Set up monitoring

---

**Need help?** Check the README.md for more information.


