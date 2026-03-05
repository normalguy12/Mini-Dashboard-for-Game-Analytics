## 1. Environment & Configuration

- [x] 1.1 Confirm `frontend/.env.local` contains `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`
- [x] 1.2 Confirm `frontend/.env.local.example` documents `NEXT_PUBLIC_API_BASE_URL`
- [x] 1.3 Confirm `backend/src/main.ts` has `app.enableCors({ origin: 'http://localhost:3000', methods: 'GET,POST,OPTIONS', credentials: true })`

## 2. Type Contract — `lib/types.ts`

- [x] 2.1 Verify `AnalyticsEntry` interface matches backend exactly: `id`, `gameId`, `eventType`, `playerId`, `score?`, `duration?`, `metadata?`, `timestamp`
- [x] 2.2 Verify `AnalyticsResponse` is `{ data: AnalyticsEntry[], total: number }`
- [x] 2.3 Verify `SummaryStats` matches backend: `totalEntries`, `totalGames`, `avgScore`, `avgDuration`, `eventTypeBreakdown: Record<string, number>`
- [x] 2.4 Verify `CreateAnalyticsDto` matches POST body: `gameId`, `eventType`, `playerId`, `score?`, `duration?`, `metadata?`
- [x] 2.5 Verify `FilterParams` matches GET query params: `gameId?`, `eventType?`, `startDate?`, `endDate?`

## 3. API Client — `lib/api.ts`

- [x] 3.1 Confirm base URL reads from `process.env.NEXT_PUBLIC_API_BASE_URL` with `http://localhost:3001` fallback
- [x] 3.2 Confirm non-2xx responses throw `Error` with extracted `message` field
- [x] 3.3 Confirm array `message` (class-validator 400s) is joined with `', '` before throwing
- [x] 3.4 Confirm `postAnalytics` sets `Content-Type: application/json` and stringifies the body
- [x] 3.5 Confirm `getAnalytics` only appends query params that are truthy (no `?gameId=` with empty string)

## 4. Hooks

- [x] 4.1 Confirm `useAnalytics` `useCallback` deps use primitive filter values (not the filter object reference) to avoid infinite re-renders
- [x] 4.2 Confirm `useAnalytics` sets `loading = true` before fetch and `false` in `finally`
- [x] 4.3 Confirm `useAnalytics` catches errors and sets `error` string state; does not rethrow
- [x] 4.4 Confirm `useSummary` mirrors the same `loading` / `error` / `refresh` pattern
- [x] 4.5 Confirm `refresh()` exported from both hooks re-triggers the fetch without needing a component remount

## 5. Data Flow — Page Wiring

- [x] 5.1 Confirm `page.tsx` initialises `filters` state as `FilterParams` and passes it to `useAnalytics(filters)`
- [x] 5.2 Confirm `FilterBar`'s `onFiltersChange` updates page-level `filters` state
- [x] 5.3 Confirm filter change does NOT call `refreshSummary()` (summary is filter-independent)
- [x] 5.4 Confirm `handleSuccess()` calls both `refreshTable()` and `refreshSummary()` — not just one
- [x] 5.5 Confirm `AddEntryForm` receives `onSuccess={handleSuccess}` and calls it after a confirmed 201 response

## 6. Loading States

- [x] 6.1 Confirm `SummaryStats` renders skeleton/placeholder when `useSummary` `loading` is true
- [x] 6.2 Confirm `AnalyticsTable` renders loading skeleton rows when `useAnalytics` `loading` is true
- [x] 6.3 Confirm `AddEntryForm` Submit button is disabled and shows "Submitting…" while POST is in flight
- [x] 6.4 Confirm no loading flash on re-fetch (existing data stays visible while `loading` is true on refresh)

## 7. Error States

- [x] 7.1 Confirm `SummaryStats` shows an error banner with message when `useSummary` returns an error
- [x] 7.2 Confirm `AnalyticsTable` shows an error row/banner with a retry button when `useAnalytics` returns an error
- [x] 7.3 Confirm retry button calls `refresh()` from the hook
- [x] 7.4 Confirm summary error does NOT prevent table from rendering (and vice versa)
- [x] 7.5 Confirm `AddEntryForm` shows the backend error message inline (not just a console.error) on POST failure

## 8. End-to-End Verification

- [ ] 8.1 Start backend: `cd backend && npm run start:dev` — confirm healthy on port 3001
- [ ] 8.2 Start frontend: `cd frontend && npm run dev` — confirm healthy on port 3000
- [ ] 8.3 Open browser DevTools → Network tab
- [ ] 8.4 Load dashboard → confirm two requests: `GET /analytics` and `GET /analytics/summary` (parallel)
- [ ] 8.5 Type in gameId filter → confirm `GET /analytics?gameId=<value>` fired, no `/summary` request
- [ ] 8.6 Clear filter → confirm `GET /analytics` with no params fired
- [ ] 8.7 Submit valid Add Entry form → confirm `POST /analytics` 201, then two re-fetches (analytics + summary)
- [ ] 8.8 Submit form with empty required fields → confirm no network request fired, inline validation errors shown
- [ ] 8.9 Kill backend (`Ctrl+C`) → reload page → confirm error banners in both summary and table areas, no blank page
- [ ] 8.10 Restart backend → click retry → confirm data loads successfully
- [ ] 8.11 Check browser console — confirm zero unhandled promise rejections during all steps above
- [ ] 8.12 Confirm `Access-Control-Allow-Origin: http://localhost:3000` present in response headers for both GET and POST

## 9. Build Validation

- [x] 9.1 `cd frontend && npm run lint` — zero errors
- [x] 9.2 `cd frontend && npm run build` — compiles without TypeScript errors
- [x] 9.3 `cd backend && npm run build` — compiles without TypeScript errors
