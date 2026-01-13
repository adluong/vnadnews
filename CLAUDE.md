# CLAUDE.md

## Project Overview

Korean News to Vietnamese Translation Web Application - a frontend news aggregator that fetches Korean news from multiple sources and translates them to Vietnamese for Vietnamese-speaking users.

## Tech Stack

- **Frontend:** Standalone HTML5
- **Styling:** Inline CSS with CSS variables, light/dark theme support
- **Translation API:** MyMemory API (free, no API key)
- **CORS Proxy:** api.allorigins.win

## Project Structure

```
news_app/
├── index.html    # Main standalone app
└── CLAUDE.md     # Project documentation
```

## News Sources

- Yonhap News (English RSS)
- KBS World
- Korea Times
- Korea Herald

## Key Configuration

Configuration is embedded in `index.html`:
- `refreshInterval`: 10 minutes (600000ms)
- `maxItemsPerSource`: 20
- `itemsPerPage`: 6 (for infinite scroll)
- CORS proxy: `https://api.allorigins.win/raw?url=`

## Build & Run

No build system required. Open `index.html` directly in a browser.

## Key Features

- Real-time news aggregation from 4 Korean news sources (Yonhap, KBS World, Korea Times, Korea Herald)
- Automatic translation to Vietnamese (Google Translate, Lingva, MyMemory fallback chain)
- Translation caching for performance
- Auto-refresh every 10 minutes (manual refresh supported)
- Source filtering tabs
- Infinite scroll with lazy translation
- New article notifications (toast)
- Light/dark mode (follows system preference)
- Responsive/mobile-friendly design
- Fallback sample data when RSS fails

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
