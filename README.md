<div align="center">

```
   ╔══════════════════════════════════════════════════════╗
   ║           ██████╗██╈█╗   ██╗██╗ ██████╗             ║
   ║          ██╔════╝██╚██╗ ██╔╝██║██╔══██╗            ║
   ║          ██║     ██║╚████╔╝ ██║██║  ██║            ║
   ║          ██║     ██║ ╚██╔╝  ██║██║  ██║            ║
   ║          ╚██████╗██║  ██║   ██║██████╔╝            ║
   ║           ╚═════╝╚═╝  ╚═╝   ╚═╝╚═════╝             ║
   ║                                                      ║
   ║         Civic Intelligence Platform                  ║
   ║     AI-Powered Civic Issue Reporting for India       ║
   ╚══════════════════════════════════════════════════════╝

</div>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite 8"/>
  <img src="https://img.shields.io/badge/Gemini-2.0_Flash-8E75B2?style=flat&logo=googlebard&logoColor=white" alt="Gemini 2.0 Flash"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-FF9A00?style=flat&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Google_Cloud-Run-4285F4?style=flat&logo=googlecloud&logoColor=white" alt="Google Cloud Run"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/itslovepreet1212-stack/civiq?style=flat&color=blue" alt="License"/>
  <img src="https://img.shields.io/github/last-commit/itslovepreet1212-stack/civiq?style=flat&color=purple" alt="Last Commit"/>
  <img src="https://img.shields.io/github/repo-size/itslovepreet1212-stack/civiq?style=flat&color=green" alt="Repo Size"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat" alt="PRs Welcome"/>
</p>

<p align="center">
  <b>
    <a href="#-features">Features</a> &middot;
    <a href="#-tech-stack">Tech Stack</a> &middot;
    <a href="#-quick-start">Quick Start</a> &middot;
    <a href="#-architecture">Architecture</a> &middot;
    <a href="#-google-technologies">Google Tech</a> &middot;
    <a href="#-screenshots">Screenshots</a> &middot;
    <a href="#-license">License</a>
  </b>
</p>

<br/>

---

> **Your city breaks. Civiq fixes it.**  
Upload a photo of a broken streetlight, pothole, or garbage dump. Gemini AI classifies the issue, your community verifies it, authorities get auto-generated complaint letters — every step tracked end-to-end.

---

## ✦ Features

<table>
<tr>
<td width="50%">

### 🧠 Gemini Vision AI
Upload a photo — AI instantly identifies issue type, severity score, damage estimate, and butterfly-effect prediction. No manual forms needed.

### 👥 Community Verification
Neighbours confirm issues with one tap. 5+ confirmations auto-escalate to **Verified** status, pushing it to the top of the queue.

### 📮 Auto Complaint Letters
One tap drafts a formal complaint letter via Gemini and opens the correct municipal authority's email with pre-filled subject and body.

</td>
<td width="50%">

### 📊 City Pulse Insights
AI analyses all reported issues to surface patterns, predict urban hotspots, and recommend preventive action before problems worsen.

### ✅ AI Resolution Verification
Upload a "fixed" photo — Gemini visually verifies the repair before closing the issue, preventing fraudulent closures.

### 🕵️ Smart Monitor Agent
Proactive AI agent that watches for critical mass, rapid deterioration, and category hotspots across the city in real time.

### 🗺️ Interactive Map
Google Maps integration with status-colored markers, clustering, and dark theme for spatial issue awareness.

</td>
</tr>
</table>

<details>
<summary><b>🔍 View all features</b></summary>
<br/>

| Feature | Description |
|---|---|
| **Dispatch Agent** | Auto-dispatches complaint emails when issues reach Verified status, logged to localStorage |
| **Butterfly Timeline** | Visual day-0-to-day-90 escalation timeline for high-severity issues |
| **Impact Metrics** | Real-time cost saved, hours saved, CO₂ prevented, and community score |
| **Gamification** | Earn points and badges for reporting, verifying, and engaging; community leaderboard |
| **PDF Export** | Generate styled PDF reports with summary statistics and full issue listings |
| **Offline-first** | localStorage fallback for all CRUD operations when Supabase is unavailable |
| **Responsive Design** | Fully responsive with mobile hamburger menu and adaptive grid layouts |

</details>

<br/>

## ✦ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,supabase,nodejs,github,figma" />
</p>

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 with Fast Refresh |
| **AI & ML** | Google Gemini 2.0 Flash via `@google/generative-ai` SDK |
| **Mapping** | Google Maps via `@vis.gl/react-google-maps` |
| **Database** | Supabase (PostgreSQL) with localStorage fallback |
| **Styling** | Tailwind CSS with custom liquid-glass design system |
| **Animation** | Framer Motion for micro-interactions |
| **PDF** | jsPDF + jsPDF-AutoTable for report generation |
| **Testing** | Vitest + Testing Library + jsdom |
| **Fonts** | Satoshi (self-hosted variable), Geist Mono |
| **Deployment** | Google Cloud Run (containerized) |

<br/>

## ✦ Quick Start

```bash
# Clone the repo
gh repo clone itslovepreet1212-stack/civiq
cd civiq

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

