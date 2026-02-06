# 🚀 Quick Start Guide - Redesigned Dashboard

## Getting Started in 3 Steps

### 1️⃣ Servers Are Running

Both servers are already running:
- ✅ **Frontend**: http://localhost:3001
- ✅ **OAuth Proxy**: http://localhost:4000

### 2️⃣ Open the Dashboard

```bash
# Open in your default browser
open http://localhost:3001

# Or copy this URL:
http://localhost:3001
```

### 3️⃣ Explore the Features

## 📍 Navigation Guide

### Left Sidebar
- **Profile Section** (top) - View your status and profile
- **Navigation Tabs**:
  - 🏠 **Dashboard** - Home overview with stats
  - ⚡ **Tasks** - Kanban board (main feature)
  - 📄 **Docs** - Document management
  - 📊 **Log** - Activity timeline
- **Settings** (bottom) - Configuration and data management
- **Logout** (bottom) - Sign out

### Main Features

#### 🎯 Dashboard (Home)
1. View quick stats (Active tasks, High priority, School, Business)
2. See latest tasks with completion status
3. Check today's calendar events
4. Monitor Whoop health data (recovery score, strain, sleep)
5. Use quick action buttons

#### ✅ Tasks (Kanban Board)
1. **View Tasks**: See all tasks organized in 4 columns
   - TO DO - New and pending tasks
   - IN PROGRESS - Currently working on
   - DONE - Completed tasks
   - ARCHIVE - Archived tasks

2. **Create New Task**: 
   - Click "New Task" button (top right)
   - Or click + button in any column
   - Fill in: Title, Description, Priority, Category, Due Date

3. **Move Tasks**: 
   - Drag and drop cards between columns
   - Cards automatically save to new status

4. **Edit/Delete Tasks**:
   - Click on a card to edit
   - Use edit icon (pencil) for quick edit
   - Use trash icon to delete

5. **Filter & Search**:
   - Search bar - Find tasks by title/description
   - Priority filter - High/Medium/Low
   - Category filter - Personal/Work/School/Business/Health

#### 📄 Docs
- View and manage documents
- Filter by category
- Search documents
- Create new documents

#### 📊 Log
- See all activity timeline
- Filter by type (Tasks, Calendar, School, Business)
- View timestamps for all actions

#### ⚙️ Settings
- **Profile**: Update name, email, bio
- **Whoop Integration**: Connect/disconnect Whoop account
- **Data Management**:
  - Export data (JSON backup)
  - Import data (restore from backup)
  - Clear all data (with confirmation)
- **Preferences**: Notifications, theme, language

## 🎨 Understanding the UI

### Priority Colors
- 🔴 **High Priority** - Red left border, needs immediate attention
- 🟡 **Medium Priority** - Yellow left border, normal priority
- 🟢 **Low Priority** - Green left border, can wait

### Category Colors
- **Personal** - Blue
- **Work** - Purple
- **School** - Yellow
- **Business** - Orange
- **Health** - Green
- **Other** - Gray

### Status Indicators
- **Connected** - Green dot (Whoop connected)
- **Demo Mode** - Yellow badge (using demo data)
- **Idle/Busy/Away** - Your current status

## 💡 Pro Tips

1. **Keyboard Shortcuts** (coming soon)
   - Press `Ctrl/Cmd + K` to search (planned)
   - Press `N` to create new task (planned)

2. **Drag & Drop**
   - Hold and drag cards smoothly
   - Drop in any column to change status
   - Watch for column highlight on hover

3. **Quick Actions**
   - Right-click cards for context menu (planned)
   - Double-click card to edit (currently: single click)

4. **Data Safety**
   - Export your data regularly (Settings → Data Management)
   - All data auto-saves to localStorage
   - Import backup if needed

5. **Whoop Integration**
   - Connect once in Settings → Whoop Integration
   - Data syncs automatically
   - View health stats in Dashboard

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill existing processes
ps aux | grep "vite\|node server" | awk '{print $2}' | xargs kill -9

# Restart servers
cd whoop-dashboard
npm run dev &
node server.js &
```

### Can't See Data
- Check browser console for errors (F12 → Console)
- Clear browser cache and reload
- Check localStorage in DevTools (Application → Local Storage)

### OAuth Not Working
- Verify .env.local has correct credentials
- Check OAuth proxy is running on port 4000
- Ensure redirect URI matches: http://localhost:3001/callback

### Drag & Drop Not Working
- Refresh the page
- Check browser console for errors
- Ensure you're not in mobile view

## 📱 Mobile/Tablet View

The dashboard is responsive:
- **Desktop**: Full sidebar + multi-column layout
- **Tablet**: Adjusted layout with optimized columns
- **Mobile**: Collapsible sidebar (tap hamburger icon)

## 🎓 Learn More

- [Full Documentation](./REDESIGN_COMPLETE.md)
- [API Integration Guide](./WHOOP_API_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🆘 Need Help?

1. Check console for errors (F12)
2. Review REDESIGN_COMPLETE.md for detailed info
3. Test in incognito mode (rules out extension issues)
4. Clear localStorage and restart fresh

## 🎉 Enjoy Your New Dashboard!

The redesign brings a professional, modern look inspired by Klaus and Linear.

**Current URL**: http://localhost:3001

Start by creating your first task in the Kanban board! 🚀

---

**Tip**: Bookmark this URL for quick access to your dashboard.
