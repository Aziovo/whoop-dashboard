# Local Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

Fill in from your `.env.local`:
```
VITE_WHOOP_CLIENT_ID=21829aab-20ce-492d-81dd-9d302aa75b05
VITE_WHOOP_CLIENT_SECRET=ba494079d86f756c5a4cb4cdb2e6bc38d48c29b8d350ca39d5d3baf01384bfc8
VITE_WHOOP_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 3. Start OAuth Proxy (Terminal 1)
```bash
npm run server
```

This starts the local OAuth proxy on http://localhost:4000

### 4. Start Development Server (Terminal 2)
```bash
npm run dev
```

This starts Vite on http://localhost:3000

### 5. Open Dashboard
Visit http://localhost:3000 in your browser

## Architecture

### Local Development
```
Browser (localhost:3000)
    ↓
Vite Dev Server (React app)
    ↓
OAuth Proxy (localhost:4000/api/auth/callback)
    ↓
Whoop API (api.prod.whoop.com/oauth/token)
```

### Production (Vercel)
```
Browser (www.ekoonict.com)
    ↓
Vercel (React built static + serverless)
    ↓
Serverless Function (/api/auth/callback)
    ↓
Whoop API (api.prod.whoop.com/oauth/token)
```

## Testing OAuth Flow

1. **Click "Whoop Account Verbinden"** button on dashboard
2. **Redirects to Whoop login** (if not logged in)
3. **Authorize the app** with your Whoop account
4. **Redirects back** to http://localhost:3000/auth/callback?code=XXX
5. **Frontend exchanges code** via proxy to get tokens
6. **Dashboard populates** with real Whoop data

## Demo Data Fallback

If OAuth fails or you don't have a Whoop account:
- Dashboard auto-loads demo data
- Shows realistic metrics & charts
- Perfect for UI testing

To force demo data: Check `WhoopContext.jsx` for the fallback logic

## Available Scripts

```bash
npm run dev      # Start Vite dev server (localhost:3000)
npm run build    # Production build
npm run preview  # Preview built app locally
npm run server   # Start OAuth proxy (localhost:4000)
npm run lint     # ESLint check
```

## Troubleshooting

### OAuth Fails / "Invalid redirect_uri"
- Check `.env.local` has correct `VITE_WHOOP_REDIRECT_URI`
- Verify `server.js` is running on port 4000
- Clear browser cookies/cache
- Check Whoop app settings for redirect URI

### "Cannot GET /auth/callback"
- OAuth proxy (`server.js`) not running
- Start with: `npm run server`

### CORS Errors
- Both servers must be running
- Vite on 3000, proxy on 4000
- Check console for specific error

### Demo Data Shows Instead of Real Data
- Normal when not authenticated
- Click "Whoop Account Verbinden" to authenticate
- Or check browser console for auth errors

## Environment Variables Reference

| Variable | Dev | Prod | Purpose |
|----------|-----|------|---------|
| `VITE_WHOOP_CLIENT_ID` | localhost:3000 | www.ekoonict.com | Whoop app client ID |
| `VITE_WHOOP_CLIENT_SECRET` | localhost:3000 | www.ekoonict.com | Whoop app secret (never frontend) |
| `VITE_WHOOP_REDIRECT_URI` | http://localhost:3000/auth/callback | https://www.ekoonict.com/auth/callback | Where Whoop redirects after auth |

**Note:** Client secret is only stored in backend (server.js for dev, Vercel env for prod). Never exposed to frontend.
