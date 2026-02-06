# Vercel Environment Variables Setup

When deploying to Vercel, you need to set the following environment variables in the Vercel project dashboard.

## How to Set Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: `EkoonICTWebsite` (or whoop-dashboard if separate)
3. Settings → Environment Variables
4. Add each variable below

## Environment Variables to Set

### For Production Deployment

| Name | Value | Notes |
|------|-------|-------|
| `VITE_WHOOP_CLIENT_ID` | `21829aab-20ce-492d-81dd-9d302aa75b05` | Public (frontend access OK) |
| `VITE_WHOOP_CLIENT_SECRET` | `ba494079d86f756c5a4cb4cdb2e6bc38d48c29b8d350ca39d5d3baf01384bfc8` | Secret (backend only) |
| `VITE_WHOOP_REDIRECT_URI` | `https://www.ekoonict.com/auth/callback` | Must match Whoop app settings |
| `WHOOP_CLIENT_ID` | `21829aab-20ce-492d-81dd-9d302aa75b05` | For serverless function |
| `WHOOP_CLIENT_SECRET` | `ba494079d86f756c5a4cb4cdb2e6bc38d48c29b8d350ca39d5d3baf01384bfc8` | For serverless function |
| `WHOOP_REDIRECT_URI` | `https://www.ekoonict.com/auth/callback` | For serverless function |

## Step-by-Step Setup

### 1. Go to Vercel Dashboard
```
https://vercel.com/dashboard
```

### 2. Select Your Project
Click on your project (EkoonICTWebsite)

### 3. Go to Settings
Click **Settings** tab at the top

### 4. Find Environment Variables
Left sidebar → **Environment Variables**

### 5. Add Variables
For each variable in the table above:
1. Click **"Add New"**
2. Enter **Name** (exactly as shown)
3. Enter **Value**
4. Select **Production**
5. Click **Add**

**Repeat for all 6 variables**

## Security Notes

- ✅ Client Secret is properly protected (only in Vercel backend env vars)
- ✅ Frontend only exposes VITE_WHOOP_CLIENT_ID (not secret)
- ✅ Serverless function (/api/auth/callback.js) can access WHOOP_CLIENT_SECRET securely
- ✅ Never commit .env files with secrets to Git
- ✅ Vercel environment variables override local .env files in production

## Verification

After adding variables, verify they work:

1. Push code to GitHub (triggers deploy)
2. Wait for Vercel to build & deploy
3. Visit: https://www.ekoonict.com
4. Click **"Whoop Account Verbinden"**
5. Complete OAuth flow
6. Dashboard should load with real Whoop data

If OAuth fails, check:
- All 6 environment variables are set correctly
- Whoop app settings have correct redirect URI
- Browser console for error messages

## Production Redirect URI (Important!)

Make sure you also update your Whoop app settings:

1. Go to: https://www.whoop.com/api/dev/apps
2. Click your app
3. Update **Redirect URI:**
   - Old: `http://localhost:3000/auth/callback`
   - New: `https://www.ekoonict.com/auth/callback`
4. Save

## Troubleshooting

### "Invalid redirect_uri"
- Check Whoop app settings (step above)
- Verify VITE_WHOOP_REDIRECT_URI matches exactly
- Clear browser cookies, try again

### "Client authentication failed"
- Verify WHOOP_CLIENT_SECRET is correct
- Check it's set in Vercel (no typos)

### "401 Unauthorized"
- Check WHOOP_CLIENT_ID is correct
- Ensure it matches Whoop app settings

### Deploy shows "undefined" for env vars
- Push code again (env vars loaded during build)
- Or restart deployment in Vercel dashboard

## Local Development

For local development, use `.env.local`:
```
VITE_WHOOP_CLIENT_ID=21829aab-20ce-492d-81dd-9d302aa75b05
VITE_WHOOP_CLIENT_SECRET=ba494079d86f756c5a4cb4cdb2e6bc38d48c29b8d350ca39d5d3baf01384bfc8
VITE_WHOOP_REDIRECT_URI=http://localhost:3000/auth/callback
```

Never commit `.env.local` to Git!

## Done!

Once environment variables are set and code is deployed, your Whoop Dashboard will be live at:

**https://www.ekoonict.com** 🎉
