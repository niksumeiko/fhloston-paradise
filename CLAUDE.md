# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this?

A programming kata: a React SPA with JWT login flow, used for training within the Better Engineering Community. The app has a login page and a protected dashboard that displays the authenticated user's profile.

## Commands

- `npm start` — runs API server (port 3001) and Vite dev server (port 5173) concurrently
- `npm run dev` — Vite dev server only (no API)
- `npm run start:api` — API server only
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint with auto-fix on `src/**/*.{ts,tsx}`
- `npm run format` — Prettier on `src/**/*.{ts,tsx,css,md}`

No test runner is configured yet (`npm test` exits with error).

## Architecture

**Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, React Router v7.

**Backend:** Express 5 (CommonJS) in `server.js` — single `POST /api/login` endpoint. Authenticates against hardcoded users, returns a JWT + user object.

**Auth flow:** `AuthService.ts` manages token/user in localStorage. `ProtectedRoute` redirects to `/login` if no auth. Dashboard reads auth and shows user profile with logout.

**Routing:** Two routes in `App.tsx` — `/` (protected dashboard) and `/login`.

**Design system:** `src/design-system/` — presentational components (Alert, Button, CardLayout, FormField, TextInput, Title, UserCard, UserPicture, UserDescription) exported via barrel `index.ts`.

**Features:** Organized under `src/features/` by domain (`auth/`, `dashboard/`).

## Test credentials

| Name          | Email               | Password   |
|---------------|---------------------|------------|
| Korben Dallas | korben@fhloston.com | multipass  |
| Leeloo        | leeloo@fhloston.com | leeloo123  |
| Ruby Rhod     | ruby@fhloston.com   | greenrocks |
