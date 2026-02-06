# 🏃‍♂️ Whoop Dashboard - Complete Productiviteits & Gezondheids Platform

Een modern, volledig geïntegreerd dashboard voor het beheren van taken, agenda, school, business projecten én realtime Whoop gezondheidsdata.

![Dashboard Preview](https://via.placeholder.com/1200x600/0A0A0A/FF3E3E?text=Whoop+Dashboard)

## ✨ Features

### 📊 7 Volledige Secties

1. **Home Dashboard** - Overzicht met statistieken en AI aanbevelingen
2. **To-Do Hub** - Takenbeheer met categorieën en prioriteiten
3. **Kalender** - Event planning met herinneringen
4. **School** - Vakken, opdrachten, cijfers en studieuren tracker
5. **Business** - Kanban board, doelen, financiën en contacten
6. **Whoop Integratie** - Realtime recovery, slaap, strain, HRV data
7. **Instellingen** - Profiel, voorkeuren en data export/import

### 🔥 Whoop API Features

- ✅ OAuth 2.0 authenticatie
- ✅ Realtime data synchronisatie
- ✅ Recovery score tracking
- ✅ Slaap analyse (duur, efficiëntie, kwaliteit)
- ✅ Strain monitoring
- ✅ HRV (hartslag variabiliteit)
- ✅ Hartslag metingen
- ✅ Interactieve grafieken (Recharts)
- ✅ Demo data fallback (werkt zonder API!)

### 🎨 Design Features

- 🌙 Dark mode (Whoop-inspired)
- 📱 Volledig responsive
- 🎭 Smooth animaties
- 🎨 Color-coded prioriteiten (🟢🟡🔴)
- 🖱️ Drag & drop (Kanban)
- 💾 localStorage persistentie
- 📥 Export/Import functionaliteit

## 🚀 Quick Start

### 1. Installatie

```bash
# Clone repository
git clone <your-repo-url>
cd whoop-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

De app draait nu op [http://localhost:3000](http://localhost:3000)

### 2. Whoop API Configuratie

#### Stap 1: Whoop Developer Account

1. Ga naar [developer.whoop.com](https://developer.whoop.com/dashboard)
2. Log in met je Whoop account
3. Klik op **"Create Application"**

#### Stap 2: App Registreren

Vul de volgende gegevens in:

- **Application Name**: Whoop Dashboard
- **Description**: Personal productivity dashboard with Whoop integration
- **Redirect URI**: 
  - Development: `http://localhost:3000/auth/callback`
  - Production: `https://your-app.vercel.app/auth/callback`
- **Scopes**: Selecteer alle gewenste scopes:
  - ✅ `read:recovery`
  - ✅ `read:cycles`
  - ✅ `read:workout`
  - ✅ `read:sleep`
  - ✅ `read:profile`
  - ✅ `read:body_measurement`
  - ✅ `offline` (voor refresh tokens)

#### Stap 3: Credentials Opslaan

Na registratie krijg je:
- **Client ID** (publiek)
- **Client Secret** (GEHEIM - niet delen!)

#### Stap 4: Environment Variables

Kopieer `.env.example` naar `.env`:

```bash
cp .env.example .env
```

Vul je credentials in:

```env
VITE_WHOOP_CLIENT_ID=your_client_id_here
VITE_WHOOP_CLIENT_SECRET=your_client_secret_here
VITE_WHOOP_REDIRECT_URI=http://localhost:3000/auth/callback

# Production
# VITE_WHOOP_REDIRECT_URI=https://your-app.vercel.app/auth/callback
```

**⚠️ BELANGRIJK**: Voeg `.env` toe aan `.gitignore` (al gedaan!)

### 3. Whoop Account Verbinden

1. Start de app: `npm run dev`
2. Navigeer naar de **Whoop** pagina
3. Klik op **"Verbinden met Whoop"**
4. Log in op Whoop en geef toegang
5. Je wordt teruggestuurd naar het dashboard
6. Data wordt automatisch gesynchroniseerd! 🎉

### 4. Demo Modus (Zonder Whoop Account)

De app werkt ook **zonder** Whoop verbinding:
- Demo data wordt automatisch gegenereerd
- Alle features zijn testbaar
- Perfecte manier om de app te verkennen

## 📦 Deployment

### 🎯 Deploying to EkoonICT (www.ekoonict.com)

For specific deployment instructions to www.ekoonict.com via GitHub + Vercel, see:
- **📋 [READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md)** - Complete deployment checklist
- **🔗 [GITHUB_INTEGRATION.md](./GITHUB_INTEGRATION.md)** - How to integrate into EkoonICTWebsite repo
- **📚 [DEPLOYMENT_STRATEGY.md](./DEPLOYMENT_STRATEGY.md)** - Architecture & integration options

### 📦 Generic Vercel Deployment (Any Project)

### Automatische Deployment

1. **Push naar GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Whoop Dashboard"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Vercel Setup**

- Ga naar [vercel.com](https://vercel.com)
- Klik **"New Project"**
- Import je GitHub repository
- Vercel detecteert automatisch Vite

3. **Environment Variables Toevoegen**

In Vercel project settings → Environment Variables:

```
VITE_WHOOP_CLIENT_ID = your_client_id
VITE_WHOOP_CLIENT_SECRET = your_client_secret
VITE_WHOOP_REDIRECT_URI = https://your-app.vercel.app/auth/callback
```

4. **Deploy!**

Klik op **Deploy** en wacht ~2 minuten.

Je app is live op: `https://your-app.vercel.app` 🚀

### Vercel CLI (Alternatief)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

## 📖 Gebruikershandleiding

### To-Do Hub

- ➕ **Nieuwe taak**: Klik op "Nieuwe Taak"
- 🏷️ **Categorieën**: Persoonlijk, Werk, School, Gezondheid, Overig
- 🎯 **Prioriteiten**: Hoog (🔴), Gemiddeld (🟡), Laag (🟢)
- ✅ **Voltooien**: Klik op checkbox
- 📅 **Deadline**: Optioneel deadline instellen
- 🗑️ **Verwijderen**: Via prullenbak icoon

### Kalender

- 📅 **Eventi toevoegen**: Klik dag of "Nieuw Evenement"
- 🔔 **Herinneringen**: Checkbox bij maken event
- 🎨 **Types**: Evenement, Vergadering, Deadline, Herinnering
- 👀 **Vandaag**: Sidebar toont events van vandaag
- ⏭️ **Navigatie**: Vorige/volgende maand

### School

- 📚 **Vakken**: Voeg courses toe met codes en credits
- 📝 **Opdrachten**: Koppel aan vakken, stel deadlines
- 🎓 **Cijfers**: Track grades met weging voor GPA
- ⏱️ **Studieuren**: Log hoeveel je studeert per vak

### Business

- 📋 **Kanban**: Sleep projecten tussen To Do → In Progress → Review → Done
- 🎯 **Doelen**: Stel targets met voortgangsbalk
- 💰 **Financiën**: Track inkomsten/uitgaven met balans
- 👥 **Contacten**: Bewaar business contacten

### Whoop Dashboard

- 📊 **Recovery**: Zie dagelijkse recovery score + HRV + RHR
- 😴 **Slaap**: Duur, efficiëntie, kwaliteit tracking
- ⚡ **Strain**: Dagelijkse belasting monitoring
- 💓 **HRV**: Hartslag variabiliteit trends
- 📈 **Grafieken**: Interactieve visualisaties
- 🤖 **AI Tips**: Automatische aanbevelingen op basis van data

### Instellingen

- 👤 **Profiel**: Naam, email, avatar, bio
- ⚙️ **Voorkeuren**: Thema, taal, notificaties
- 📥 **Export**: Download alle data als JSON
- 📤 **Import**: Herstel data van backup
- 🔴 **Whoop**: Verbind/verbreek account

## 🛠️ Tech Stack

- ⚛️ **React 18** - UI framework
- ⚡ **Vite** - Build tool (supersnel!)
- 🎨 **TailwindCSS** - Styling
- 📊 **Recharts** - Data visualisatie
- 🔄 **React Router** - Navigatie
- 🎭 **Lucide Icons** - Icon library
- 💾 **localStorage** - Data persistentie
- 🔐 **OAuth 2.0** - Whoop authenticatie

## 📁 Project Structuur

```
whoop-dashboard/
├── public/
├── src/
│   ├── components/        # Herbruikbare components
│   │   ├── Sidebar.jsx
│   │   ├── Card.jsx
│   │   ├── StatCard.jsx
│   │   ├── Modal.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/            # Route pages
│   │   ├── Home.jsx
│   │   ├── TodoHub.jsx
│   │   ├── Calendar.jsx
│   │   ├── School.jsx
│   │   ├── Business.jsx
│   │   ├── Whoop.jsx
│   │   ├── Settings.jsx
│   │   └── AuthCallback.jsx
│   ├── context/          # React Context
│   │   └── WhoopContext.jsx
│   ├── utils/            # Helper functions
│   │   ├── whoopApi.js   # Whoop API integration
│   │   ├── storage.js    # localStorage helpers
│   │   └── helpers.js    # Utility functions
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env.example          # Environment template
├── vercel.json          # Vercel config
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔧 Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Check code quality
```

## 🌐 Whoop API Endpoints

De app gebruikt de volgende Whoop API v2 endpoints:

| Endpoint | Data | Beschrijving |
|----------|------|--------------|
| `/user/profile/basic` | Profiel | Gebruiker informatie |
| `/cycle` | Cycles | Recovery cycles data |
| `/recovery` | Recovery | Recovery scores + HRV + RHR |
| `/sleep` | Slaap | Slaap duur, efficiëntie, kwaliteit |
| `/workout` | Strain | Dagelijkse strain scores |
| `/physiological_metrics` | Fysiologisch | HRV, hartslag, etc. |

## 📊 Whoop OAuth Flow

```
1. User klikt "Verbind Whoop"
   ↓
2. App stuurt naar Whoop login
   ↓
3. User logt in & geeft toegang
   ↓
4. Whoop stuurt authorization code
   ↓
5. App wisselt code voor access token
   ↓
6. Token opgeslagen in localStorage
   ↓
7. App haalt Whoop data op
   ↓
8. Dashboard toont realtime data! 🎉
```

## 🔐 Security

- ✅ Client Secret alleen server-side (in productie gebruik backend!)
- ✅ Tokens in localStorage (browser-only toegang)
- ✅ OAuth 2.0 met refresh tokens
- ✅ HTTPS required in productie
- ✅ `.env` niet in Git

**⚠️ Productie Tip**: Voor enterprise gebruik, verwerk tokens via een backend API om secrets te beschermen.

## 🐛 Troubleshooting

### Whoop verbinding werkt niet

1. Controleer of `.env` correct is ingevuld
2. Verify Redirect URI in Whoop developer dashboard
3. Check browser console voor errors
4. Test met demo data eerst

### Data verdwijnt na refresh

- localStorage wordt gebruikt - data blijft lokaal
- Check of browser localStorage niet geblokkeerd is
- Exporteer data regelmatig als backup

### Build errors

```bash
# Clear cache & reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

## 🎯 Roadmap / Toekomstige Features

- [ ] Webhooks voor realtime Whoop updates
- [ ] Dark/Light mode toggle
- [ ] Multi-user support
- [ ] Mobile app (React Native)
- [ ] Backend API (Express/Node.js)
- [ ] Database integratie (PostgreSQL)
- [ ] Export naar CSV
- [ ] PDF rapporten genereren
- [ ] Email notificaties
- [ ] Google Calendar sync
- [ ] Todoist integratie

## 📄 Licentie

MIT License - Vrij te gebruiken voor persoonlijke en commerciële projecten.

## 🙏 Credits

- **Whoop API**: [developer.whoop.com](https://developer.whoop.com)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Framework**: React + Vite
- **Styling**: TailwindCSS

## 💬 Support

Vragen of problemen?

1. Check de troubleshooting sectie
2. Open een issue op GitHub
3. Lees de [Whoop API docs](https://developer.whoop.com/docs/developing)

---

**Gemaakt met ❤️ voor productiviteit en gezondheid**

Veel succes met je Whoop Dashboard! 🚀
