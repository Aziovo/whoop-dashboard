# ✅ Installation & Setup Checklist

Complete checklist to verify everything is properly set up and ready to go.

## 🔧 Prerequisites

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm/yarn installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Text editor (VS Code recommended)
- [ ] Browser (Chrome, Firefox, Safari)
- [ ] Whoop account (whoop.com)

## 📦 Installation Steps

- [ ] Navigate to project directory
  ```bash
  cd whoop-dashboard
  ```

- [ ] Install dependencies
  ```bash
  npm install
  ```
  Expected: Shows "added X packages"

- [ ] Verify installation
  ```bash
  npm list react vite tailwindcss
  ```
  Expected: Shows versions for React 18+, Vite 4+

## 🚀 Local Development

- [ ] Start dev server
  ```bash
  npm run dev
  ```
  Expected: "Local: http://localhost:5173/"

- [ ] Open in browser
  - [ ] Navigate to `http://localhost:5173`
  - [ ] Page loads without errors
  - [ ] All 7 sections visible in sidebar

- [ ] Test demo mode
  - [ ] Go to Settings
  - [ ] Toggle "Demo Gegevens Gebruiken" ON
  - [ ] Check Whoop section shows demo data
  - [ ] Charts display correctly

- [ ] Test basic functionality
  - [ ] Add a task in Task Hub
  - [ ] Refresh page - task still there (localStorage works)
  - [ ] Add calendar event
  - [ ] Create a school course

## 🔐 Whoop OAuth Setup

