# Tarang‑FlowState — Wellness Dashboard

A mindful wellness app to track hydration, build habits, journal, explore wisdom, and connect with community — wrapped in a warm Indian-spiritual aesthetic.

---

## Architecture Overview

```
User's Browser (React SPA)
       │
       │  (localhost:5173 dev / Vercel prod)
       │
       ▼
  ┌──────────────────────────────────────────────────┐
  │  Vite Dev Server (dev) / Vercel (prod)           │
  │  - Proxies /api/* → backend (dev)                │
  │  - Serves static build (prod)                    │
  └──────────────┬───────────────────────────────────┘
                 │  /api/* requests
                 ▼
  ┌──────────────────────────────────────────────────┐
  │  Express.js Backend (port 5000)                  │
  │  - Cluster mode (1 process per CPU core)         │
  │  - Rate limited (100 req/15min global)           │
  │  - Compression (gzip)                            │
  └──┬──────────┬──────────┬──────────┬──────────────┘
     │          │          │          │
     ▼          ▼          ▼          ▼
  Auth    Wellness   Community   Achievements
 Routes    Routes     Routes       Routes
     │          │          │          │
     └──────────┴──────────┴──────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │  Database Layer      │
            │  - MongoDB (if URI)  │
            │  - db.json fallback  │
            └──────────────────────┘

  AI Features:
  Frontend → /api/chat → Gemini API (primary) / Groq SDK (fallback)
```

---

## Request Flow (Interview Answer)

**1. Frontend (React + Vite):** User interacts with the SPA. On any action (login, log water, write journal), the frontend calls relative `/api/*` endpoints using native `fetch()`.

**2. Dev Proxy / Production:** In development, Vite's dev server proxies `/api/*` to `localhost:5000`. In production on Vercel, `vercel.json` rewrites `/api/(.*)` to the serverless function at `api/index.js`.

**3. Backend (Express.js):** The request hits `backend/app.js` which:
- Validates CORS (whitelist from `ALLOWED_ORIGINS`)
- Applies rate limiting (100/15min global, 10/15min on auth)
- Routes to the correct route handler (`/api/auth`, `/api/water`, etc.)
- JWT middleware (`backend/middleware/auth.js`) protects most routes

**4. Database Layer (`backend/db.js`):** Each route calls db helper functions. If `MONGODB_URI` is set, it uses Mongoose (MongoDB). Otherwise, it falls back to a local `db.json` file. Same API interface regardless of backend.

**5. Response** flows back through the same path.

**6. AI Chat:** Frontend sends message to `/api/chat`, backend forwards to **Groq SDK (Llama-3.3-70B)** as primary AI provider, falls back to **Google Gemini**, then to local keyword-based replies if both APIs are unavailable.

---

## Features

| Category | Features |
|----------|----------|
| **Tracking** | Water intake (daily goal, progress ring, 7-day history), Habits/Rituals (streak tracking, monthly calendar, Hindu calendar integration), Journal (7 mood tags, heatmap, streak) |
| **Wisdom** | Daily quotes, 14 topics × 12 books, book reader with progress/bookmarks/notes, wisdom streak |
| **Heritage** | 13 Indian scholars, ancient texts, interactive map, audio narration |
| **Community** | Activity feed, intentions board, search, prana (karma) counter |
| **Profile** | Avatar upload (base64), bio/location, password change, account deletion, theme/sound/notification toggles |
| **Achievements** | 23 badges across 4 categories (Streaks, Journaling, Wellness, Wisdom), auto-unlocked via `AchievementEngine` |
| **Soul Archetype** | Computes Dreamer/Warrior/Seeker/Restorer from journal + habits |
| **AI** | Floating "Sahayak" chat (Gemini + Groq fallback), in-memory conversation cache (5 msg/user, 1h TTL) |
| **UX** | JWT auth, dark mode with glass-morphism, 7 ambient sound presets, PWA support, time-adaptive UI |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS 3, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB) / JSON file fallback |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **AI** | Groq SDK (primary, Llama-3.3-70B), Google Generative AI (Gemini, fallback) |
| **Hosting** | Vercel (frontend + serverless API functions) |
| **Monitoring** | @vercel/analytics, @vercel/speed-insights |
| **Performance** | Compression (gzip), cluster mode (multi-core), rate limiting |

---

## Project Structure

```
tarang-flowstate/
├── api/index.js           # Vercel serverless entry (imports Express app)
├── backend/
│   ├── app.js             # Express app setup (CORS, rate-limit, routes)
│   ├── server.js          # Cluster-mode startup (forks per CPU)
│   ├── db.js              # Database layer (MongoDB + JSON fallback)
│   ├── db.json            # Fallback JSON database
│   ├── middleware/auth.js # JWT authentication middleware
│   ├── routes/            # auth.js, water.js, habits.js, journal.js,
│   │                      # chat.js, community.js, profile.js, badges.js
│   ├── models/            # Mongoose schemas (User, WaterLog, Habit, etc.)
│   └── services/AchievementEngine.js
├── frontend/
│   ├── public/            # PWA assets (sw.js, manifest, icons)
│   └── src/
│       ├── pages/         # 10 route pages (Dashboard, Water, Habits, etc.)
│       ├── components/    # Reusable UI components
│       ├── context/       # AuthContext, WellnessContext, AchievementsContext (7)
│       ├── hooks/         # 4 custom hooks
│       ├── data/          # Static wisdom content
│       └── utils/         # emotionalMemory, soulArchetype, hinduCalendar
├── vercel.json            # Vercel deployment config
└── package.json           # Monorepo root scripts
```

---

## Quick Start

```bash
git clone <repo>
npm run install-all
# Set JWT_SECRET in backend/.env (MONGODB_URI & GEMINI_API_KEY optional)
npm run dev
```

Frontend → `:5173` · Backend → `:5000`

---

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `JWT_SECRET` | Yes | — | Token signing secret |
| `MONGODB_URI` | No | — | MongoDB connection (uses db.json if absent) |
| `GEMINI_API_KEY` | No | — | Google Gemini for AI chat |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | CORS whitelist (comma-separated) |
| `PORT` | No | `5000` | Backend port |
