# Tarang‑FlowState — Wellness Dashboard

A mindful wellness app built with React + Vite to help you track hydration, build habits, journal your journey, and explore wisdom — all wrapped in a warm, Indian-spiritual aesthetic.

## Features

- **Water Tracker** — Log daily water intake with quick-add bottle sizes (100ml–2000ml), custom amounts, animated progress ring, 7-day history, and ambient water drop particles.
- **Habits / Rituals** — Create daily rituals with custom icons and accent colors. Monthly calendar view to track consistency, streak tracking, and daily check-in with completion stats.
- **Journal** — Write entries with mood tagging (Grateful, Calm, Energized, etc.), word count, expandable entry history with delete, and journal streak tracking.
- **Wisdom Page** — Daily wisdom quotes, explore books by topic, life issues grid, reading progress tracking, and ambient sound.
- **Login / Signup** — Client-side auth UI with email/password and social buttons (Google, Apple). No backend.
- **Dark Mode** — Full dark theme with adjusted glass-morphism and color palettes.
- **Notifications & Reminders** — In-app toast notifications and reminder settings.
- **Sound Effects** — Ambient sound effects and hydration/habit completion feedback sounds.

## Tech Stack

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

## Routes

| Path | Page |
|------|------|
| `/` | Home — dashboard with daily flow, wisdom carousel, India sections |
| `/water` | Water intake tracker |
| `/habits` | Habit/ritual tracker with monthly calendar |
| `/journal` | Journal with mood & entry history |
| `/quotes` | Wisdom & books explorer |
| `/login` | Login / signup |

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Design

- Color palette: saffron, gold, sand, ocean blue, ink, ivory
- Fonts: Cormorant Garamond (serif headings), Cinzel (display), DM Sans (body)
- Indian spiritual motifs: Om, lotus, diya lamps, mandala patterns
- Glass-morphism cards with warm gradients and subtle borders
