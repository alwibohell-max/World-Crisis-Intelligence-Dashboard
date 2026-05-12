# World Crisis Intelligence Dashboard

A production-style, multi-page crisis intelligence dashboard built with the Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, Recharts, Leaflet, Zustand, TanStack Query, and public no-key data sources.

The dashboard is designed as a dark command-center interface for monitoring global crisis signals such as earthquakes, weather risk, country context, emergency infrastructure, currency/economic signals, and public news-like feeds. It intentionally uses only public APIs that do **not** require login, API keys, OAuth, registration, or paid access.

## Features

- Route-based dashboard with a persistent sidebar and top command/search bar.
- Global overview with crisis score cards, latest earthquakes, data freshness, source status, crisis timeline, and a mini map.
- Interactive crisis map using Leaflet with earthquake, weather, saved-location, and infrastructure marker support.
- Earthquake monitoring powered by the USGS Earthquake API, including normalized magnitude, depth, recency, tsunami flag, and risk scoring.
- Weather intelligence powered by Open-Meteo Geocoding and Forecast APIs, including current conditions, hourly/daily forecast models, charts, save-location actions, and risk scoring.
- Country intelligence powered by REST Countries, World Bank indicators, and Wikipedia summaries.
- Saved locations persisted locally with Zustand and `localStorage`.
- Unified timeline combining earthquakes and public signal feeds.
- Compare, OSM infrastructure, currency/economy, global search, settings, and about/data-source routes.
- Reusable risk engine with Low, Guarded, Elevated, High, and Critical severity levels.
- Graceful API fallback patterns so a failed provider does not crash the UI.

## Routes

| Route | Purpose |
| --- | --- |
| `/dashboard` | Global crisis overview, score cards, map, timeline, and countries to watch. |
| `/map` | Interactive global crisis map with layer controls and severity colors. |
| `/earthquakes` | USGS earthquake monitor with table, map, severity, tsunami, and activity metrics. |
| `/weather` | City search, current weather, charts, forecast summary, and saved-location action. |
| `/countries` | Country profile, flag, demographics, World Bank indicators, Wikipedia context, and neighbors. |
| `/locations` | Local saved locations with JSON export-style display and remove controls. |
| `/timeline` | Unified crisis/event timeline from earthquakes and public signal feeds. |
| `/compare` | Region comparison with radar-style visualization and comparison table. |
| `/osm-intel` | Nominatim search and Overpass infrastructure intelligence for hospitals, police, fire stations, shelters, airports, and ports. |
| `/currency` | Frankfurter exchange-rate cards and basic trend context. |
| `/search` | Categorized global search for countries, cities, and Wikipedia topics. |
| `/settings` | Theme, units, and localStorage reset controls. |
| `/about` | Data source list, no-key policy, rate-limit notes, and crisis-data disclaimer. |

## Public No-Key APIs

All API integrations live under `lib/api/` and are designed to return normalized application models with source metadata, timestamps, fallback values, and error-safe behavior.

| Provider | Used for |
| --- | --- |
| Open-Meteo Geocoding API | City/location search. |
| Open-Meteo Forecast API | Current weather, hourly forecast, daily forecast, weather risk. |
| USGS Earthquake API | Latest earthquake events and seismic risk. |
| REST Countries API | Country metadata, flags, currencies, languages, borders, and coordinates. |
| World Bank API | Population, GDP, urbanization, and life-expectancy indicators. |
| Wikipedia REST API | Country/topic summaries. |
| OpenStreetMap Nominatim API | Place search for OSM intelligence. |
| Overpass API | Emergency and transport infrastructure points. |
| Frankfurter API | Currency rates and recent exchange-rate trends. |
| Hacker News Firebase API | Global technology/news signal feed. |
| Spaceflight News API | Space/geopolitical adjacent public signal feed. |
| ReliefWeb API | Humanitarian report signal feed with graceful fallback. |

## Risk Scoring

Risk scoring is implemented in `lib/risk/engine.ts`. The dashboard uses a normalized 0-100 scale:

| Score | Level |
| --- | --- |
| 0-20 | Low |
| 21-45 | Guarded |
| 46-70 | Elevated |
| 71-90 | High |
| 91-100 | Critical |

Current scoring functions include:

- `earthquakeRisk` — combines magnitude, depth, and recency.
- `weatherRisk` — combines temperature extremes, wind speed, and precipitation.
- `infrastructureRisk` — estimates readiness from mapped emergency facilities.
- `combinedRisk` — aggregates multiple provider-specific risk scores.
- `forecastPeakRisk` — estimates peak weather risk across forecast days.

## Project Structure

```text
app/
  dashboard/      # Overview route
  map/            # Global crisis map route
  earthquakes/    # Earthquake monitor route
  weather/        # Weather intelligence route
  countries/      # Country intelligence route
  locations/      # Saved locations route
  timeline/       # Unified crisis timeline route
  compare/        # Region comparison route
  osm-intel/      # OpenStreetMap intelligence route
  currency/       # Currency/economy route
  search/         # Global search route
  settings/       # User preferences route
  about/          # About and data sources route
components/
  layout/         # App shell, sidebar, top bar, providers
  maps/           # Leaflet crisis map wrapper
  charts/         # Recharts visualizations
  cards/          # Metric and risk cards
  tables/         # Data tables
  forms/          # Form/action components
  shared/         # Shared states, badges, timeline, search
  ui/             # shadcn-style primitive components
lib/
  api/            # Public API service layer
  risk/           # Risk engine
  storage/        # localStorage helpers
  types/          # Shared TypeScript models
  utils.ts        # General helpers
store/            # Zustand global state
```

## Getting Started

### Prerequisites

- Node.js 18.18 or newer.
- npm, pnpm, yarn, or another compatible package manager.
- Network access to public no-key APIs.

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and the root route will redirect to `/dashboard`.

### Build for production

```bash
npm run build
npm run start
```

### Type checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Configuration

No secret environment variables are required. The application is intentionally designed to run without API keys.

User preferences are stored locally in the browser through `localStorage`, including:

- Saved locations.
- Recent searches.
- Preferred units.
- Theme selection.
- Default map layer.
- Risk threshold settings.

## Data Reliability and Safety Disclaimer

This project is an intelligence dashboard prototype and is **not** an emergency alerting system. Public crisis data can be delayed, incomplete, revised, rate-limited, or temporarily unavailable. Always confirm urgent safety decisions with official emergency management agencies, meteorological services, geological agencies, and local authorities.

## Development Notes

- Each external provider should be accessed only through a module in `lib/api/`.
- New API functions should include TypeScript types, timeout handling, error-safe fallback behavior, and normalized return models.
- Use TanStack Query for client-side remote fetching and caching.
- Use the shared risk engine rather than duplicating severity logic in components.
- Keep pages focused and route-based; avoid putting every feature on one page.
- Avoid adding APIs that require paid access, API keys, OAuth, registration, or user login.
