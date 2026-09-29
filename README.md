# Phoenix Malls – Global Map Experience

A polished, production-style web application for discovering Phoenix Malls across the world through an interactive map, with live OPEN/CLOSED status calculated from each mall's own local timezone.

**Journey:** World Map → Country → Phoenix Malls → Mall Marker → Live Status → Mall Details

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Data Model](#data-model)
7. [API Abstraction (Mock → REST)](#api-abstraction-mock--rest)
8. [Timezone & Live Status Logic](#timezone--live-status-logic)
9. [Map Provider](#map-provider)
10. [Setup & Run Instructions](#setup--run-instructions)
11. [Testing](#testing)
12. [Assumptions](#assumptions)
13. [Known Limitations](#known-limitations)
14. [Future Improvements](#future-improvements)
15. [Why These Technologies?](#why-these-technologies)

---

## Overview

This is the web half of a Frontend / Full Stack Developer assignment. It lets a user explore Phoenix Malls worldwide on an interactive map, drill into a country, see live OPEN/CLOSED status per mall (calculated in that mall's own timezone), and view a polished details card with address, hours, contact info and directions.

The app is built so that **mock JSON data can be swapped for a real REST API without touching any UI component** — the data layer is fully abstracted behind a repository interface.

---

## Features

- Interactive, full-screen world map (pan, zoom, keyboard-accessible)
- Country discovery with pulsing highlight markers
- Country → Mall drill-down, fully data-driven (no hardcoded lists)
- Custom mall markers: green pulsing (OPEN), red (CLOSED), grey (hours unavailable)
- Selected-marker highlight and smooth map fly-to animations
- Mall details card: image (with fallback), status badge, today's hours (12-hour format), address, phone, website, directions link
- Responsive layout: floating card on desktop, bottom sheet on mobile
- **Mall search** across all countries (debounced, min 2 characters)
- **Open Now / Closed filter**, live and timezone-aware
- **Nearest mall to me**, using the browser's geolocation and haversine distance
- Loading / empty / error states throughout, with retry
- Accessible: keyboard focus rings, `aria-live` regions, reduced-motion support
- Midnight-crossing operating hours supported (e.g. 6 PM–2 AM)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI and type safety |
| Vite | Dev server and build tool |
| Tailwind CSS v4 | Styling via utility classes |
| Leaflet + React-Leaflet | Interactive map rendering |
| OpenStreetMap | Free, keyless map tiles |
| Luxon | Timezone-aware date/time handling |
| Lucide React | Icon set |
| Vitest | Unit testing for business logic |

No Redux: application state (selected country, selected mall, filter, search query) is small and local, handled with plain React state and a handful of custom hooks.

---

## Architecture

```
UI (components, pages, map)
        │
        ▼
   React hooks (useCountries, useMalls, useMallSearch, useNearestMall, ...)
        │
        ▼
   mallService (single entry point, wraps errors)
        │
        ▼
  MallRepository (interface / contract)
        │
   ┌────┴─────┐
   ▼          ▼
mockMallRepository   httpMallRepository (future)
   │
   ▼
countries.json / malls.json
```

**Key principle:** UI components never import JSON or know about the data source. They call hooks, which call `mallService`, which calls whatever `MallRepository` implementation is currently wired in. Business logic (timezone/status calculation, filtering, nearest-mall search) lives in pure, framework-free functions under `src/logic/`, fully unit-tested.

---

## Folder Structure

```
src/
├── assets/              # static assets
├── components/
│   ├── ui/              # generic UI: LoadingState, ErrorState, EmptyState, AppHeader
│   └── mall/            # MallDetailsCard, MallListPanel, MallSearchBox, StatusFilterBar,
│                         # NearestMallButton, MallImage, MallStatusBadge
├── map/                 # all Leaflet/React-Leaflet code
│   ├── MapView.tsx       # map shell (tiles, bounds, zoom control)
│   ├── MapController.tsx # flies the map to a selected country
│   ├── MallFocus.tsx     # flies the map to a selected mall
│   ├── CountryMarkers.tsx
│   ├── MallMarkers.tsx
│   ├── markerIcon.ts
│   └── mapConfig.ts
├── pages/
│   └── HomePage.tsx      # composes the whole experience
├── hooks/                # useCountries, useMalls, useMallSearch, useNearestMall,
│                         # useAsync, useNow, useDebouncedValue
├── services/             # mallRepository (interface), mockMallRepository,
│                         # mallService, locationService
├── data/                 # countries.json, malls.json (mock data source)
├── types/                # Mall, Country, OperatingHours, MallStatus
├── logic/                # getMallStatus, filterMallsByStatus, findNearestMall
│                         # + matching *.test.ts files
├── utils/                # format.ts (12-hour time), mallImages.ts (photo fallback pool)
├── App.tsx
└── main.tsx
```

This is a **by-type** structure (not by-feature), chosen because the project is small enough that type-based grouping is easier to navigate and explain than feature folders would be.

---

## Data Model

### `Mall`

```ts
interface Mall {
  id: string
  name: string
  country: string
  countryCode: string
  city: string
  latitude: number
  longitude: number
  image: string
  address: string
  phone?: string
  website?: string
  timezone: string            // IANA name, e.g. "Asia/Kolkata"
  operatingHours: OperatingHours
}
```

### `OperatingHours`

```ts
type DayOfWeek = 'monday' | 'tuesday' | ... | 'sunday'

interface DayHours {
  open: string   // 24-hour "HH:mm", mall-local time
  close: string  // 24-hour "HH:mm", mall-local time
}

type OperatingHours = Partial<Record<DayOfWeek, DayHours | null>>
```

Three possible states per day:
- **`DayHours`** — open during those hours
- **`null`** — explicitly closed all day
- **missing key** — no data available (shown as "hours unavailable", never guessed as closed)

### `Country`

```ts
interface Country {
  code: string        // ISO 3166-1 alpha-2, also used as the API id
  name: string
  latitude: number
  longitude: number
  zoom: number
  labelSide?: string  // optional: which side the map label renders on
}
```

Times are always stored as **24-hour strings in the mall's own local time**. They are only ever converted to a 12-hour display format (`10:00 AM – 10:00 PM`) at render time, via `formatHoursRange()` in `utils/format.ts`. This keeps the underlying data simple to compare and sort, while showing something friendlier to users.

---

## API Abstraction (Mock → REST)

The `MallRepository` interface is the single contract the rest of the app depends on:

```ts
interface MallRepository {
  getCountries(): Promise<Country[]>
  getMallsByCountry(countryCode: string): Promise<Mall[]>
  getMallById(mallId: string): Promise<Mall | null>
  getAllMalls(): Promise<Mall[]>
  searchMalls(query: string): Promise<Mall[]>
}
```

Today, `mockMallRepository` implements it by reading the local JSON files (with a simulated network delay so loading states are visible). The **only** place a data source is chosen is `mallService.ts`:

```ts
const repository: MallRepository = createMockMallRepository()
// Later: const repository = createHttpMallRepository('/api')
```

To move to a real backend, you would:

1. Implement `httpMallRepository.ts` using `fetch`, mapping each method to:
   - `GET /countries`
   - `GET /countries/{countryId}/malls`
   - `GET /malls/{mallId}`
   - `GET /malls`
   - `GET /malls?search={query}`
2. Swap the one line in `mallService.ts`.

No component, hook, or page changes. This is the core interview point for "how would you replace mock data with a real API?"

`mallService` also wraps every repository call in a `try/catch`, converting any failure into a `ServiceError` with a user-friendly message, so hooks and components never deal with raw network errors.

---

## Timezone & Live Status Logic

All status logic lives in `src/logic/getMallStatus.ts`, a pure function with no React or DOM dependency, fully unit-tested (22 tests).

### Core idea

Every mall carries its own IANA timezone (e.g. `Australia/Sydney`). Status is always calculated using **that mall's current local time**, never the viewer's. Looking at an Australian mall from India shows Australia's real current status, not an India-adjusted version.

```ts
const local = now.setZone(mall.timezone)
```

### Rules

- **Opening is inclusive, closing is exclusive:** `open <= now < close`
- **The mall's local calendar day** decides which day's schedule applies (not the viewer's day)
- **Missing hours for a day** → `unavailable` (never wrongly shown as closed)
- **`null` for a day** → `closed-today`
- **Malformed or `open === close`** → `unavailable` (`invalid-hours`)
- **Invalid timezone string** → `unavailable` (`invalid-timezone`)
- **Midnight-crossing hours supported** (e.g. `18:00`–`02:00`): the function first checks whether *yesterday's* schedule is still running past midnight before evaluating today's schedule

### Return shape

```ts
interface MallStatus {
  status: 'open' | 'closed' | 'unavailable'
  todayHours: DayHours | null
  reason:
    | 'within-hours' | 'before-opening' | 'after-closing'
    | 'closed-today' | 'missing-hours' | 'invalid-hours' | 'invalid-timezone'
}
```

The `reason` field exists specifically to make debugging fast — if an interviewer plants a timezone bug, you can see *why* the function decided what it did, not just the final status.

`getMallStatus` accepts an injectable `now: DateTime` parameter (defaulting to the real clock), which is what makes every boundary case deterministically testable.

---

## Map Provider

**Leaflet + React-Leaflet + OpenStreetMap.**

- Leaflet is lightweight (~40 KB), open source, and needs no API key or billing.
- React-Leaflet wraps it in React components so markers/popups follow React's declarative model and clean up automatically on unmount.
- OpenStreetMap tiles are free and keyless, suitable for this assignment. (Production traffic would move to a commercial tile provider, since OSM's public tiles are for fair, low-volume use.)

Custom markers are rendered via `L.divIcon` (plain HTML/CSS), not images — this lets status colors, pulse animations and selection highlighting be pure CSS, with icons cached per status combination so the DOM cost stays flat regardless of mall count.

---

## Setup & Run Instructions

```powershell
cd D:\VoiseAssignment\phoenix-malls-web
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

**Other scripts:**

```powershell
npm run build     # type-check (tsc -b) + production build
npm run lint       # ESLint
npm test           # Vitest, single run
npm run preview    # preview the production build locally
```

**Requirements:** Node 20.19+ or 22.12+ (Vite 8 requirement).

---

## Testing

Business logic is unit-tested with Vitest (34 tests total):

| File | Tests | Covers |
|---|---|---|
| `logic/getMallStatus.test.ts` | 22 | Before/at/during/after opening & closing, different timezones, mall-local vs viewer-local day, closed-today, missing hours, invalid hours/timezone, midnight-crossing hours |
| `logic/filterMallsByStatus.test.ts` | 5 | All/Open/Closed filtering, exclusion of unavailable-status malls, time-dependent results |
| `logic/findNearestMall.test.ts` | 7 | Haversine distance correctness, nearest-mall selection across countries, empty input, invalid coordinates |

Run with:

```powershell
npm test
```

Tests deliberately avoid the real system clock — every status/filter test injects a fixed `DateTime`, so results are fully deterministic.

---

## Assumptions

- Phoenix Malls, as a real brand, currently operate in India. Malls in other countries (Australia, US, UK, UAE, Japan, South Africa, Brazil) are **fictional demo data**, clearly labeled `(Demo)` in their names, added to demonstrate multi-country, multi-timezone behavior for the map, search, filter and nearest-mall features.
- Operating hours for real Indian malls are reasonable placeholder values and should be verified against each mall's official listing before any real submission.
- Mall photos are either the mall's own `image` field or a deterministic pick from a local photo pool (same mall always shows the same photo).
- "Nearest mall" uses straight-line (haversine) distance, not driving distance.

---

## Known Limitations

- **Overnight hours** are supported for the *current* day boundary but not beyond a single midnight crossing (e.g. hours spanning more than 24 hours are not modeled).
- **Holidays / special-day hours** are not yet implemented (planned — see Future Improvements).
- **Marker clustering** is not implemented; at world-zoom, markers for nearby countries/malls can sit close together.
- **Dark mode** is not implemented.
- "Nearest mall" browser geolocation can be inaccurate on desktop (often Wi-Fi/IP-based, potentially off by several kilometers).
- No focus trap when the details card opens (keyboard focus doesn't move into the card automatically).
- Selecting the currently selected mall from search doesn't change its route; if the mall no longer matches an active Open/Closed filter, its card can remain open while its marker disappears.

---

## Future Improvements

- Holiday / special-day operating hours per mall
- Marker clustering for dense regions
- Dark mode
- "Opens at / Closes at" countdown text on the details card
- Server-side search and nearest-mall queries (`GET /malls?search=`, `GET /malls/nearest`) once mall counts grow large, instead of filtering the full in-memory list
- Focus management (trap + return) on the details card for full accessibility
- Self-hosted fonts instead of the Google Fonts CDN request
- Android app (per the original assignment scope)

---

## Why These Technologies?

- **Vite** — CRA is deprecated; Vite's native-ESM dev server and Rollup build are the modern standard.
- **TypeScript** — catches data/shape mistakes at compile time (this project's JSON mock data is type-checked against `Mall[]`/`Country[]`, which caught several real bugs during development).
- **Leaflet + React-Leaflet + OSM** — free, keyless, lightweight, with a mature plugin ecosystem (e.g. clustering) for future growth.
- **Luxon** — reliable IANA timezone conversion, which is the backbone of the entire live-status feature.
- **Tailwind CSS v4** — utility-first styling with zero unused CSS shipped, and CSS-native theme tokens (no separate config file needed).
- **Vitest** — shares Vite's config and transform pipeline, so business-logic tests need almost no setup.
- **No Redux** — the app's shared state (selected country/mall, filter, search) is small enough that plain React state and a few custom hooks are simpler to reason about and explain than a global store would be.
