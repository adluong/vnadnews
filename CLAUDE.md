# CLAUDE.md

## Project Overview

Korean News to Vietnamese Translation Web Application - a frontend news aggregator that fetches Korean news from multiple sources and translates them to Vietnamese for Vietnamese-speaking users.

## Tech Stack

- **Frontend:** React (JSX) and standalone HTML5
- **Styling:** Inline CSS with CSS variables, dark theme
- **Translation APIs:** Anthropic Claude API (JSX), MyMemory API (HTML)
- **CORS Proxy:** api.allorigins.win

## Project Structure

```
news_app/
├── korean-news-vn.jsx           # React component version
├── korean-news-vietnamese.html  # Standalone HTML version
└── mnt/user-data/outputs/       # Generated outputs
```

## Two Implementations

1. **JSX Version** (`korean-news-vn.jsx`) - React component for integration into larger apps, uses Claude API
2. **HTML Version** (`korean-news-vietnamese.html`) - Standalone single-file app, uses MyMemory API

## News Sources

- Yonhap News (English RSS)
- KBS World
- Arirang
- Korea Herald

## Key Configuration

Configuration is embedded in source files:
- `refreshInterval`: 5 minutes (300000ms)
- `maxItemsPerSource`: 5
- CORS proxy: `https://api.allorigins.win/raw?url=`

## Build & Run

No build system required. The HTML version runs directly in a browser. The JSX version requires a React environment.

## Key Features

- Real-time news aggregation from 4 sources
- Automatic translation to Vietnamese
- Translation caching
- Auto-refresh every 5 minutes
- Source filtering
- New article notifications
- Responsive/mobile-friendly design
- Fallback sample data

## Code Conventions

- UI text in Vietnamese (target audience)
- Code comments in English
- Descriptive variable names
- Functional programming patterns
- Event-driven state updates

## Testing

No automated tests. Manual testing via:
- `getSampleNews()` function provides mock data
- Toast notifications and console logging for debugging