> **Note:** The app works immediately with localStorage fallback if Supabase tables/buckets aren't set up. Gemini keys are rate-limited — mock data is used as fallback for demo purposes.

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test
```

<br/>

## ✦ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── IssueCard.jsx       # Issue list card with actions
│   ├── ResolveModal.jsx    # AI verification modal
│   ├── SmartMonitor.jsx    # Proactive AI agent widget
│   ├── DispatchAgent.jsx   # Auto-complaint dispatch
│   ├── ImpactMetrics.jsx   # Impact calculator
│   ├── ButterflyTimeline.jsx # Escalation timeline
│   ├── Navbar.jsx          # Responsive navigation
│   └── MeshBackground.jsx  # Animated background
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Dashboard.jsx       # Main hub with all agents
│   ├── ReportIssue.jsx     # Issue reporting form
│   ├── Insights.jsx        # AI city pulse analysis
│   ├── MapView.jsx         # Google Maps view
│   └── Leaderboard.jsx     # Gamification board
├── hooks/
│   ├── useIssues.js        # Central data hook (Supabase + localStorage)
│   └── usePoints.js        # Gamification points hook
├── utils/
│   ├── gemini.js           # All 4 Gemini integrations
│   └── pdfReport.js        # PDF report generator
├── supabase/
│   └── config.js           # Supabase client
└── lib/
    └── utils.js            # cn() utility
```

<br/>

## ✦ Google Technologies

| Technology | Usage |
|---|---|
| **Gemini 2.0 Flash** | Image analysis, severity scoring, complaint letter generation, city insights, resolution verification |
| **Google Maps API** | Issue geolocation, interactive map with status-colored markers |
| **Google Cloud Run** | Production deployment — auto-scaling, containerized |

<br/>

## ✦ Screenshots

<details>
<summary><b>📸 Click to expand screenshots</b></summary>
<br/>

| View | Description |
|---|---|
| **Home** | Landing page with animated mesh background, stats counter, feature grid |
| **Dashboard** | Central hub with Smart Monitor, Impact Metrics, Dispatch Agent, Issue grid with filters |
| **Report** | AI-powered form with auto-location, Gemini image analysis, severity slider |
| **Map** | Google Maps with status-colored markers for all reported issues |
| **Insights** | AI city pulse — patterns, predictions, hotspot detection |
| **Leaderboard** | Community rankings with points and badges |

</details>

<br/>

## ✦ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key |
| `VITE_GOOGLE_MAPS_KEY` | Yes | Google Maps JavaScript API key |

<br/>

## ✦ License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<br/>

---

<p align="center">
  <b>Built with 💜 for the Google AI Hackathon 2026</b>
  <br/>
  <sub>Report issues, suggest features, or contribute — every bit helps make Indian cities better.</sub>
</p>

<p align="center">
  <a href="https://github.com/itslovepreet1212-stack/civiq/issues">🐛 Report Bug</a> &middot;
  <a href="https://github.com/itslovepreet1212-stack/civiq/issues">✨ Request Feature</a>
</p>
