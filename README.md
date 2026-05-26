# Tarang‑FlowState — Wellness Dashboard

A mindful wellness app to track hydration, build habits, journal, explore wisdom, and connect with community — wrapped in a warm Indian-spiritual aesthetic.

**Brand variants:** Saanjh (Twilight Sanctuary) · Antara (Inner Space & Rhythm)  
**AI Companion:** Sahayak — a calm, emotionally-intelligent persona rooted in Indian wellness philosophy

---

## Quick Start

```bash
git clone <repo>
npm run install-all
# Set JWT_SECRET in backend/.env (MONGODB_URI and GEMINI_API_KEY optional)
npm run dev
```

Frontend → `:5173` · Backend → `:5000`

---

## Features

### Wellness Tracking
| Feature | Description |
|---------|-------------|
| **Water Tracker** | Daily intake with quick-add bottle sizes (100ml–2000ml), custom amounts, animated progress ring, goal slider, 7-day history, ambient water particles |
| **Habits / Rituals** | Create daily rituals with icons & accent colors. Monthly calendar, streak tracking, daily check-in, completion stats. Hindu calendar integration (Tithi, Paksha, Nakshatra, Moon phase). Scientific insights panel |
| **Journal** | 7 mood tags, word count, emotional reflection analysis, entry history with delete, journal streak, mood trends heatmap & chart |

### Wisdom & Heritage
| Feature | Description |
|---------|-------------|
| **Wisdom Page** | Daily quotes, 14 topics with 12 books, life issues grid with detail modals, book reader with reading progress, bookmarks & notes, wisdom streak, ambient sound, sparkles, mandala portal |
| **Heritage** | 13 Indian scholars, ancient texts, interactive map, audio narration, flowing animated symbols |

### Community
| Feature | Description |
|---------|-------------|
| **Community** | Activity feed, dummy posts, intentions board with search, prana (karma) counter, share functionality |

### Personalization & Growth
| Feature | Description |
|---------|-------------|
| **Profile & Account** | Avatar upload (base64), name/bio/location editing, password change, account deletion, soul archetype card, theme/sound/notification toggles |
| **Achievements & Badges** | 23 badges (Streaks, Journaling, Wellness, Wisdom). Automatic unlock via `AchievementEngine`. Badge gallery, modal, toast notifications |
| **Soul Archetype** | Computes your archetype — Dreamer, Warrior, Seeker, or Restorer — from journal history & habits, with a wellness score |
| **Daily Sankalpa** | Set a daily intention from the dashboard |
| **Breathing Portal** | Guided breathing exercise with animated lotus & calming audio |

### AI & Assistant
| Feature | Description |
|---------|-------------|
| **AI Assistant** | Floating Sahayak chat powered by Google Gemini with Groq SDK fallback. In-memory conversation cache (5 msg/user, 1h TTL) |

### Platform & UX
| Feature | Description |
|---------|-------------|
| **Login / Signup** | JWT-based auth with email/password, resilient localStorage session |
| **Dark Mode** | Full dark theme with glass-morphism & adjustable color palettes |
| **Notifications & Reminders** | In-app toasts, browser push notifications, reminder settings, retention nudge |
| **Sound Effects** | 7 ambient presets (flute, om, sitar, rain, tibetan bowl, wind chimes) + interaction sounds |
| **PWA Support** | Service worker, offline fallback, maskable icons, manifest, install banner |
| **Time-Adaptive UI** | Hero adapts backgrounds & greetings by time-of-day with celestial glow effects |

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | React 18 · Vite 5 · React Router v6 · Tailwind CSS 3 · Framer Motion · Lucide React · date-fns · clsx · html2canvas |
| **AI** | Google Generative AI (Gemini) · Groq SDK |
| **Backend** | Node.js · Express · Mongoose · MongoDB (JSON file fallback) · JWT · bcryptjs · Sharp · compression · express-rate-limit |
| **Monitoring** | @vercel/analytics · @vercel/speed-insights |
| **Hosting** | Vercel (frontend + serverless API) |

