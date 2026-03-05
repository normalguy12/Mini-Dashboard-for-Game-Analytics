## Context

The frontend is a greenfield Next.js 14 (App Router) application. It has no legacy code to migrate. The only external data source is the NestJS backend API at `http://localhost:3001`. Styling is done with Tailwind CSS (already configured by `create-next-app`). The app runs on port 3000.

## Goals / Non-Goals

**Goals:**
- Single-page dashboard showing stats, table, filters, and add-entry form
- All data fetched from the live backend API (no mock/static data)
- Proper loading skeletons and error messages for every async operation
- Form submits to `POST /analytics` and refreshes both table and summary on success
- Responsive layout that works at 375px (mobile) and 1280px (desktop)

**Non-Goals:**
- Authentication or user accounts
- Server-Side Rendering (SSR) for data — client-side fetch is sufficient for this MVP
- Complex state management library (Redux, Zustand) — `useState` + `useEffect` is enough
- Pagination — backend returns all entries; a scrollable table is sufficient
- Dark mode toggle

## Decisions

### 1. Next.js App Router with Client Components for interactive UI
The dashboard is highly interactive (filters, form, live refresh). Data-fetching components should be `'use client'` with `useEffect`. The page shell (`layout.tsx`) remains a Server Component.

**Alternative considered**: React Server Components with server actions — rejected because filter state must live in the browser; RSC would require full page navigation per filter change.

### 2. Centralised API layer in `lib/api.ts`
All `fetch` calls are wrapped in typed functions (`getAnalytics`, `postAnalytics`, `getSummary`). Components never call `fetch` directly. This makes the base URL a single config point and API errors consistently handled.

### 3. Custom hooks `useAnalytics` and `useSummary`
Each hook owns its own `loading`, `error`, and `data` state. The main page passes a `refresh()` callback from `useAnalytics` down to `AddEntryForm` so a successful POST triggers a re-fetch of both table and summary.

### 4. Filter state lives in the page component
`FilterBar` receives `filters` and `onFiltersChange` as props. When filters change, the page re-calls `useAnalytics` with the new params. No third-party state manager needed.

### 5. Modal for Add Entry form (using a simple `useState` toggle)
A `<dialog>`-based modal or a conditional-render panel. No external modal library. Keeps bundle size minimal.

### 6. Tailwind CSS utility classes only
No custom CSS files. `@tailwindcss/forms` plugin for consistent input/select/button resets.

### 7. TypeScript strict mode
All types defined in `lib/types.ts`. No `any`. Props typed with interfaces.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Backend offline when page loads | Show clear error banner; table renders empty with message |
| POST succeeds but re-fetch is slow | Optimistically add new entry to table immediately, then confirm with re-fetch |
| CORS error if backend not running | Error boundary catches fetch errors; user sees actionable message |
| Filter with no results feels broken | Show "No entries found" empty state in table |

## Migration Plan

1. `npm run dev` — starts Next.js on port 3000
2. Backend must be running on port 3001 first
3. No database or persistent state — no migration needed

## Open Questions

- None for this MVP scope.
