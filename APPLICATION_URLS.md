# Application URLs

## 🌐 Your Application is Running!

### Main Application (Frontend)
**http://localhost:3000**

This is where you'll use the application:
- Register/Login
- Take practice tests
- Book appointments
- View dashboard

### Backend API
**http://localhost:5000**

API endpoints:
- Health check: http://localhost:5000/health
- API base: http://localhost:5000/api

## 🚀 Quick Access

**Click here or copy to browser:**
**http://localhost:3000**

## 📝 What to Do Next

1. **Open the application**: http://localhost:3000
2. **Register**: Click "Sign Up" to create an account
3. **Select your state**: Choose CA, TX, FL, or NY
4. **Explore features**:
   - Take a practice test
   - View your dashboard
   - Book an appointment

## 🔧 If Application Doesn't Load

1. **Check servers are running**:
   - Backend should show: "Server running on port 5000"
   - Frontend should show: "Local: http://localhost:3000"

2. **Wait a moment**: Servers need 10-15 seconds to start

3. **Check for errors**: Look at the PowerShell windows for any error messages

4. **Restart servers**: Close the PowerShell windows and run:
   ```powershell
   # Terminal 1
   npm run dev
   
   # Terminal 2
   cd client
   npm run dev
   ```

## 📊 Server Status

- **Backend**: Should be running on port 5000
- **Frontend**: Should be running on port 3000
- **MongoDB**: Optional (some features need it)

---

**Your application is ready at: http://localhost:3000** 🎉

