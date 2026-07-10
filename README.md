Intelligence Dashboard

A premium, AI-powered intelligence dashboard built with Next.js, React, TypeScript, and Tailwind CSS — designed to look and feel like a real product, not a demo.

It brings market signals, news flow, narrative shifts, and AI-generated briefings into a single, cohesive workspace — helping users quickly understand what's changing, why it matters, and what might happen next.

![App demo GIF](./public/images/preview.gif)

Screenshots

### Home page

![Home page screenshot](./public/images/Screenshot%202026-06-16%20135556.png)
![Home page screenshot](./public/images/Screenshot%202026-06-22%20212442.png)

Why This Project

This isn't a UI exercise — it's a frontend-focused product build combining layout architecture, real interactivity, theming, and AI-assisted data interpretation into one cohesive app. It's built the way a modern intelligence or market-monitoring platform would actually be designed: information-dense, fast to scan, and visually premium.

Key Features

Dashboard shell architecture — sidebar, header, main content area, and a right-hand insight panel, all built as reusable layout components
AI Brief Panel — scenario-based interpretation of current events, generated via AI to help users understand implications, not just headlines
Market impact cards — quick-scan signal cards for at-a-glance market context
Interactive news/article switching — swap between stories inside the dashboard without full page reloads
Multi-theme system — three distinct visual themes switchable in real time (see below)
Watchlist interaction flow — track and monitor items of interest
Fully responsive — desktop, tablet, and mobile layouts

Themes

Three visual themes, implemented with CSS variables and a live theme-switching system:

ThemeStyleDefaultDeep navy, premium dashboard aesthetic with teal/violet accentsSunsetBold, controlled mix of magenta, orange, pink, and purpleLightSoft milk-toned interface with dark blue accents for daytime use

Visual direction is inspired by modern SaaS dashboards, Bloomberg-style information density, and polished product UI — depth, glow, and strong visual hierarchy throughout.

Tech Stack

LayerTechnologyFrameworkNext.js (App Router)UI LibraryReactLanguageTypeScriptStylingTailwind CSS + CSS variablesState / InteractivityReact client components, local component stateData LayerExternal APIs (articles/market data) + AI-generated briefing logicToolingESLint, modern component-based architecture

Architecture

Built around a set of reusable, composable UI building blocks rather than page-specific one-off code:

Shell
├── Sidebar
├── Header
├── EventCard
├── ImpactCard
├── ScenarioCard
├── ThemeSwitcher
└── NewsSwitcher

Core architectural principles:

Shared dashboard shell used across all views
Theme-driven styling through global CSS variables (no hardcoded colors in components)
Clear separation between server-rendered page data and client-side interactivity
Structured for easy route and feature expansion

Getting Started

bashgit clone <repo-url>
cd intelligence-dashboard
npm install
npm run dev

Open http://localhost:3000 in your browser.

Project Status

Shipped:

Core dashboard UI and layout system
Theme switching (3 themes)
Reusable layout components
Article/news switching logic
Market and intelligence-oriented dashboard sections
Responsive design across screen sizes

In progress:

Shared interactive state across dashboard sections
Persistent watchlist behavior
Deeper, richer data integration
Final UX polish for production readiness

Roadmap

Persistent watchlist state (localStorage / backend)
Deeper live API integration for market + news data
Smarter filtering and search
Expanded AI scenario analysis
Richer data visualization (charts, trend lines)
Production deployment (Vercel)

Built as a portfolio-grade frontend project, with a focus on clean architecture, responsive design, and modern dashboard UX.
