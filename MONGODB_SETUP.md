# MongoDB Setup Guide

## ⚠️ Current Issue

Your backend server is trying to connect to MongoDB but it's not running. The frontend works, but features requiring database (login, tests, appointments) won't work.

## ✅ Solution Options

### Option 1: MongoDB Atlas (Cloud - Easiest & Recommended)

**MongoDB Atlas is free and doesn't require installation!**

1. **Sign up for MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (M0 Free Tier)

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region
   - Click "Create"

3. **Set up Database Access:**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Set up Network Access:**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
   - Replace `<password>` with your actual password
   - Replace `<database>` with `driver-license-platform`

6. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/driver-license-platform?retryWrites=true&w=majority
   ```

7. **Restart your backend server** - MongoDB connection should work!

### Option 2: Local MongoDB Installation

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Run the installer

2. **Install MongoDB:**
   - Use default settings
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool - optional)

3. **Start MongoDB:**
   - MongoDB should start automatically as a Windows service
   - Or manually start: Open Services → Find "MongoDB" → Start

4. **Verify it's running:**
   ```powershell
   # Check if MongoDB is running
   Get-Service -Name MongoDB
   ```

5. **Your .env file should already be correct:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/driver-license-platform
   ```

6. **Restart your backend server**

### Option 3: Use Docker (If you have Docker Desktop)

1. **Run MongoDB in Docker:**
   ```powershell
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

2. **Your .env file should already be correct:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/driver-license-platform
   ```

3. **Restart your backend server**

## 🔧 After Setting Up MongoDB

1. **Restart the backend server:**
   - Close the backend PowerShell window
   - Run: `npm run dev` again

2. **You should see:**
   ```
   ✅ MongoDB Connected: [your connection]
   ✅ Server running on port 5000
   ```

3. **Initialize sample data (optional):**
   ```powershell
   node scripts/init-sample-data.js
   ```

## 📝 Quick Test

After MongoDB is connected, test the API:

```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/health"

# Should return: {"status":"healthy","timestamp":"..."}
```

## 🎯 Recommended: MongoDB Atlas

**I recommend MongoDB Atlas** because:
- ✅ Free tier available
- ✅ No installation needed
- ✅ Works from anywhere
- ✅ Easy to set up
- ✅ Automatic backups
- ✅ Perfect for development and production

## ⚠️ Current Status

Right now, your server will:
- ✅ Start and run (won't crash)
- ✅ Serve the frontend
- ⚠️ Show MongoDB connection warning
- ❌ Database features won't work until MongoDB is connected

**The UI will work, but login, tests, and appointments need MongoDB!**

---

**Need help?** Check the MongoDB Atlas documentation or use the free tier - it's the easiest option!