- [ ] Register Whoop Developer Account
  - [ ] Go to https://developer.whoop.com/dashboard
  - [ ] Sign up / Log in
  - [ ] Save credentials (you'll need them)

- [ ] Create Application
  - [ ] Click "Create Application"
  - [ ] Fill in app details
  - [ ] Set Redirect URI: `http://localhost:5173/callback`
  - [ ] Select required scopes:
    - [ ] read:cycles
    - [ ] read:sleep
    - [ ] read:strain
    - [ ] read:recovery
    - [ ] read:heart_rate
    - [ ] read:physiological_data
  - [ ] Save & copy Client ID & Client Secret

- [ ] Add to Dashboard (.env.local)
  - [ ] Create file `.env.local` in root directory
  - [ ] Copy `.env.example` content
  - [ ] Fill in your credentials:
    ```
    VITE_WHOOP_CLIENT_ID=your_actual_id
    VITE_WHOOP_CLIENT_SECRET=your_actual_secret
    VITE_WHOOP_REDIRECT_URI=http://localhost:5173/callback
    VITE_API_BASE_URL=https://api.whoop.com/api/v2
    ```
  - [ ] Save file
  - [ ] Restart dev server (Ctrl+C, then `npm run dev`)

- [ ] Test OAuth Flow
  - [ ] Go to Settings in dashboard
  - [ ] Click "Whoop Account Verbinden"
  - [ ] You're redirected to Whoop login
  - [ ] Log in with Whoop account
  - [ ] Authorize app
  - [ ] Redirected back to dashboard
  - [ ] "Verbonden" message appears
  - [ ] Whoop section shows real data (not demo)

## 📁 File Verification

Verify all files are created:

### Configuration Files
- [ ] `package.json`
- [ ] `vite.config.js`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`
- [ ] `vercel.json`
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] `index.html`

### Source Code
- [ ] `src/App.jsx`
- [ ] `src/App.css`
- [ ] `src/main.jsx`

### Components
- [ ] `src/components/Home.jsx`
- [ ] `src/components/TodoHub.jsx`
- [ ] `src/components/Calendar.jsx`
- [ ] `src/components/School.jsx`
- [ ] `src/components/Business.jsx`
- [ ] `src/components/Whoop.jsx`
- [ ] `src/components/Settings.jsx`

### Utilities
- [ ] `src/utils/whoopApi.js`
- [ ] `src/utils/demoData.js`

### Hooks & Context
- [ ] `src/hooks/useAppState.js`
- [ ] `src/context/WhoopContext.jsx`

### Pages
- [ ] `src/pages/Callback.jsx`

### Documentation
- [ ] `README.md`
- [ ] `QUICK_START.md`
- [ ] `DEPLOYMENT.md`
- [ ] `GITHUB_SETUP.md`
- [ ] `WHOOP_API_GUIDE.md`
- [ ] `BUILD_SUMMARY.md`
- [ ] `INSTALLATION_CHECKLIST.md` (this file)

## 🧪 Feature Testing

### Home Section
- [ ] Health stats display (Recovery, Strain, Sleep)
- [ ] 7-day charts show demo/real data
- [ ] Quick add form works
- [ ] Recommendations show

### Task Hub
- [ ] Add new task works
- [ ] Categories filter correctly
- [ ] Priority levels show with colors
- [ ] Complete/uncomplete toggles
- [ ] Delete removes task
- [ ] Export as JSON works

### Calendar
- [ ] Month navigation works (prev/next)
- [ ] Add event form works
- [ ] Events appear on correct dates
- [ ] Event colors display

### School
- [ ] Add course works
- [ ] Add assignment works
- [ ] Status dropdown changes
- [ ] Assignments show for course

### Business
- [ ] Add project works
- [ ] Progress bar updates
- [ ] Add contact works
- [ ] Status badges display

### Whoop
- [ ] Shows real or demo data
- [ ] Metric selector works
- [ ] Charts display correctly
- [ ] Status colors correct (🟢🟡🔴)

### Settings
- [ ] Profile fields save
- [ ] Language selector works
- [ ] Theme selector works
- [ ] OAuth connect flow works
- [ ] Demo toggle works
- [ ] Logout works

## 📊 Build & Deployment

### Build for Production
- [ ] Run `npm run build`
- [ ] No errors in output
- [ ] `dist/` folder created
- [ ] `dist/index.html` exists

### Preview Production Build
- [ ] Run `npm run preview`
- [ ] Opens on different port (usually 4173)
- [ ] Everything works locally

### GitHub Setup (Optional)
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] First commit: `git commit -m "Initial commit"`
- [ ] Create GitHub repo (github.com/new)
- [ ] Add remote: `git remote add origin YOUR_URL`
- [ ] Push: `git push -u origin main`

### Vercel Deployment (Optional)
- [ ] Create Vercel account (vercel.com)
- [ ] Import GitHub repo
- [ ] Add environment variables in Vercel
- [ ] Deploy button clicked
- [ ] Build succeeds
- [ ] Live URL works
- [ ] Whoop OAuth redirect URI updated

## 🔒 Security Verification

- [ ] `.env.local` NOT committed to git
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in code
- [ ] No credentials in comments
- [ ] Environment variables used for secrets
- [ ] HTTPS enabled on production
- [ ] OAuth redirect URI matches exactly

## 📱 Responsive Design Test

- [ ] Desktop (1920px) - works
- [ ] Tablet (768px) - works
- [ ] Mobile (375px) - works
- [ ] Sidebar collapses on mobile
- [ ] All sections visible on mobile
- [ ] Buttons touch-friendly
- [ ] Forms work on mobile

## 🐛 Console Check

- [ ] Open Developer Tools (F12)
- [ ] Check Console tab
- [ ] No red errors
- [ ] No yellow warnings (acceptable)
- [ ] Network tab shows API calls (if connected)

## ⚡ Performance Check

- [ ] Page loads in <3 seconds
- [ ] Smooth animations
- [ ] No lag when adding items
- [ ] Charts render smoothly
- [ ] Sidebar toggle is smooth

## 📝 Documentation Review

- [ ] Read `QUICK_START.md` - understand basics
- [ ] Read `README.md` - full guide
- [ ] Read `WHOOP_API_GUIDE.md` - API understanding
- [ ] Read `BUILD_SUMMARY.md` - architecture
- [ ] Read `DEPLOYMENT.md` if deploying

## 🎯 Success Criteria

All of the following should be true:

✅ Local dev server runs without errors
✅ All 7 sections load and function
✅ Demo data displays correctly
✅ localStorage persistence works
✅ Can add/edit/delete items
✅ Whoop OAuth flow works (if credentials provided)
✅ Responsive design works on all sizes
✅ Production build succeeds
✅ Documentation is clear
✅ Ready to deploy or share

## 🚀 Ready to Launch?

Once all boxes are checked:

1. You can **start the dev server**:
   ```bash
   npm run dev
   ```

2. You can **deploy to Vercel**:
   Follow `GITHUB_SETUP.md` or `DEPLOYMENT.md`

3. You can **customize & extend**:
   Modify components, add features, style to your preference

4. You can **share with others**:
   Give them the Vercel link or GitHub repo

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Check `QUICK_START.md` for quick answers
- Check component files for how things work
- Visit https://developer.whoop.com for API questions
- Check browser console for specific errors

## 🎉 Completion

When you've checked all boxes, you're ready to:

```bash
npm run dev
```

And start using your Whoop Dashboard!

---

**Date Completed**: _______________

**By**: _______________

**Status**: 
- [ ] Ready for local use
- [ ] Ready for production deployment
- [ ] Ready to share with team

---

**Congratulations! Your dashboard is ready! 🎊**
