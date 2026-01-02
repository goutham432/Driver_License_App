# GitHub Actions CI/CD Setup Guide
## Configure GitHub Actions for DOKS Deployment

---

## Problem

The GitHub Actions workflow is failing with:
```
Error: Username and password required
```

This happens because the `DIGITALOCEAN_ACCESS_TOKEN` secret is not configured in GitHub.

---

## Solution: Add GitHub Secrets

### Step 1: Get DigitalOcean API Token

1. **Go to:** https://cloud.digitalocean.com/account/api/tokens
2. **Click:** "Generate New Token"
3. **Settings:**
   - **Token name:** `DOKS-Deployment-Token`
   - **Expiration:** No expiration (or 90 days)
4. **Click:** "Generate Token"
5. **COPY THE TOKEN** - It looks like: `dop_v1_xxxxxxxxxxxxxxxxxxxx`

### Step 2: Add Secret to GitHub

1. **Go to your repository:** https://github.com/goutham432/Driver_License_App
2. **Click:** Settings (top menu)
3. **Click:** Secrets and variables → Actions
4. **Click:** "New repository secret"
5. **Add Secret:**
   - **Name:** `DIGITALOCEAN_ACCESS_TOKEN`
   - **Value:** Paste your DigitalOcean API token (from Step 1)
6. **Click:** "Add secret"

### Step 3: Verify Secret is Added

- You should see `DIGITALOCEAN_ACCESS_TOKEN` in the secrets list
- The value will be hidden (shows as `••••••••`)

---

## What the Workflow Does

The GitHub Actions workflow (`/.github/workflows/deploy.yml`) automatically:

1. **On Push to Main:**
   - Checks out your code
   - Builds Docker image
   - Pushes to DigitalOcean Container Registry
   - Deploys to DOKS cluster

2. **Steps:**
   - ✅ Checkout code
   - ✅ Set up Docker Buildx
   - ✅ Log in to DigitalOcean Registry (needs `DIGITALOCEAN_ACCESS_TOKEN`)
   - ✅ Build and push Docker image
   - ✅ Install kubectl and doctl
   - ✅ Connect to DOKS cluster
   - ✅ Deploy application
   - ✅ Verify deployment

---

## Testing the Workflow

### Option 1: Manual Trigger

1. **Go to:** https://github.com/goutham432/Driver_License_App/actions
2. **Click:** "Deploy to DigitalOcean Kubernetes" workflow
3. **Click:** "Run workflow" (right side)
4. **Select branch:** `main`
5. **Click:** "Run workflow"

### Option 2: Push a Change

1. **Make a small change:**
   ```powershell
   echo "Test CI/CD" >> README.md
   ```

2. **Commit and push:**
   ```powershell
   git add README.md
   git commit -m "Test GitHub Actions workflow"
   git push origin main
   ```

3. **Watch workflow:**
   - Go to: https://github.com/goutham432/Driver_License_App/actions
   - You should see the workflow running!

---

## Troubleshooting

### Error: "Username and password required"

**Cause:** `DIGITALOCEAN_ACCESS_TOKEN` secret not configured

**Solution:**
1. Follow Step 2 above to add the secret
2. Make sure the secret name is exactly: `DIGITALOCEAN_ACCESS_TOKEN`
3. Re-run the workflow

### Error: "Image pull error"

**Cause:** Docker image not found in registry

**Solution:**
1. Make sure you've created the Container Registry in DigitalOcean
2. Update the image name in `.github/workflows/deploy.yml` to match your registry name
3. Make sure the registry name is correct: `driver-license-registry`

### Error: "Cluster not found"

**Cause:** DOKS cluster doesn't exist or wrong name

**Solution:**
1. Update cluster name in `.github/workflows/deploy.yml`:
   ```yaml
   run: doctl kubernetes cluster kubeconfig save YOUR-CLUSTER-NAME
   ```
2. Make sure the cluster exists in DigitalOcean

### Error: "Namespace not found"

**Cause:** Namespace doesn't exist in cluster

**Solution:**
1. Create namespace manually:
   ```powershell
   kubectl create namespace driver-license-platform
   ```
2. Or add to workflow:
   ```yaml
   - name: Create namespace
     run: kubectl create namespace driver-license-platform --dry-run=client -o yaml | kubectl apply -f -
   ```

---

## Workflow Configuration

The workflow is configured in: `.github/workflows/deploy.yml`

**Key Settings:**
- **Triggers:** Push to `main` branch or manual
- **Registry:** `registry.digitalocean.com/driver-license-registry`
- **Image:** `driver-license-app:latest`
- **Cluster:** `driver-license-cluster`
- **Namespace:** `driver-license-platform`

**Update these if your setup differs!**

---

## Security Best Practices

1. **Never commit tokens to code** ✅ (Using GitHub Secrets)
2. **Use least privilege tokens** ✅ (Only needed permissions)
3. **Rotate tokens regularly** ✅ (Every 90 days)
4. **Monitor workflow runs** ✅ (Check Actions tab regularly)

---

## Next Steps

1. ✅ Add `DIGITALOCEAN_ACCESS_TOKEN` secret
2. ✅ Test workflow (manual trigger or push)
3. ✅ Verify deployment on DOKS
4. ✅ Monitor workflow runs

---

**Once the secret is added, your CI/CD pipeline will work automatically! 🚀**

