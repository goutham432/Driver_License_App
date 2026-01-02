# Simple Setup Instructions

## 🚀 Quick Setup Guide

Since Node.js and Git need to be installed manually, here's the simplest way:

### Step 1: Install Node.js

1. Go to: https://nodejs.org/
2. Download the LTS version (v20.x)
3. Run the installer
4. **Use all default settings**
5. **Restart PowerShell** after installation

### Step 2: Install Git

1. Go to: https://git-scm.com/download/win
2. Download the installer
3. Run the installer
4. **Use all default settings**
5. **Restart PowerShell** after installation

### Step 3: Run Setup Script

After restarting PowerShell:

```powershell
.\SETUP_AND_START.ps1
```

This will:
- ✅ Verify Node.js and Git are installed
- ✅ Install all dependencies
- ✅ Set up environment
- ✅ Configure Git
- ✅ Initialize repository

### Step 4: Start the Application

**Option A: Use the start script**
```powershell
.\START_APP.ps1
```

**Option B: Manual start**

Terminal 1 (Backend):
```powershell
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd client
npm run dev
```

### Step 5: Access the Application

Open your browser and go to:

**Frontend: http://localhost:3000**

The frontend will automatically connect to the backend at http://localhost:5000

## 📝 What You'll See

1. **Home Page** - Landing page with features
2. **Register** - Create an account
3. **Login** - Sign in
4. **Dashboard** - Your statistics and quick actions
5. **Tests** - Browse and take practice tests
6. **Appointments** - View and manage appointments
7. **Book Appointment** - Schedule DMV appointments

## 🔧 Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js and restart PowerShell

### "npm install" fails
- Check internet connection
- Try: `npm install --legacy-peer-deps`

### MongoDB connection error
- If using local MongoDB: Make sure MongoDB is running
- If using MongoDB Atlas: Check connection string in .env
- For testing, you can skip MongoDB initially (some features won't work)

### Port already in use
- Change PORT in .env file
- Or stop the process using port 3000/5000

## 🎯 Next Steps After Setup

1. **Initialize sample data:**
   ```bash
   node scripts/init-sample-data.js
   ```
   (Requires MongoDB to be running)

2. **Push to GitHub:**
   ```powershell
   .\GITHUB_PUSH.ps1
   ```

3. **Deploy to Kubernetes:**
   See DEPLOYMENT.md for instructions

---

**Need help?** Check README.md or SETUP_INSTRUCTIONS.md for more details.


