# Civiq — Civic Intelligence Platform

Your city breaks. Civiq fixes it.

AI-powered civic issue reporting platform built for Indian municipalities. Upload a photo, Gemini auto-analyses the problem, your community verifies it, and authorities get formal complaints — every step tracked.

## Features

- **Gemini Vision** — Upload a photo; AI instantly identifies issue type, severity, damage estimate, and butterfly-effect prediction
- **Community Verification** — Neighbours confirm issues; 5+ confirmations auto-escalate to Verified status
- **Auto Complaint Letters** — One tap drafts a formal letter to the right municipal authority with mailto integration
- **City Pulse Insights** — AI detects deteriorating zones, predicts urban hotspots, and recommends action
- **AI Resolution Verification** — Upload a "fixed" photo; Gemini verifies the repair before closing the issue
- **Smart Monitor** — Proactive AI agent that watches for critical patterns and alerts the community
- **Interactive Map** — Google Maps view with status-colored markers and dark theme
- **PDF Export** — Generate styled PDF reports with summary statistics and full issue listings
- **Gamification** — Earn points and badges for reporting; community leaderboard

## Tech Stack

- **Framework:** React 19 + Vite 8
- **AI:** Google Gemini 2.0 Flash via @google/generative-ai SDK
- **Maps:** Google Maps via @vis.gl/react-google-maps
- **Database:** Supabase (with localStorage fallback for offline use)
- **Styling:** Tailwind CSS with custom liquid-glass design system
- **Animation:** Framer Motion
- **PDF:** jsPDF + jsPDF-AutoTable
- **Fonts:** Satoshi (self-hosted), Geist Mono (Google Fonts)

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file with your API keys:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

## Build

```bash
npm run build
npm run preview
```

## License

MIT
