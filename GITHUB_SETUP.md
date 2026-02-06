# 📦 GitHub & Vercel Setup Guide

Complete stap-voor-stap gids voor het pushen van je Whoop Dashboard naar GitHub en deployen op Vercel.

## 🔧 Prerequisites

Installeer deze tools:

1. **Git**: https://git-scm.com/download
2. **GitHub Account**: https://github.com/signup (gratis)
3. **Vercel Account**: https://vercel.com/signup (gratis)

## 📝 Stap 1: GitHub Repository Aanmaken

### 1.1 Create Repository

1. Log in op [github.com](https://github.com)
2. Klik `+` → "New repository"
3. Vul in:
   - **Repository name**: `whoop-dashboard`
   - **Description**: "Complete Whoop Health & Productivity Dashboard"
   - **Visibility**: Public (om met iedereen te delen)
   - **Initialize**: Klik NIET "Initialize this repository"
4. Klik "Create repository"

### 1.2 Get Repository URL

Na aanmaken zie je een URL zoals:
```
https://github.com/yourusername/whoop-dashboard.git
```

Kopieer dit voor later.

## 📤 Stap 2: Push Code naar GitHub

### 2.1 Configure Git (eerste keer)

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 2.2 Initialize & Push

```bash
cd /Users/ekoonai/.openclaw/workspace/whoop-dashboard

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Complete Whoop Dashboard with API integration"

# Add remote (replace YOUR_URL)
git remote add origin https://github.com/yourusername/whoop-dashboard.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 2.3 Verify on GitHub

1. Go to https://github.com/yourusername/whoop-dashboard
2. Verify all files are there
3. Click green "Code" button - copy HTTPS URL

## 🚀 Stap 3: Deploy naar Vercel

### 3.1 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign up" (use GitHub account for easier setup)
3. Click "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### 3.2 Create Project

1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Paste your GitHub URL or select from list
4. Click "Import"

### 3.3 Configure Project

When you see the import screen:

- **Project Name**: whoop-dashboard
- **Framework**: Vite
- **Root Directory**: ./

Click "Continue"

### 3.4 Environment Variables

This is **IMPORTANT** - Add your Whoop credentials:

1. Scroll to "Environment Variables"
2. Add these 4 variables:

```
VITE_WHOOP_CLIENT_ID
Value: (your actual Client ID from Whoop)

VITE_WHOOP_CLIENT_SECRET
Value: (your actual Client Secret from Whoop)

VITE_WHOOP_REDIRECT_URI
Value: https://whoop-dashboard-yourname.vercel.app/callback

VITE_API_BASE_URL
Value: https://api.whoop.com/api/v2
```

3. Click "Deploy"

### 3.5 Wait for Build

Vercel will:
1. Clone your GitHub repo
2. Install dependencies
3. Build the project
4. Deploy to production

Monitor the build process - it should take 2-5 minutes.

### 3.6 Get Your URL

When complete, you'll see:
```
✅ Production: https://whoop-dashboard-yourname.vercel.app
```

Copy this URL - it's your live dashboard!

## 🔐 Stap 4: Update Whoop OAuth Settings

Now you need to tell Whoop your live redirect URI:

1. Go to [Whoop Developer Portal](https://developer.whoop.com/dashboard)
2. Click on your app
3. Edit settings:
   - Find "Redirect URI"
   - Add your Vercel URL: `https://whoop-dashboard-yourname.vercel.app/callback`
4. Save changes

## ✨ Stap 5: Test Your Live Dashboard

1. Go to: `https://whoop-dashboard-yourname.vercel.app`
2. Navigate to Settings
3. Click "Whoop Account Verbinden"
4. Log in with your Whoop account
5. Authorize the app
6. Check if data loads!

## 📝 Git Workflow - Regular Updates

### When You Make Changes

```bash
# 1. Make changes to files
# (edit src/components/Home.jsx, etc.)

# 2. Commit changes
git add .
git commit -m "Feature: Add dark mode toggle"

# 3. Push to GitHub
git push origin main

# 4. Vercel automatically deploys!
# Check your live site - changes appear in ~2 min
```

### Example Workflow

```bash
# Update something
nano src/components/Home.jsx  # Make edits

# Check what changed
git status

# Stage & commit
git add src/components/Home.jsx
git commit -m "Fix: Improve home dashboard layout"

# Push to GitHub (triggers auto-deploy)
git push origin main

# Monitor at: Vercel Dashboard → Deployments
```

## 🔄 Create a Pull Request (Collaboration)

If working with others:

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes & commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Go to GitHub → Click "Compare & pull request"
# Create PR, wait for review, merge
```

## 📊 Monitoring Your Deployment

### Check Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "whoop-dashboard"
3. See:
   - **Deployments**: All versions
   - **Analytics**: Traffic data
   - **Logs**: Build logs
   - **Settings**: Environment variables

### View Build Logs

```bash
# Via Vercel CLI
vercel logs --prod
```

### Monitor Errors

Vercel logs frontend errors automatically. Check:
1. Vercel Dashboard → Deployments → Click latest
2. View build log for errors

## 🚨 Troubleshooting

### "Build failed"

Check the build log in Vercel dashboard for errors:

```bash
# Common fixes:
# 1. Missing dependencies
npm install

# 2. Commit & push
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### "OAuth redirect error"

Verify Whoop redirect URI exactly matches:
- Check for `https://` (not http://)
- No trailing slashes
- Exact domain match

### "Can't see updates live"

1. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Clear browser cache
3. Wait 60 seconds for cache invalidation
4. Check Vercel Dashboard → Deployments (green = ready)

## 💡 Pro Tips

### Using GitHub Desktop (Easier)

Don't like command line? Use GitHub Desktop:

1. Download: https://desktop.github.com
2. File → Clone Repository
3. Select your repo
4. GitHub Desktop shows changes
5. Click "Commit" then "Push"

### Vercel CLI

Push directly without GitHub:

```bash
# Install
npm i -g vercel

# Deploy
vercel --prod
```

### Keep Secrets Safe

NEVER commit `.env` file:

```bash
# .env is in .gitignore ✅
# Environment variables in Vercel Dashboard ✅
```

### Custom Domain (Optional)

Add your own domain:

1. Vercel Dashboard → Settings → Domains
2. Add your domain (need to update DNS)
3. Vercel provides DNS instructions

## 📚 Resources

- [GitHub Docs](https://docs.github.com)
- [Vercel Docs](https://vercel.com/docs)
- [Whoop API](https://developer.whoop.com/docs)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)

## ✅ Checklist - You're Done!

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project deployed
- [ ] Environment variables set
- [ ] Whoop redirect URI updated
- [ ] Live dashboard working
- [ ] OAuth flow tested
- [ ] Ready to share with others!

---

## 🎉 Gefeliciteerd!

Je Whoop Dashboard is nu **LIVE** op het internet! 🚀

### Share Your Dashboard

```
🔗 https://whoop-dashboard-yourname.vercel.app
```

Share the link with friends or on social media!

### Next Steps

1. Keep making improvements
2. Git push every time you update
3. Vercel auto-deploys instantly
4. Monitor analytics in Vercel Dashboard
5. Add more features as you think of them

**Happy coding! 💚**
