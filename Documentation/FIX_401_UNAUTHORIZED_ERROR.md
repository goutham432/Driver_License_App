# 🔧 Fix: 401 Unauthorized Error in GitHub Actions
## DigitalOcean Container Registry Authentication Issue

---

## ❌ Error Message

```
Error: buildx failed with: ERROR: failed to build: failed to solve: failed to fetch oauth token: 
unexpected status from GET request to https://api.digitalocean.com/v2/registry/auth?scope=repository%3Adriver-license-registry%2Fdriver-license-app%3Apull%2Cpush&service=registry.digitalocean.com: 401 Unauthorized
```

---

## 🔍 Root Cause

The `docker/login-action` is not properly authenticating with DigitalOcean Container Registry. DigitalOcean requires using `doctl registry login` which handles the authentication correctly.

---

## ✅ Solution

### Option 1: Use doctl (Recommended - Already Fixed in Workflow)

The workflow has been updated to use `doctl registry login` instead of `docker/login-action`.

**What Changed:**
- Removed `docker/login-action@v3`
- Added `doctl registry login` command
- `doctl` is installed before the login step

**Why This Works:**
- `doctl registry login` automatically handles DigitalOcean's authentication
- It configures Docker with the correct credentials
- More reliable than manual docker login

---

## 🔍 Troubleshooting Steps

### Step 1: Verify GitHub Secret is Set

1. **Go to:** https://github.com/goutham432/Driver_License_App/settings/secrets/actions
2. **Verify:** `DIGITALOCEAN_ACCESS_TOKEN` exists
3. **Check:** The value is your DigitalOcean API token (`dop_v1_...`)

### Step 2: Verify DigitalOcean Token Permissions

1. **Go to:** https://cloud.digitalocean.com/account/api/tokens
2. **Check your token:**
   - Should have **Read** and **Write** permissions
   - Should not be expired
3. **If needed:** Regenerate token with full permissions

### Step 3: Verify Container Registry Exists

1. **Go to:** https://cloud.digitalocean.com/registry
2. **Verify:** Registry named `driver-license-registry` exists
3. **If not:** Create it:
   - Name: `driver-license-registry`
   - Plan: Basic ($5/month)
   - Region: Closest to you

### Step 4: Verify Registry Name in Workflow

**Check:** `.github/workflows/deploy.yml`

The image tag should match your registry name:
```yaml
tags: registry.digitalocean.com/driver-license-registry/driver-license-app:latest
```

**If your registry has a different name:**
1. Update the workflow file
2. Update `k8s/app-deployment.yaml` image reference

---

## 🔄 Alternative Solution (If doctl Doesn't Work)

If `doctl registry login` still fails, use manual docker login:

```yaml
- name: Log in to DigitalOcean Container Registry
  run: |
    echo "${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}" | docker login registry.digitalocean.com -u ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} --password-stdin
```

**Update the workflow file if needed!**

---

## ✅ Verification

After fixing, test the workflow:

1. **Go to:** https://github.com/goutham432/Driver_License_App/actions
2. **Click:** "Deploy to DigitalOcean Kubernetes"
3. **Click:** "Run workflow"
4. **Watch:** The "Log in to DigitalOcean Container Registry" step should succeed

**Expected Output:**
```
✅ Logged in to registry.digitalocean.com
```

---

## 📋 Checklist

- [ ] GitHub secret `DIGITALOCEAN_ACCESS_TOKEN` is set
- [ ] DigitalOcean API token has Read/Write permissions
- [ ] Container Registry `driver-license-registry` exists
- [ ] Workflow uses `doctl registry login` (already fixed)
- [ ] Registry name matches in workflow and deployment files

---

## 🎯 Quick Fix Summary

**The workflow has been updated!** Just:

1. **Verify GitHub Secret:**
   - Go to: https://github.com/goutham432/Driver_License_App/settings/secrets/actions
   - Ensure `DIGITALOCEAN_ACCESS_TOKEN` is set with your DigitalOcean API token
   - Get token from: https://cloud.digitalocean.com/account/api/tokens

2. **Re-run Workflow:**
   - Go to: https://github.com/goutham432/Driver_License_App/actions
   - Click on failed workflow
   - Click "Re-run all jobs"

**The authentication should now work!** ✅

---

**The workflow file has been fixed and pushed to GitHub!**

