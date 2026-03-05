## Why

The Game Analytics Mini Dashboard needs a frontend that gives users a clear, interactive view of player/game event data. Without a UI, the backend API has no practical value for stakeholders who need to monitor game analytics, add entries, and spot trends at a glance.

## What Changes

- Introduce a Next.js 14 (App Router) application at `frontend/` with Tailwind CSS
- Build a single-page dashboard that consumes the NestJS backend at `http://localhost:3001`
- Display all analytics entries in a sortable table
- Show aggregated summary stats (total entries, games, avg score, avg duration, event breakdown)
- Provide a form to add new analytics entries via `POST /analytics`
- Provide filter controls for `gameId` and `eventType` that call the API with query params
- Handle loading and error states throughout

## Capabilities

### New Capabilities

- `dashboard-layout`: Responsive page shell with a navigation header and main content area; adapts between mobile (375px) and desktop (1280px)
- `summary-stats`: Stat cards row showing `totalEntries`, `totalGames`, `avgScore`, `avgDuration`, and event-type breakdown fetched from `GET /analytics/summary`
- `analytics-table`: Paginated/scrollable table of analytics entries from `GET /analytics`, with columns for Game ID, Event Type, Player ID, Score, Duration, and Timestamp
- `filter-bar`: Controlled inputs for `gameId` and `eventType` that trigger a filtered `GET /analytics` request; includes a clear/reset action
- `add-entry-form`: Modal or inline form to submit a new entry via `POST /analytics`; shows validation errors, success feedback, and refreshes table + stats on success

### Modified Capabilities

<!-- none — greenfield frontend -->

## Impact

- **Frontend**: New Next.js app under `frontend/`; depends on backend API being reachable at `http://localhost:3001`
- **Backend**: No changes required; frontend is a pure consumer
- **Dependencies**: `tailwindcss`, `@tailwindcss/forms` (form reset styles); optionally `swr` or `react-query` for data fetching; `clsx` for conditional classnames
- **CORS**: Backend must have CORS enabled for `http://localhost:3000` (already handled in the backend change)
