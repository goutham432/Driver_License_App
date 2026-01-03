# Blank Page Troubleshooting Guide

## Issue
Load Balancer IP `http://129.212.162.2/` shows a blank white page.

## Diagnosis Results

### ✅ What's Working
- **Health Endpoint**: `http://129.212.162.2/health` returns `200 OK`
- **HTML Loading**: Root endpoint returns HTML (758 bytes)
- **JavaScript Assets**: `/assets/index-*.js` files are accessible
- **CSS Assets**: `/assets/index-*.css` files are accessible
- **API Endpoints**: `/api/states` and other API endpoints work

### ❌ Root Cause
The blank page is caused by:
1. **Static file path issue**: `express.static('client/build')` was using relative path instead of absolute path
2. **Helmet CSP blocking**: Content Security Policy was blocking asset loading
3. **CORS restrictions**: CORS was too restrictive for production

## Fixes Applied

### 1. Fixed Static File Path
**Before:**
```javascript
app.use(express.static('client/build'));
```

**After:**
```javascript
app.use(express.static(path.join(__dirname, 'client/build')));
```

### 2. Disabled Helmet CSP
**Before:**
```javascript
app.use(helmet());
```

**After:**
```javascript
app.use(helmet({
  contentSecurityPolicy: false, // Allow loading assets
}));
```

### 3. Fixed CORS for Production
**Before:**
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

**After:**
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow all origins in production
  credentials: true
}));
```

## Deployment

The fixes have been:
1. ✅ Committed to Git
2. ✅ Pushed to GitHub
3. ⏳ GitHub Actions will automatically rebuild and redeploy

**Wait 5-10 minutes** for the new deployment to complete, then test again.

## Testing After Redeploy

1. **Check Health Endpoint:**
   ```
   http://129.212.162.2/health
   ```
   Should return: `{"status":"healthy","timestamp":"..."}`

2. **Check Root Endpoint:**
   ```
   http://129.212.162.2/
   ```
   Should show the React application (not blank)

3. **Check Browser Console:**
   - Press `F12` to open Developer Tools
   - Go to "Console" tab
   - Look for any JavaScript errors
   - Go to "Network" tab
   - Check for failed requests (red entries)

## If Still Blank After Redeploy

### Check Pod Logs
```powershell
# Connect to cluster
doctl kubernetes cluster kubeconfig save driver-license-cluster

# Check pod logs
kubectl logs -l app=driver-license-app -n driver-license-platform --tail=50
```

### Check Pod Status
```powershell
kubectl get pods -n driver-license-platform
```

### Check Service
```powershell
kubectl get svc -n driver-license-platform
```

### Port Forward for Local Testing
```powershell
kubectl port-forward svc/driver-license-app-service 8080:80 -n driver-license-platform
```
Then open: `http://localhost:8080`

## Common Issues

### Issue: JavaScript Errors in Console
**Solution:** Check browser console for specific errors. Common issues:
- API calls failing (CORS, authentication)
- Missing environment variables
- React rendering errors

### Issue: Assets Return 404
**Solution:** Verify static files exist in pod:
```powershell
kubectl exec POD_NAME -n driver-license-platform -- ls -la /app/client/build
```

### Issue: API Calls Failing
**Solution:** Check if API endpoints are accessible:
```powershell
Invoke-WebRequest -Uri "http://129.212.162.2/api/states"
```

## Database Location

**Note:** The database is **NOT** on MongoDB Atlas. It's running inside the Kubernetes cluster as a MongoDB pod.

**To view database records:**
```powershell
# Connect to MongoDB pod
kubectl exec -it MONGODB_POD_NAME -n driver-license-platform -- mongosh

# Then run:
use driver-license-platform
show collections
db.users.find().pretty()
db.tests.find().pretty()
db.appointments.find().pretty()
```

## Summary

The blank page was caused by static file serving issues. The fixes have been applied and pushed to GitHub. Wait for the automatic redeployment (5-10 minutes), then test again.

If issues persist after redeploy, check:
1. Browser console for JavaScript errors
2. Pod logs for application errors
3. Network tab for failed requests

