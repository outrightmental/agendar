# Copilot Instructions for Agendar

## Project Overview

Agendar™ is a Heads-Up Display for being on time. It's a React-based web application that displays Google Calendar events in a minimalist, full-screen format with visual time-based cues.

**Key Features:**
- Dark backdrop with monochrome minimal design
- 24-hour clock with seconds
- Shows events approaching within 24 hours
- Color-coded time-based alerts (gray → yellow → rainbow → green)
- Direct Google Calendar API integration without server-side data access

**Security Principle:** Never access user Google data on the server. All authentication and data access happens client-side via Google APIs.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Create React App (custom webpack configuration)
- **Styling:** SCSS/Sass, Tailwind CSS
- **APIs:** Google Calendar API (gapi)
- **Testing:** Jest, React Testing Library
- **Deployment:** GitHub Pages

## Getting Started

### Environment Setup

Required environment variables (create `.env` file, never commit):
```
REACT_APP_GOOGLE_API_KEY=ABC
REACT_APP_GOOGLE_CLIENT_ID=123
```

Optional (production only):
```
REACT_APP_GOOGLE_ANALYTICS_ID=G-123
```

### Available Commands

- `npm start` - Development mode (http://localhost:3000)
- `npm test` - Run tests in watch mode
- `npm run build` - Production build
- `npm run deploy` - Deploy to GitHub Pages

## Code Style & Conventions

### General Guidelines
- Use 2 spaces for indentation (see `.editorconfig`)
- Follow ESLint rules (`react-app` config)
- Use functional components where possible, but class components exist for legacy code
- Copyright header: `// Copyright (C) 2020 Outright Mental`

### File Organization
- Components in `src/` (e.g., `App.js`, `Clock.js`, `Event.js`, `Content.js`)
- Styles co-located with components (e.g., `App.scss`, `Clock.scss`)
- Configuration in `src/_config.js`
- Utilities in files prefixed with underscore (e.g., `_format.js`)

### React Patterns
- Use localStorage for persisting user preferences (clock format, selected calendars)
- Global `gapi` object for Google API interactions
- State management via component state (no Redux/Context yet)

### Styling
- Use SCSS for component styles
- Palette defined in `src/_palette.scss`
- Tailwind CSS available for utility classes
- Dark theme is the primary design

## Testing

- Tests co-located with components: `*.test.js`
- Jest configuration in `package.json`
- Use `@testing-library/react` for component testing
- Run `npm test` before committing

## Security & Privacy

**Critical Requirements:**
1. NEVER send user calendar data to any server
2. All Google API calls must be client-side only
3. Never log or store sensitive user information
4. Environment variables with secrets must NEVER be committed

## Common Tasks

### Adding a New Component
1. Create `ComponentName.js` in `src/`
2. Create `ComponentName.scss` for styles
3. Create `ComponentName.test.js` for tests
4. Import and use in parent component

### Modifying Calendar Display Logic
- Check `src/App.js` for calendar fetching and event loading
- Event rendering logic in `src/Event.js`
- Time formatting in `src/_format.js`
- Configuration constants in `src/_config.js`

### Updating Styles
- Component-specific: Edit corresponding `.scss` file
- Global palette: Edit `src/_palette.scss`
- Build automatically compiles SCSS to CSS

## Deployment

- Production site: https://agendar.outright.io
- Automated deployment via GitHub Actions
- `main` branch deploys automatically (see `.github/workflows/main-deploy.yml`)
- PRs run checks via `.github/workflows/pr.yml`

## Additional Resources

- [Create React App docs](https://facebook.github.io/create-react-app/)
- [React documentation](https://reactjs.org/)
- [Google Calendar API](https://developers.google.com/calendar)

## When Making Changes

1. Ensure you understand the security model (client-side only)
2. Test locally with `npm start`
3. Run tests with `npm test`
4. Check that build works with `npm run build`
5. Maintain minimal, focused design principles
6. Preserve the visual progression of time-based cues
