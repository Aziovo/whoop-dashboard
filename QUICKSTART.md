# ⚡ Quick Start - 5 Minuten Setup

Start binnen 5 minuten met de Whoop Dashboard!

## 🚀 Supersnel Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd whoop-dashboard

# 2. Install
npm install

# 3. Setup wizard (optioneel - voert .env configuratie uit)
npm run setup

# 4. Start
npm run dev
```

✅ Open **http://localhost:3000** - Je dashboard draait!

---

## 🎯 Demo Modus (Geen Whoop Account Nodig)

De app werkt direct met **demo data**:

1. Start de app: `npm run dev`
2. Navigeer door alle secties
3. Alle features zijn testbaar
4. Perfect voor development/testing

**Later verbinden met Whoop?** Volg stap 3 hieronder.

---

## 🔐 Met Whoop Account (Live Data)

### Optie A: Setup Wizard

```bash
npm run setup
```

Volg de prompts:
- Vul Client ID in
- Vul Client Secret in
- Kies environment (dev/prod)
- Done! ✅

### Optie B: Handmatig

1. **Whoop Developer Account**
   - Ga naar [developer.whoop.com](https://developer.whoop.com/dashboard)
   - Create Application
   - Kopieer Client ID & Secret

2. **Environment File**
   ```bash
   cp .env.example .env
   ```
   
   Vul `.env` in:
   ```env
   VITE_WHOOP_CLIENT_ID=your_id
   VITE_WHOOP_CLIENT_SECRET=your_secret
   VITE_WHOOP_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

3. **Connect in App**
   - Start app: `npm run dev`
   - Ga naar **Whoop** pagina
   - Klik **"Verbinden met Whoop"**
   - Log in en geef toegang
   - Klaar! 🎉

---

## 📦 Deployment (1 minuut)

### Vercel (Aanbevolen)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Production
vercel --prod
```

**Of via GitHub:**
1. Push naar GitHub
2. Import op [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy! 🚀

---

## 🎨 Wat Kun Je Doen?

### ✅ To-Do Hub
- Taken maken met prioriteiten
- Categoriseren (werk, school, persoonlijk)
- Deadlines instellen
- Filteren en sorteren

### 📅 Kalender
- Events toevoegen
- Herinneringen instellen
- Maandoverzicht
- Upcoming events sidebar

### 📚 School
- Vakken beheren
- Opdrachten tracken
- Cijfers bijhouden
- Studieuren loggen
- GPA berekenen

### 💼 Business
- **Kanban Board** (drag & drop!)
- Doelen met voortgang
- Financiën (inkomsten/uitgaven)
- Contacten database

### 💪 Whoop
- Recovery score
- Slaap analyse
- Strain monitoring
- HRV trends
- Hartslag data
- Interactieve grafieken
- AI aanbevelingen

### ⚙️ Settings
- Profiel beheer
- Export/import data
- Whoop verbinding
- Voorkeuren

---

## 🎓 Leren & Bouwen

### Project Structuur Begrijpen

```
src/
├── pages/          → Route pages (7 secties)
├── components/     → Herbruikbare UI
├── context/        → React Context (Whoop data)
├── utils/          → API & helpers
└── App.jsx         → Main app
```

### Key Files

- **`src/utils/whoopApi.js`** - Whoop API logic
- **`src/context/WhoopContext.jsx`** - Data management
- **`src/utils/storage.js`** - localStorage helpers
- **`src/pages/Whoop.jsx`** - Main Whoop dashboard

### Uitbreiden

Wil je features toevoegen?

1. Bekijk `CONTRIBUTING.md`
2. Volg de code patterns
3. Test met demo data
4. Submit PR! 🎉

---

## 🆘 Problemen?

### App start niet
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Whoop verbinding werkt niet
- Check `.env` credentials
- Verify redirect URI in Whoop dashboard
- Use demo data voor testing

### Build errors
- Node 18+ required
- Check all dependencies installed
- Clear `.vite` cache

**Meer hulp?** Lees `SETUP.md` of open een issue.

---

## 📚 Volledige Documentatie

- **README.md** - Complete feature lijst
- **SETUP.md** - Stap-voor-stap setup
- **CONTRIBUTING.md** - Bijdragen aan project

---

## 🎉 Klaar!

Je hebt nu een volledig werkend dashboard met:
- ✅ 7 productiviteitsecties
- ✅ Whoop API integratie
- ✅ Beautiful dark UI
- ✅ Responsive design
- ✅ Data persistentie
- ✅ Production ready

**Next**: Personaliseer, gebruik, en geniet! 💪

---

**Veel plezier met je Whoop Dashboard! 🚀**
