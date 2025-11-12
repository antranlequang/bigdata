# ⚡ Deployment Checklist - 5-Minute Deploy

Quick verification checklist for fastest Vercel deployment.

## 🏃‍♂️ Pre-Deployment (1 minute)

```bash
# Quick validation
npm run prebuild        # Fix import paths
npm run build          # Test local build
npm run git:validate   # Check repo size
```

**✅ Checklist:**
- [ ] Build completes without errors
- [ ] Repository size < 10MB (excluding ignored files)  
- [ ] All import paths are relative (not absolute @/ paths)
- [ ] No console errors in development

---

## 🚀 Deploy Commands (2 minutes)

### Option 1: One-Command Deploy
```bash
npm run deploy:prod
```

### Option 2: Manual Vercel CLI
```bash
vercel --prod
```

### Option 3: GitHub Auto-Deploy
```bash
git add .
git commit -m "Deploy optimized crypto dashboard"
git push origin main
```

---

## 🔧 Environment Variables (1 minute)

**Set in Vercel Dashboard → Project Settings → Environment Variables:**

| Variable | Value | Production |
|----------|-------|------------|
| `MINIO_ENDPOINT` | `play.min.io` | ✅ |
| `MINIO_ACCESS_KEY` | `Q3AM3UQ867SPQQA43P2F` | ✅ |
| `MINIO_SECRET_KEY` | `zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG` | ✅ |
| `MINIO_USE_SSL` | `true` | ✅ |
| `MINIO_BUCKET` | `crypto-data` | ✅ |

---

## ✅ Post-Deploy Verification (1 minute)

```bash
# Test main site
curl https://your-domain.vercel.app

# Test API health  
curl https://your-domain.vercel.app/api/health

# Test crypto data
curl https://your-domain.vercel.app/api/crypto?coinId=bitcoin

# Test Python services
curl https://your-domain.vercel.app/api/python/forecast?coinId=bitcoin
```

**✅ Success Indicators:**
- [ ] Main dashboard loads
- [ ] Charts display data
- [ ] API health returns success
- [ ] MinIO data accessible
- [ ] No console errors

---

## 🚨 Quick Troubleshooting

### Build Failing?
```bash
npm run prebuild && npm run build
```

### Import Errors?
```bash
node scripts/fix-imports.js
```

### Environment Issues?
```bash
vercel env ls
```

### Data Not Loading?
```bash
# Test MinIO connection
curl https://your-domain.vercel.app/api/crypto?coinId=bitcoin
```

---

## ⏱️ Expected Timeline

| Phase | Duration | Task |
|-------|----------|------|
| **Pre-check** | 30s | Build validation |
| **Deploy** | 2-3 min | Vercel build & deploy |  
| **ENV Setup** | 30s | Environment variables |
| **Verification** | 30s | Health checks |
| **🎉 Total** | **4-5 min** | Live dashboard! |

---

## 📱 Live URLs

After deployment:
- **Dashboard**: `https://your-domain.vercel.app`
- **API Health**: `https://your-domain.vercel.app/api/health`
- **Crypto Data**: `https://your-domain.vercel.app/api/crypto`
- **Forecasts**: `https://your-domain.vercel.app/api/python/forecast`

**🎯 Your crypto dashboard deploys in under 5 minutes with zero configuration!**