---

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard (daily flow, sankalpa, stats, wisdom carousel, heritage) |
| `/water` | Water intake tracker |
| `/habits` | Habit & ritual tracker |
| `/journal` | Journal with mood trends |
| `/quotes` | Wisdom explorer & books |
| `/heritage` | Heritage exploration |
| `/community` | Feed & intentions board |
| `/profile` | Profile management & settings |
| `/badges` | Achievement badge gallery |
| `/login` | Login / signup |

---

## API Endpoints

### Auth
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |

### Wellness
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST/DELETE | `/api/water` | Water intake |
| GET/POST/DELETE | `/api/habits` | Habits |
| GET/POST/DELETE | `/api/journal` | Journal entries |
| GET | `/api/journal/mood-trends` | Mood heatmap data |

### Community
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/community/feed` | Activity feed |
| GET/POST | `/api/community/intentions` | Intentions board |

### Profile
| Method | Endpoint | Purpose |
|--------|----------|---------|
| PUT | `/api/profile` | Update profile |
| PUT | `/api/profile/avatar` | Upload avatar |
| PUT | `/api/profile/password` | Change password |
| DELETE | `/api/profile` | Delete account |

### Achievements
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/badges` | Badges + progress |
| POST | `/api/badges/track` | Track activity & evaluate |

### AI
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | AI companion chat |

---

## Project Structure

```
tarang-flowstate/
├── api/                          # Vercel serverless entry
├── backend/
│   ├── middleware/auth.js        # JWT auth
│   ├── routes/                   # auth, water, habits, journal,
│   │                             # chat, community, profile, badges
│   ├── services/AchievementEngine.js  # Badge evaluation
│   ├── app.js                    # Express setup
│   ├── db.js                     # MongoDB + JSON fallback
│   └── server.js                 # Cluster-mode startup
├── frontend/
│   ├── public/                   # sw.js, offline.html, manifest, icons
│   └── src/
│       ├── components/           # dashboard/, achievements/, wisdom/,
│       │                         # DailySankalpa/, Navbar, AIAssistant,
│       │                         # BreathingPortal, Notification*, etc.
│       ├── context/              # 7 context providers (Auth, Theme,
│       │                         # Wellness, Achievements, Wisdom, etc.)
│       ├── hooks/                # 4 custom hooks
│       ├── pages/                # 10 route pages
│       ├── sections/             # HeroSection, DailyFlow, etc.
│       ├── data/wisdomData.js    # 14 topics, 12 books, life issues
│       ├── styles/               # globals.css, animations.css, etc.
│       ├── utils/                # emotionalMemory, soulArchetype,
│       │                         # hinduCalendar, helpers
│       ├── icons/                # DiyaLamp, LotusFlower, TambaaVessel
│       └── assets/               # hero/, heritage/, books/, badges/,
│                                 # wisdom_music/, pages/
├── package.json
├── db.json                       # JSON fallback DB
└── vercel.json
```

---

## Badge System

23 badges across 4 categories, automatically tracked:

| Category | Badges |
|----------|--------|
| **Streaks** | 3d · 7d · 14d · 21d · 30d · 60d · 100d |
| **Journaling** | Journalled 10× · 30 daily · Midnight Reflector |
| **Wellness** | Hydration Sage · Calm Mind · Discipline Builder · Focus Monk · Sankalpa Keeper · Sunrise Consistency · Cosmic Rhythm |
| **Wisdom** | Wisdom Seeker · Third Eye Open · The Unshaken |

---

## Design

**Palette:** saffron · gold · sand · ocean blue · ink · ivory  
**Fonts:** Cormorant Garamond (headings) · Cinzel (display) · DM Sans (body)  
**Motifs:** Om · lotus · diya lamps · mandala  
**Style:** Glass-morphism cards, warm gradients, subtle borders

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | — | Secret for signing tokens |
| `MONGODB_URI` | No | — | MongoDB connection string (JSON fallback if absent) |
| `GEMINI_API_KEY` | No | — | Google Gemini API key for AI chat |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | CORS origins (comma-separated) |
| `PORT` | No | `5000` | Backend server port |