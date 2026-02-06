# 🔧 Complete Setup Gids - Whoop Dashboard

## Inhoudsopgave

1. [Lokale Development Setup](#1-lokale-development-setup)
2. [Whoop Developer Account](#2-whoop-developer-account)
3. [Environment Configuratie](#3-environment-configuratie)
4. [Eerste Start](#4-eerste-start)
5. [Vercel Deployment](#5-vercel-deployment)
6. [Whoop Webhooks (Optioneel)](#6-whoop-webhooks-optioneel)

---

## 1. Lokale Development Setup

### Vereisten

- Node.js 18+ ([download](https://nodejs.org/))
- npm of yarn
- Git
- Modern browser (Chrome/Firefox/Safari)
- Whoop account (voor API toegang)

### Installatie Stappen

```bash
# 1. Clone repository
git clone <your-repo-url>
cd whoop-dashboard

# 2. Install dependencies
npm install

# Dit installeert:
# - React 18
# - Vite
# - TailwindCSS
# - Recharts
# - React Router
# - Lucide Icons
# - date-fns

# 3. Kopieer environment template
cp .env.example .env

# 4. Open .env en vul later je Whoop credentials in
```

---

## 2. Whoop Developer Account

### Stap 1: Whoop Developer Portal

1. Ga naar **[developer.whoop.com](https://developer.whoop.com/dashboard)**
2. Log in met je bestaande Whoop account
3. Als je geen Whoop hebt: registreer eerst op whoop.com (gratis trial beschikbaar)

### Stap 2: Nieuwe Application Maken

Klik op **"Create Application"** en vul in:

#### Application Details

```
Name: Whoop Dashboard
Description: Personal productivity and health dashboard with Whoop integration
```

#### Redirect URIs

Voeg **beide** toe (development + production):

```
http://localhost:3000/auth/callback
https://your-app.vercel.app/auth/callback
```

*(Pas later de Vercel URL aan als je die hebt)*

#### Scopes (Permissions)

Selecteer alle volgende scopes:

- ✅ **read:profile** - User profile data
- ✅ **read:recovery** - Recovery scores, HRV, RHR
- ✅ **read:cycles** - Recovery cycles data
- ✅ **read:workout** - Strain en workout data
- ✅ **read:sleep** - Sleep duration, efficiency, quality
- ✅ **read:body_measurement** - Height, weight, etc.
- ✅ **offline** - Refresh tokens (belangrijk!)

### Stap 3: Credentials Opslaan

Na het maken krijg je:

```
Client ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ BELANGRIJK:**
- Client Secret is **GEHEIM** - deel nooit!
- Bewaar veilig (password manager)
- Voeg NOOIT toe aan Git

---

## 3. Environment Configuratie

### Development (.env)

Open `.env` en vul in:

```env
# Whoop API Configuration
VITE_WHOOP_CLIENT_ID=jouw_client_id_hier
VITE_WHOOP_CLIENT_SECRET=jouw_client_secret_hier
VITE_WHOOP_REDIRECT_URI=http://localhost:3000/auth/callback

# Whoop API Endpoints (default - niet aanpassen)
VITE_WHOOP_AUTH_URL=https://api.prod.whoop.com/oauth/authorize
VITE_WHOOP_TOKEN_URL=https://api.prod.whoop.com/oauth/token
VITE_WHOOP_API_BASE=https://api.prod.whoop.com/v2
```

### Vercel Production

Later voeg je deze toe in Vercel dashboard:

```env
VITE_WHOOP_CLIENT_ID=jouw_client_id_hier
VITE_WHOOP_CLIENT_SECRET=jouw_client_secret_hier
VITE_WHOOP_REDIRECT_URI=https://your-app.vercel.app/auth/callback
```

---

## 4. Eerste Start

### Start Development Server

```bash
npm run dev
```

Je ziet:

```
  VITE v5.0.8  ready in 423 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Test de App

1. Open **http://localhost:3000**
2. Je ziet de Home pagina met demo data
3. Navigeer naar **Whoop** pagina
4. Klik **"Verbinden met Whoop"**

### OAuth Test Flow

```
1. Klik "Verbinden met Whoop"
   ↓
2. Browser opent Whoop login pagina
   ↓
3. Log in met je Whoop account
   ↓
4. Geef toegang (authorize)
   ↓
5. Terug naar app (/auth/callback)
   ↓
6. "Succesvol verbonden!" 🎉
   ↓
7. Realtime data wordt geladen
```

### Verifieer Data

Ga naar **Whoop** pagina en check:

- ✅ Recovery score zichtbaar
- ✅ Slaap data geladen
- ✅ Strain grafieken werken
- ✅ HRV trend lijn
- ✅ Geen "Demo Data" badge meer

---

## 5. Vercel Deployment

### Optie A: GitHub Import (Aanbevolen)

#### Stap 1: Push naar GitHub

```bash
# Initialize Git (als nog niet gedaan)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Whoop Dashboard v1.0"

# Create GitHub repo en voeg remote toe
git remote add origin https://github.com/username/whoop-dashboard.git

# Push
git push -u origin main
```

#### Stap 2: Vercel Project

1. Ga naar **[vercel.com](https://vercel.com)** en log in
2. Klik **"New Project"**
3. Import je GitHub repository
4. Vercel detecteert automatisch:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Stap 3: Environment Variables

In **Settings** → **Environment Variables** voeg toe:

| Name | Value |
|------|-------|
| `VITE_WHOOP_CLIENT_ID` | `jouw_client_id` |
| `VITE_WHOOP_CLIENT_SECRET` | `jouw_client_secret` |
| `VITE_WHOOP_REDIRECT_URI` | `https://your-app.vercel.app/auth/callback` |

**Tip**: Voor alle environments (Production, Preview, Development)

#### Stap 4: Deploy

1. Klik **Deploy**
2. Wacht ~2 minuten
3. Je app is live! 🚀

**URL**: `https://your-app-name.vercel.app`

#### Stap 5: Update Whoop Redirect URI

Ga terug naar [developer.whoop.com](https://developer.whoop.com/dashboard):

1. Open je application
2. Voeg toe aan **Redirect URIs**:
   ```
   https://your-app-name.vercel.app/auth/callback
   ```
3. Save changes

### Optie B: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy (test)
vercel

# Production deploy
vercel --prod
```

Follow prompts:
- Link to existing project? **No**
- Project name? **whoop-dashboard**
- Directory? **./whoop-dashboard**

Set environment variables via CLI:

```bash
vercel env add VITE_WHOOP_CLIENT_ID
vercel env add VITE_WHOOP_CLIENT_SECRET
vercel env add VITE_WHOOP_REDIRECT_URI
```

---

## 6. Whoop Webhooks (Optioneel)

Voor realtime updates zonder polling.

### Setup Webhook Endpoint

**Vereist**: Backend server (niet in deze setup)

Als je een backend toevoegt (bijv. Express.js):

```javascript
// server.js
app.post('/api/whoop/webhook', (req, res) => {
  const { event_type, data } = req.body
  
  // Process webhook data
  switch(event_type) {
    case 'recovery.updated':
      // Update recovery data
      break
    case 'sleep.updated':
      // Update sleep data
      break
  }
  
  res.status(200).send('OK')
})
```

### Register Webhook in Whoop

1. Ga naar Whoop Developer Dashboard
2. Select je application
3. Add **Webhook URL**:
   ```
   https://your-api.com/api/whoop/webhook
   ```
4. Select events:
   - `recovery.updated`
   - `sleep.updated`
   - `workout.updated`

### Webhook Security

Verify requests met signature:

```javascript
const crypto = require('crypto')

function verifyWebhook(req) {
  const signature = req.headers['x-whoop-signature']
  const payload = JSON.stringify(req.body)
  const hash = crypto
    .createHmac('sha256', process.env.WHOOP_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
  
  return signature === hash
}
```

---

## 🎉 Je bent klaar!

Checklist:

- ✅ Lokale development draait
- ✅ Whoop account verbonden
- ✅ Data wordt geladen
- ✅ Deployed op Vercel
- ✅ Production URL werkt

### Volgende Stappen

1. **Personaliseer** - Ga naar Settings en vul je profiel in
2. **Data toevoegen** - Maak taken, events, vakken, projecten
3. **Whoop monitoren** - Check dagelijks je recovery en slaap
4. **Exporteer** - Maak regelmatig backups (Settings → Data)

---

## 🆘 Hulp Nodig?

### Common Issues

**"OAuth error: invalid_client"**
- Check of Client ID en Secret correct zijn
- Verify redirect URI exact matcht (inclusief http/https)

**"Demo data actief" blijft staan**
- Ververs de pagina
- Check browser console voor errors
- Verify tokens in localStorage (DevTools → Application → Local Storage)

**Build fails op Vercel**
- Check alle environment variables zijn ingesteld
- Verify Node version (18+)
- Check build logs voor specifieke errors

### Resources

- 📚 [Whoop API Docs](https://developer.whoop.com/docs/developing)
- 🚀 [Vercel Docs](https://vercel.com/docs)
- ⚛️ [React Docs](https://react.dev)
- 🎨 [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Happy Hacking! 💪**
