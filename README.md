# 🌸 Tarang‑FlowState — Wellness & Mindfulness Dashboard

Tarang-FlowState is a mindful wellness application designed to help users track hydration, build positive habits, journal their thoughts, and absorb ancient wisdom. It is wrapped in a warm, glassmorphism design with a rich Indian-spiritual aesthetic.

---

## ✨ Features

- **🧘 Mindful Tracking & Intentions**:
  - **Water Intake**: Daily goal rings, progress tracking, and hydration logs.
  - **Daily Sankalpa (Intention) Generator**: An AI-powered engine (Llama-3.3-70B / Gemini) that processes your current state of mind (e.g., placement stress, screen burnout) to generate a custom daily intention, friendly senior-buddy style advice, personalized grounding rituals, and matching ancient wisdom quotes.
  - **Habits & Rituals**: Streak tracking, completion calendar, and integrations with the traditional Hindu calendar.
  - **Emotional Journaling**: Daily mood tracking (7 emotional presets), mood trend heatmaps, and consistency streaks.
- **📜 Wisdom Library**:
  - Daily ancient quote reflections.
  - A structured catalog of **14 topics × 12 books** of ancient philosophy.
  - Custom Book Reader supporting progress tracking, bookmarks, and color-coded sticky notes.
- **🗺️ Indian Heritage Portal**:
  - Interactive map highlighting **13 Indian scholars** and their contributions to science, astronomy, and mathematics.
  - Narration support for reading pages.
- **🤖 Sahayak AI Assistant**:
  - A floating, context-aware AI wellness companion.
  - Utilizes **Groq SDK (Llama-3.3-70B)** as the primary engine with **Google Gemini** as a smart fallback.
- **🎭 Soul Archetype**:
  - Automatically calculates your archetype (*Dreamer*, *Warrior*, *Seeker*, or *Restorer*) based on your journaling patterns and habits.
- **🎵 Ambient Soundscapes**:
  - **7 customizable ambient soundscapes** (Temple bells, flutes, rain, tanpura) to ground your focus while practicing.

---

## 🔒 Security & Optimization Implementations

This project implements rigorous security and performance standards:

- **🛡️ Input Sanitization**:
  - **XSS Prevention**: All user-controlled text inputs are HTML-escaped to prevent script injection.
  - **NoSQL Injection Block**: Custom recursive filtering strips keys starting with `$` to prevent operators from bypassing DB logic.
  - **Type Safety**: Automatic type coercion prevents object injection in routes.
- **⚡ Layered Rate Limiting**:
  - **Global Limiter**: Restricts traffic to 100 requests per 15 minutes per IP.
  - **Auth Limiter**: Blocks login/signup brute force attempts (max 10 requests per 15 minutes).
  - **Sahayak AI Limiters**: Strict minutely (5/min) and hourly (30/hour) limits protect against scraper bots and API quota drainage.
- **🖼️ Secure Base64 File Uploads**:
  - Avatar uploading checks lengths to enforce a strict **2MB size limit**.
  - Strict MIME header verification allows only `jpeg`, `png`, and `jpg`.
  - Regular expression checks ensure the payload consists of valid Base64 character sets.
- **📁 API Versioning & Fallbacks**:
  - Endpoints are mounted behind the `/api/v1/` prefix.
  - A fallback routing middleware dynamically redirects legacy `/api/` calls to `/api/v1/` internally, ensuring zero downtime and complete backward compatibility.
- **🏋️ Upgraded Hashing & Session Cryptography**:
  - Swapped `bcryptjs` for native `bcrypt` to speed up password hashing by **20x** and mitigate server Denial of Service (DoS) CPU starvation.
  - Transitioned token handling to `jose` for modern, lightweight, edge-compatible JWT session management.
- **⚙️ Custom React Hooks & State Decoupling**:
  - Decoupled complex sadhana session timing and audio panel state machines out of the main dashboard (`Home.jsx`) into lightweight custom hooks (`useSadhanaTimer` and `useSoundSanctuary`).
  - Centralized layout stylesheets and sound preset models into a single config module (`constants.js`) to eliminate hardcoded redundancies across the codebase.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS 3, Framer Motion, Lucide React, html-to-image |
| **Backend** | Node.js, Express.js (v4), native `bcrypt`, `jose` |
| **Database** | MongoDB (via Mongoose) / Local JSON Database fallback |
| **APIs** | Google Generative AI (Gemini), Groq SDK (Llama) |
| **Hosting** | Vercel (Edge-compatible serverless functions) |

---

## 📁 Project Structure

```text
tarang-flowstate/
├── api/                   # Vercel Serverless Function entry (imports app.js)
├── backend/
│   ├── app.js             # Express application setup, middlewares, and routes
│   ├── server.js          # Local development server bootloader
│   ├── db.js              # Database router (MongoDB Mongoose OR JSON file DB)
│   ├── db.json            # Local JSON database storage file
│   ├── middleware/        # JWT Authentication, Rate limiters, Sanitizers
│   ├── routes/            # Versioned API routes (auth, profile, journal, sankalpa, etc.)
│   ├── models/            # Mongoose Schema Definitions
│   └── services/          # Achievement and Badge evaluation engine
├── frontend/
│   ├── public/            # Static assets and PWA files
│   └── src/
│       ├── config/        # Styling and soundscape presets constants
│       ├── hooks/         # Custom state hooks (timer, sound sanctuary, etc.)
│       ├── components/    # Reusable modular UI components
│       ├── context/       # State management (Auth, Theme, Wellness, etc.)
│       ├── pages/         # Route views (Dashboard, Wisdom, Heritage, etc.)
│       ├── sections/      # Home view layouts (HeroSection, DailyFlow, etc.)
│       ├── utils/         # Helper functions ( हिंदू Calendar, Archetype calculators)
│       └── assets/        # Audios, badges, images, and fonts
├── package.json           # Root workspace and script configurations
└── vercel.json            # Deployment routing instructions
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your system.

### 2. Installation
Clone the repository and install all frontend and backend dependencies using the monorepo script:
```bash
# Clone the repository
git clone <your-repository-url>
cd MYfirstproject

# Install all packages
npm run install-all
```

### 3. Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
JWT_SECRET=your_jwt_signing_key_here
MONGODB_URI=your_mongodb_connection_string_optional
GEMINI_API_KEY=your_google_gemini_api_key_optional
ALLOWED_ORIGINS=http://localhost:5173
```
> 💡 *Note: If `MONGODB_URI` is omitted, the backend automatically writes and reads data to and from the local `backend/db.json` file for offline development.*

### 4. Running Locally
Run both the React frontend and the Express backend concurrently:
```bash
npm run dev
```
- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **Express Backend**: [http://localhost:5000](http://localhost:5000)
