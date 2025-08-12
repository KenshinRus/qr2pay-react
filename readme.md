# QR2Pay React (Next.js) Application

A Next.js app for generating, sharing, and viewing payment QR codes with a simple contact form.

## Tech stack

- Next.js 15, React 19
- Tailwind CSS 4
- Radix UI primitives
- Nodemailer for contact form

## Prerequisites

- Node.js 22.x
- npm 10.x

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Create a .env file in the project root

```env
# Base URL (use your public domain in production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Symmetric encryption key used by the app
# Use a strong, consistent key across environments
SYMMETRIC_KEY=replace-with-your-key

# Gmail credentials for the contact form (Google App Passwords)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Environment (optional for dev; required as production for prod runs)
NODE_ENV=local
```

### 3. Start the dev server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## NPM scripts

- dev: Start Next.js in development mode
- build: Build the application for production
- start: Run the production startup script (requires NODE_ENV=production)
- start:prod: Production start on Linux/macOS (sets NODE_ENV and runs startup)
- start:server: Start the custom Node server (uses dev mode unless NODE_ENV=production)
- lint: Run Next.js ESLint
- diagnose: Print quick environment diagnostics

## Running in production locally

### Windows (PowerShell)

```powershell
$env:NODE_ENV = 'production'
npm run start
```

### macOS / Linux

```bash
npm run build
npm run start:prod
```

The startup script will ensure a production build exists and then launch the server.

## Project structure

- app/: Next.js app router pages and API routes
- components/: UI components
- lib/: App logic and helpers
- public/: Static assets
- utils/: Utility modules (e.g., encryption)

Key entry files: `app/page.tsx`, `app/api/contact/route.ts`, `server.js`, `startup.js`.

## Deployment notes (Azure App Service)

- Set environment variables in Azure App Settings
- Use the startup command: `node startup.js`
- Ensure NODE_ENV is set to `production`; the startup script can build on first run if needed
