# 🤝 Contributing to Whoop Dashboard

Bedankt voor je interesse in het bijdragen aan dit project!

## 📋 Development Workflow

### 1. Fork & Clone

```bash
# Fork het project op GitHub
# Clone je fork
git clone https://github.com/jouw-username/whoop-dashboard.git
cd whoop-dashboard

# Add upstream remote
git remote add upstream https://github.com/original-owner/whoop-dashboard.git
```

### 2. Create Feature Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/awesome-feature
```

### 3. Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Make changes...
# Test thoroughly
```

### 4. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add awesome feature"

# Types:
# feat: nieuwe feature
# fix: bug fix
# docs: documentatie
# style: formatting
# refactor: code refactoring
# test: tests toevoegen
# chore: maintenance
```

### 5. Push & PR

```bash
# Push to your fork
git push origin feature/awesome-feature

# Open Pull Request op GitHub
```

## 🎨 Code Style

### React Components

```jsx
// Use functional components with hooks
import { useState, useEffect } from 'react'

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initial)
  
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  )
}

export default MyComponent
```

### TailwindCSS

```jsx
// Prefer utility classes
<div className="flex items-center space-x-4 p-4 bg-whoop-gray rounded-lg">

// Complex styles → extract to App.css
.custom-component {
  @apply flex items-center space-x-4;
}
```

### File Naming

- Components: `PascalCase.jsx`
- Utils: `camelCase.js`
- Pages: `PascalCase.jsx`

## 🧪 Testing

```bash
# Add tests voor nieuwe features
# Run linter
npm run lint

# Build check
npm run build
```

## 📝 Documentation

- Update README.md voor nieuwe features
- Add JSDoc comments voor complexe functies
- Update SETUP.md voor configuratie changes

## 🐛 Bug Reports

Open een issue met:

1. **Title**: Duidelijke samenvatting
2. **Steps to reproduce**: Hoe te reproduceren
3. **Expected**: Wat verwacht je
4. **Actual**: Wat gebeurt er
5. **Screenshots**: Als relevant
6. **Environment**: Browser, OS, Node version

## 💡 Feature Requests

Open een issue met:

1. **Problem**: Welk probleem lost het op?
2. **Solution**: Jouw voorgestelde oplossing
3. **Alternatives**: Andere mogelijkheden
4. **Mockups**: Wireframes/designs (optioneel)

## 🚀 Areas to Contribute

### High Priority

- [ ] Backend API voor secure token management
- [ ] Whoop webhooks implementatie
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Accessibility improvements (WCAG)

### Medium Priority

- [ ] CSV export functionaliteit
- [ ] PDF rapport generator
- [ ] Email notificaties
- [ ] Google Calendar sync
- [ ] Dark/Light mode toggle

### Good First Issues

- [ ] Fix typos in documentatie
- [ ] Add meer demo data scenarios
- [ ] Improve error messages
- [ ] Add loading states
- [ ] Optimize chart performance

## 📜 Code of Conduct

Be kind, respectful, and constructive:

- ✅ Constructieve feedback
- ✅ Respectvol taalgebruik
- ✅ Focus op code, niet persoon
- ❌ Geen harassment
- ❌ Geen spam
- ❌ Geen off-topic discussions

## 📞 Contact

Vragen? Open een discussion op GitHub of stuur een DM.

---

**Bedankt voor je bijdrage! 🎉**
