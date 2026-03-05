## 1. Project Setup

- [x] 1.1 Scaffold Next.js app: `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`
- [x] 1.2 Install additional dependencies: `npm install clsx @tailwindcss/forms`
- [x] 1.3 Add `@tailwindcss/forms` plugin to `tailwind.config.ts`
- [x] 1.4 Create `frontend/lib/types.ts` with `AnalyticsEntry`, `SummaryStats`, and `FilterParams` TypeScript interfaces
- [x] 1.5 Create `frontend/lib/api.ts` with typed functions: `getAnalytics(filters?)`, `postAnalytics(dto)`, `getSummary()` — all calling `http://localhost:3001`

## 2. Custom Hooks

- [x] 2.1 Create `frontend/hooks/useAnalytics.ts` — holds `data`, `total`, `loading`, `error` state; accepts `FilterParams`; exposes `refresh()` callback
- [x] 2.2 Create `frontend/hooks/useSummary.ts` — holds `stats`, `loading`, `error` state; exposes `refresh()` callback

## 3. UI Primitives

- [x] 3.1 Create `frontend/app/components/ui/StatCard.tsx` — accepts `label` and `value` props; renders a rounded card with label/value
- [x] 3.2 Create `frontend/app/components/ui/Spinner.tsx` — simple animated SVG or Tailwind-animated div
- [x] 3.3 Create `frontend/app/components/ui/ErrorMessage.tsx` — accepts `message` prop; renders styled error text/banner
- [x] 3.4 Create `frontend/app/components/ui/SkeletonRow.tsx` — animated placeholder row for table loading state

## 4. Summary Stats Component

- [x] 4.1 Create `frontend/app/components/SummaryStats.tsx` — uses `useSummary` hook; renders 4 `StatCard`s for `totalEntries`, `totalGames`, `avgScore`, `avgDuration`
- [x] 4.2 Add event-type breakdown section below main cards; hide when `eventTypeBreakdown` is empty
- [x] 4.3 Show `Spinner` / skeleton cards while loading; show `ErrorMessage` on error

## 5. Filter Bar Component

- [x] 5.1 Create `frontend/app/components/FilterBar.tsx` — controlled `gameId` text input and `eventType` text input; accepts `filters` and `onFiltersChange` props
- [x] 5.2 Add "Clear Filters" button that resets both inputs to empty and calls `onFiltersChange({})
- [x] 5.3 Trigger `onFiltersChange` on input change (or on Enter key for gameId)

## 6. Analytics Table Component

- [x] 6.1 Create `frontend/app/components/AnalyticsTable.tsx` — accepts `entries`, `total`, `loading`, `error` props; renders table with columns: Game ID, Event Type, Player ID, Score, Duration (s), Timestamp
- [x] 6.2 Format `timestamp` with `new Date(ts).toLocaleString()`; display "—" for missing `score` or `duration`
- [x] 6.3 Show skeleton rows (`SkeletonRow`) while `loading` is true
- [x] 6.4 Show single-column-span error row when `error` is set
- [x] 6.5 Show "No entries found" empty state row when `entries` is empty and not loading
- [x] 6.6 Show "Showing X entries" count label above or below the table

## 7. Add Entry Form Component

- [x] 7.1 Create `frontend/app/components/AddEntryForm.tsx` — controlled form with fields: `gameId` (text, required), `eventType` (text, required), `playerId` (text, required), `score` (number, optional), `duration` (number, optional)
- [x] 7.2 Add client-side validation: show inline error on each required field if empty on submit attempt
- [x] 7.3 Add client-side validation: show error if `score` or `duration` is non-numeric
- [x] 7.4 On valid submit: disable Submit button, show "Submitting…" label, call `postAnalytics(dto)`
- [x] 7.5 On success: close form, show success toast/banner, call `onSuccess()` callback (triggers table + stats refresh)
- [x] 7.6 On API error: keep form open, show `ErrorMessage` with server error detail, re-enable Submit button

## 8. Dashboard Page

- [x] 8.1 Update `frontend/app/layout.tsx` — add top navigation header with app title "Game Analytics Dashboard"
- [x] 8.2 Update `frontend/app/page.tsx` — mark as `'use client'`; compose `SummaryStats`, `FilterBar`, "Add Entry" button, and `AnalyticsTable`
- [x] 8.3 Wire filter state: `useState<FilterParams>({})` in the page; pass to `FilterBar` and `useAnalytics`
- [x] 8.4 Wire refresh: pass `() => { analyticsRefresh(); summaryRefresh(); }` as `onSuccess` to `AddEntryForm`
- [x] 8.5 Implement "Add Entry" button toggle to show/hide `AddEntryForm` (modal overlay or inline panel)

## 9. Responsive Polish

- [x] 9.1 Verify stat cards wrap to 2-column grid on mobile (≤640px) and 4-column on desktop
- [x] 9.2 Make table horizontally scrollable on mobile (`overflow-x-auto` wrapper)
- [x] 9.3 Stack `FilterBar` inputs vertically on mobile, side-by-side on desktop
- [x] 9.4 Test layout at 375px, 768px, and 1280px viewport widths

## 10. Verification

- [x] 10.1 Start backend (`cd backend && npm run start:dev`) and frontend (`cd frontend && npm run dev`) simultaneously
- [x] 10.2 Confirm summary stats cards load with correct values from seeded backend data
- [x] 10.3 Confirm table shows all seeded entries on first load
- [x] 10.4 Filter by `gameId` — verify table updates and URL/network request includes `?gameId=X`
- [x] 10.5 Filter by `eventType` — verify table updates correctly
- [x] 10.6 Clear filters — verify full list is restored
- [x] 10.7 Open Add Entry form, submit valid entry — verify table and stats refresh with new entry
- [x] 10.8 Submit form with empty required fields — verify no API call, inline errors shown
- [x] 10.9 Simulate backend offline — verify error states appear in stats and table (not blank screen)
- [x] 10.10 Run `npm run lint` and `npm run build` — confirm no errors
