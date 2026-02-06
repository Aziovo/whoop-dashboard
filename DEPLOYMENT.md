# 🚀 Deployment Guide - Whoop Dashboard

Complete guide voor het deployen van je Whoop Dashboard naar productie.

## 📋 Pre-Deployment Checklist

- [ ] All dependencies updated (`npm update`)
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Whoop OAuth credentials ready
- [ ] Production redirect URI set in Whoop Dashboard
- [ ] Tests passing (if available)

## 🔄 Vercel (Recommended - Easiest)

### 1. Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Whoop Dashboard"

# Create GitHub repository (or push to existing)
git remote add origin https://github.com/yourusername/whoop-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select project (whoop-dashboard)
5. Click "Import"

**Option B: Via CLI**

```bash
npm i -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add these variables:

```
VITE_WHOOP_CLIENT_ID=your_actual_client_id
VITE_WHOOP_CLIENT_SECRET=your_actual_client_secret
VITE_WHOOP_REDIRECT_URI=https://your-project.vercel.app/callback
VITE_API_BASE_URL=https://api.whoop.com/api/v2
```

3. Click "Save"

### 4. Update Whoop Dashboard

In [Whoop Developer Portal](https://developer.whoop.com/dashboard):

1. Edit your app
2. Update Redirect URI to: `https://your-project.vercel.app/callback`
3. Save

### 5. Redeploy

```bash
vercel --prod
```

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app
COPY . .

# Build
RUN npm run build

# Serve with a simple HTTP server
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### 2. Create .dockerignore

```
node_modules
npm-debug.log
dist
.git
.env.local
.DS_Store
```

### 3. Build & Run

```bash
# Build image
docker build -t whoop-dashboard .

# Run container
docker run -p 3000:3000 \
  -e VITE_WHOOP_CLIENT_ID=your_id \
  -e VITE_WHOOP_CLIENT_SECRET=your_secret \
  -e VITE_WHOOP_REDIRECT_URI=http://localhost:3000/callback \
  whoop-dashboard

# Access at http://localhost:3000
```

## 🐙 GitHub Pages

### 1. Configure package.json

```json
{
  "homepage": "https://yourusername.github.io/whoop-dashboard",
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^4.0.0"
  }
}
```

### 2. Update vite.config.js

```javascript
export default {
  base: '/whoop-dashboard/', // Add this
  // ... rest of config
}
```

### 3. Deploy

```bash
npm install gh-pages --save-dev
npm run deploy
```

## ☁️ Netlify

### 1. Via Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select GitHub repository
4. Configure build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

### 2. Add Environment Variables

1. Site settings → Build & Deploy → Environment
2. Add variables:
   ```
   VITE_WHOOP_CLIENT_ID
   VITE_WHOOP_CLIENT_SECRET
   VITE_WHOOP_REDIRECT_URI=https://your-site.netlify.app/callback
   ```

### 3. Configure Redirect Rules

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_WHOOP_CLIENT_ID = "your-id"
  VITE_WHOOP_CLIENT_SECRET = "your-secret"
```

## 🔐 Security Checklist

### Before Going Live

- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (all platforms do by default)
- [ ] Set secure CORS headers
- [ ] Validate all user inputs
- [ ] Use strong tokens/keys
- [ ] Keep dependencies updated
- [ ] Enable 2FA on hosting account

### Environment Variables

```javascript
// DON'T do this:
const API_KEY = "sk_live_123456";

// DO this instead:
const API_KEY = import.meta.env.VITE_WHOOP_CLIENT_ID;
```

## 🧪 Testing Before Deploy

```bash
# Build locally
npm run build

# Preview build
npm run preview

# Check bundle size
npm run build -- --report

# Test in production mode
npm run preview
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install & Build
        run: |
          npm install
          npm run build
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📊 Monitoring & Analytics

### Add Analytics

```javascript
// src/analytics.js
export const trackEvent = (name, data) => {
  if (window.gtag) {
    window.gtag('event', name, data);
  }
};
```

In `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### OAuth Redirect Error

- Check Redirect URI matches exactly
- Include protocol (http:// or https://)
- No trailing slashes

### CORS Errors

Add proxy in development (`vite.config.js`):

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.whoop.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
```

### Performance Issues

```bash
# Analyze bundle
npm run build -- --analyze

# Check for large dependencies
npm list --depth=0

# Consider code splitting
```

## 📈 Performance Optimization

```javascript
// Use React.lazy for code splitting
const Whoop = React.lazy(() => import('./components/Whoop'));

// Optimize images
// Use webp format
// Lazy load images

// Enable compression
// Gzip on your server
```

## 🔔 Post-Deployment

1. ✅ Test all features
2. ✅ Verify Whoop OAuth flow
3. ✅ Check mobile responsiveness
4. ✅ Monitor error logs
5. ✅ Setup monitoring alerts
6. ✅ Document any issues

## 📞 Support

Need help? Check these resources:

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Whoop API Support](https://developer.whoop.com/support)
- [React Documentation](https://react.dev)

---

**Gefeliciteerd! Je Whoop Dashboard is live! 🎉**
