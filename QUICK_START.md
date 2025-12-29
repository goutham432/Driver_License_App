# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
# Backend
npm install

# Frontend  
cd client
npm install
cd ..
```

### 2. Set Up Environment

```bash
# Copy and edit .env file
cp env.example .env
```

Edit `.env`:
- Set `MONGODB_URI` (use MongoDB Atlas or local MongoDB)
- Set `JWT_SECRET` to a random string

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Recommended)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Initialize Sample Data

```bash
node scripts/init-sample-data.js
```

### 5. Start Application

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd client
npm run dev
```

### 6. Open Browser

Visit: **http://localhost:3000**

## ✅ Test the Application

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Take Test**: Go to Tests → Select a test → Start
4. **View Results**: See your score and explanations
5. **Book Appointment**: Schedule a DMV appointment

## 🐳 Docker Alternative

```bash
docker-compose up -d
```

Access at: **http://localhost:5000**

## 📤 Push to GitHub

Once Git is installed:

```powershell
.\GITHUB_PUSH.ps1
```

---

**That's it! Your application is ready! 🎉**

