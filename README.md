# Tarang‑FlowState — Wellness Dashboard

A mindful wellness app with a full-stack architecture — React + Vite frontend, Express + MongoDB backend — to help you track hydration, build habits, journal your journey, explore wisdom, and connect with a community, all wrapped in a warm Indian-spiritual aesthetic.

---

## Features

| Feature | Description |
|---------|-------------|
| **Water Tracker** | Log daily water intake with quick-add bottle sizes (100ml–2000ml), custom amounts, animated progress ring, 7-day history, and ambient water drop particles. Persistent via API. |
| **Habits / Rituals** | Create daily rituals with custom icons and accent colors. Monthly calendar view, streak tracking, daily check-in with completion stats. Backed by MongoDB. |
| **Journal** | Write entries with mood tagging, word count, expandable entry history with delete, and journal streak tracking. Persistent storage via API. |
| **Wisdom Page** | Daily wisdom quotes, explore books by topic, life issues grid, reading progress tracking, and ambient sound. |
| **Heritage** | Explore Indian spiritual heritage, cultural motifs, and traditions. |
| **Community** | Community features with social interaction (API-backed). |
| **AI Assistant** | Floating AI chat assistant powered by Google Generative AI (Gemini) for guided reflection and conversation. |
| **Login / Signup** | JWT-based authentication with email/password and social buttons (Google, Apple). |
| **Dark Mode** | Full dark theme with adjustable glass-morphism and color palettes. |
| **Notifications & Reminders** | In-app toast notifications and reminder settings with push notification support. |
| **Sound Effects** | Ambient sound effects and hydration/habit completion feedback sounds. |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Page & component animations |
| Lucide React | Icon library |
| date-fns | Date utilities |
| clsx | Conditional classnames |
| html2canvas | Screenshot / share functionality |
| Google Generative AI | AI Assistant chat |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js / Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Groq SDK | AI inference |
| Sharp | Image processing |
| dotenv | Environment config |
| CORS | Cross-origin support |

### Deployment
| Tool | Purpose |
|------|---------|
| Vercel | Hosting (frontend + serverless API) |

---

## Project Structure

```
tarang-flowstate/
├── api/                    # Vercel serverless entry point
│   └── index.js
├── backend/                # Express REST API
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/
│   │   ├── auth.js         # Signup / login endpoints
│   │   ├── water.js        # Water intake CRUD
│   │   ├── habits.js       # Habits / rituals CRUD
│   │   ├── journal.js      # Journal entries CRUD
│   │   ├── chat.js         # AI chat endpoint
│   │   └── community.js    # Community features
│   ├── app.js              # Express app setup
│   ├── db.js               # MongoDB connection
│   └── server.js           # Entry point
├── frontend/               # React + Vite SPA
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── dashboard/
│       │   ├── wisdom/
│       │   ├── AIAssistant.jsx
│       │   └── ...
│       ├── context/        # React context providers
│       │   ├── AuthContext.jsx
│       │   ├── ThemeContext.jsx
│       │   ├── WellnessContext.jsx
│       │   ├── WisdomContext.jsx
│       │   ├── SoundEffectsContext.jsx
│       │   └── ToastContext.jsx
│       ├── hooks/          # Custom React hooks
│       │   ├── useHydrationStreak.js
│       │   ├── usePushNotifications.js
│       │   ├── useSoundEffects.js
│       │   └── useWisdomCarousel.js
│       ├── pages/          # Route pages
│       │   ├── Home.jsx
│       │   ├── Water.jsx
│       │   ├── Habits.jsx
│       │   ├── Journal.jsx
│       │   ├── WisdomPage.jsx
│       │   ├── Heritage.jsx
│       │   ├── Community.jsx
│       │   └── Login.jsx
│       ├── sections/       # Homepage sections
│       ├── data/           # Static data files
│       ├── styles/         # CSS modules
│       ├── utils/          # Utility functions
│       ├── assets/         # Images & icons
│       └── icons/          # SVG icon components
├── package.json            # Monorepo root scripts
└── vercel.json             # Vercel deployment config
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Dashboard with daily flow, wisdom carousel, heritage sections |
| `/water` | Water | Water intake tracker |
| `/habits` | Habits | Habit/ritual tracker with monthly calendar |
| `/journal` | Journal | Journal with mood & entry history |
| `/quotes` | Wisdom | Wisdom & books explorer |
| `/heritage` | Heritage | Indian spiritual heritage exploration |
| `/community` | Community | Community features & interactions |
| `/login` | Login | Login / signup |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Setup

```bash
# Install all dependencies
npm run install-all

# Set up environment variables
# backend/.env:
#   MONGO_URI=your_mongodb_connection_string
#   JWT_SECRET=your_jwt_secret
#   GEMINI_API_KEY=your_gemini_api_key

# Start both frontend & backend in development mode
npm run dev
```

### Individual dev servers

```bash
npm run dev:frontend   # Vite dev server (default :5173)
npm run dev:backend    # Express server (default :5000)
```

### Build for production

```bash
cd frontend && npm run build
```

---

## Design

- **Color palette:** saffron, gold, sand, ocean blue, ink, ivory
- **Fonts:** Cormorant Garamond (serif headings), Cinzel (display), DM Sans (body)
- **Motifs:** Om, lotus, diya lamps, mandala patterns
- **Style:** Glass-morphism cards with warm gradients and subtle borders

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET/POST | `/api/water` | Water intake |
| GET/POST | `/api/habits` | Habits CRUD |
| GET/POST | `/api/journal` | Journal entries |
| POST | `/api/chat` | AI chat |
| GET/POST | `/api/community` | Community features |
