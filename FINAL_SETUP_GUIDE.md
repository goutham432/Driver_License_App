# Final Setup Guide - Get Everything Running

## ⚠️ Important: Install These First

You need to install **Node.js** and **Git** manually first. Here's how:

### 1. Install Node.js

1. **Download**: https://nodejs.org/
2. **Choose**: LTS version (v20.x recommended)
3. **Install**: Run installer, use **default settings**
4. **Restart**: Close and reopen PowerShell
5. **Verify**: Run `node --version` (should show v20.x.x)

### 2. Install Git

1. **Download**: https://git-scm.com/download/win
2. **Install**: Run installer, use **default settings**
3. **Restart**: Close and reopen PowerShell
4. **Verify**: Run `git --version` (should show git version)

## 🚀 After Installing Node.js and Git

### Option 1: Use the Setup Script

```powershell
.\INSTALL_AND_RUN.ps1
```

This will:
- Check Node.js and Git
- Install all dependencies
- Set up environment
- Configure Git

### Option 2: Manual Setup

```powershell
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Create .env file
cp env.example .env

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize Git
git init
git remote add origin https://github.com/goutham432/Driver_License_App.git
```

## 🎯 Start the Application

### Method 1: Two Terminals

**Terminal 1 (Backend):**
```powershell
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd client
npm run dev
```

### Method 2: Use Start Script

```powershell
.\START_APP.ps1
```

This opens separate windows for backend and frontend.

## 🌐 Application URLs

Once both servers are running:

- **Frontend (Main App)**: **http://localhost:3000**
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📝 Initialize Sample Data (Optional)

If you have MongoDB running:

```powershell
node scripts/init-sample-data.js
```

This creates sample practice tests for all states.

## ✅ Verify Everything Works

1. Open **http://localhost:3000** in your browser
2. You should see the **Home page**
3. Click **"Sign Up"** to create an account
4. After registration, you'll see the **Dashboard**
5. Go to **Tests** to see available practice tests

## 🔧 Troubleshooting

### "node is not recognized"
- Node.js not installed or not in PATH
- Restart PowerShell after installation
- Check: `node --version`

### "npm install" takes too long
- This is normal! First install can take 2-5 minutes
- Be patient, it's downloading many packages

### Port 3000 or 5000 already in use
- Stop other applications using these ports
- Or change ports in:
  - Backend: Edit `PORT` in `.env`
  - Frontend: Edit `vite.config.js` port

### MongoDB connection error
- For now, you can test without MongoDB
- Some features (tests, appointments) need MongoDB
- Use MongoDB Atlas (free) or install local MongoDB

## 📤 Push to GitHub

After everything is working:

```powershell
.\GITHUB_PUSH.ps1
```

You'll need:
1. Repository created on GitHub: https://github.com/goutham432/Driver_License_App
2. Personal Access Token from: https://github.com/settings/tokens

---

## 🎉 You're Ready!

Once you see the application at **http://localhost:3000**, everything is working!

**Good luck with your interview!** 🚀


