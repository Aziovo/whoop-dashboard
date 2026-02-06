# GitHub Integration Guide

When merging into EkoonICTWebsite, follow these steps:

## Option 1: As Subdirectory (Recommended)

### Structure
```
EkoonICTWebsite/
├── apps/whoop-dashboard/
│   ├── src/
│   ├── api/
│   ├── package.json
│   ├── vercel.json
│   └── ...
├── web/                    (if main website exists)
└── package.json            (monorepo root)
```

### Steps
1. Create `EkoonICTWebsite/apps/whoop-dashboard/` directory
2. Copy all files from this project there
3. Update root `vercel.json` to include monorepo config
4. Push to GitHub

### Root Vercel Config (`EkoonICTWebsite/vercel.json`)
```json
{
  "projects": [
    {
      "name": "whoop-dashboard",
      "path": "apps/whoop-dashboard"
    }
  ]
}
```

## Option 2: As Separate Repo

Keep whoop-dashboard in its own repo, deploy separately:
- Repo: `EkoonICT/whoop-dashboard`
- Deploy to: `dashboard.ekoonict.com` or `whoop.ekoonict.com`

## GitHub Setup

### 1. Push Code
```bash
cd EkoonICTWebsite
git add .
git commit -m "feat: Add Whoop Dashboard"
git push origin main
```

### 2. Connect to Vercel
- Go to vercel.com/dashboard
- Import GitHub repo: `EkoonICT/EkoonICTWebsite`
- Select project root or subdirectory based on option above
- Click "Deploy"

### 3. Set Environment Variables
In Vercel Project Settings → Environment Variables:

```
VITE_WHOOP_CLIENT_ID=21829aab-20ce-492d-81dd-9d302aa75b05
VITE_WHOOP_CLIENT_SECRET=ba494079d86f756c5a4cb4cdb2e6bc38d48c29b8d350ca39d5d3baf01384bfc8
VITE_WHOOP_REDIRECT_URI=https://www.ekoonict.com/auth/callback
```

**Important:** Don't expose client secret in `.env.local` on GitHub. Use `.gitignore`:
```
.env.local
.env.*.local
```

### 4. Configure Build
In Vercel Project Settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Auto-Deployment

Once connected to GitHub:
1. Any push to `main` branch → automatic deployment
2. PR previews available
3. Monitor in Vercel dashboard

## Post-Deployment

### Update Whoop OAuth Settings
In Whoop Dashboard:
1. Go to your Whoop app settings
2. Update Redirect URI:
   - Old: `http://localhost:3000/auth/callback`
   - New: `https://www.ekoonict.com/auth/callback`

### Test OAuth Flow
1. Visit https://www.ekoonict.com
2. Click "Whoop Account Verbinden"
3. Authorize with Whoop credentials
4. Verify dashboard loads live data

## Troubleshooting

### Build Fails
- Check Node version (use 18+)
- Verify all dependencies: `npm install`
- Check `.env.production` has correct values

### OAuth Redirect Error
- Verify Whoop app settings match deployment URL
- Check Vercel environment variables are set
- Clear browser cookies

### Serverless Function 404
- Verify `/api/auth/callback.js` exists
- Check Vercel logs for deployment errors
- Confirm framework set to Vite

## Branches & Workflows

Recommend protecting `main` branch:
- Require PR reviews
- Run tests/lint before merge
- Auto-deploy on merge

For development:
```bash
git checkout -b feature/whoop-dashboard
# make changes
git push origin feature/whoop-dashboard
# open PR on GitHub
# merge after review
# Vercel auto-deploys
```
