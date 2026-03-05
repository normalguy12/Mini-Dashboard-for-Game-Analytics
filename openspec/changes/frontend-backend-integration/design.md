## Context

Both the NestJS backend (port 3001) and the Next.js frontend (port 3000) are already scaffolded and partially implemented. The integration layer already exists in code (`lib/api.ts`, `hooks/`, `.env.local`) but has not been formally verified end-to-end. This design document locks in the integration architecture as a contract.

## Goals / Non-Goals

**Goals:**
- Single, typed API client module — components never call `fetch` directly
- Every async operation has explicit `loading`, `error`, and `data` states
- Successful `POST /analytics` refreshes both the table (`useAnalytics`) and summary (`useSummary`)
- Filter changes hit the API (server-side) — not client-side array filtering
- CORS works for both GET and POST (including OPTIONS preflight)
- Backend offline → error banners shown, no console crashes, retry available

**Non-Goals:**
- Caching or stale-while-revalidate (SWR/React Query) — `useState + useEffect` is sufficient for this MVP
- Request deduplication
- Optimistic UI updates
- WebSocket real-time push

## Decisions

### 1. `lib/api.ts` as the only gateway — no direct `fetch` in components
All three API calls (`getAnalytics`, `postAnalytics`, `getSummary`) live here. Base URL is read from `process.env.NEXT_PUBLIC_API_BASE_URL`. Non-2xx responses throw a normalized `Error` with the backend's `message` field extracted.

### 2. Custom hooks own async state — components are dumb receivers
`useAnalytics(filters)` and `useSummary()` each own `loading`, `error`, `data`. Components receive these as props or consume the hook directly. No async logic in JSX files.

### 3. Filter dependency tracked via primitive values in `useCallback` deps
`useAnalytics`'s `fetchData` callback depends on `filters.gameId`, `filters.eventType`, `filters.startDate`, `filters.endDate` individually — not the whole object — to avoid infinite re-render loops from object reference instability.

### 4. Coordinated refresh via `handleSuccess` in page
`handleSuccess()` in `page.tsx` calls both `refreshTable()` and `refreshSummary()` sequentially. The two fetches are fire-and-forget in parallel (not awaited serially). This keeps the wiring explicit without a global event bus.

### 5. Error isolation — each component has its own error state
A failing summary request does not affect the table render. `ErrorBoundary` wraps the whole page as a last resort for unexpected JS errors, but fetch errors are handled within each hook independently.

### 6. Environment variable for base URL
`NEXT_PUBLIC_API_BASE_URL=http://localhost:3001` in `.env.local`. Falls back to the same value in code so the app works even if `.env.local` is missing.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Double fetch on React StrictMode mount | `useEffect` cleanup / `useCallback` memoisation prevents duplicate in-flight requests |
| CORS preflight fails for POST | Backend must have `app.enableCors({ origin: 'http://localhost:3000' })` confirmed |
| Filter object identity causes infinite re-render | Deps array uses primitive destructuring, not the filter object itself |
| Backend returns 400 with array `message` field (class-validator) | `lib/api.ts` joins array messages with `, ` before throwing |

## Open Questions

- None for this MVP scope.
