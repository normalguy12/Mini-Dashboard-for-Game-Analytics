## Why

The backend API and frontend dashboard were built independently. The integration layer — the typed API client (`lib/api.ts`), custom hooks (`useAnalytics`, `useSummary`), environment configuration, and data-flow wiring in the page — is what makes them work as a single product. Without explicit integration work, data may not flow correctly, errors may be silently swallowed, and loading states may be inconsistent or missing.

## What Changes

- Finalize and validate `lib/api.ts` as the single typed gateway to the backend
- Ensure `lib/types.ts` exactly mirrors the backend `AnalyticsEntry` and summary shapes
- Wire `useAnalytics` and `useSummary` hooks so all async states (loading, error, data) propagate correctly to every UI component
- Confirm that `POST /analytics` success triggers a coordinated refresh of both the table and summary stats
- Ensure filter changes re-fetch the table only (not summary), without duplicate requests
- Validate CORS works end-to-end in the browser
- Confirm proper error states appear when the backend is offline or returns non-2xx responses

## Capabilities

### New Capabilities

- `api-client`: Typed `lib/api.ts` module wrapping all backend calls with error normalisation and environment-based base URL
- `data-flow`: End-to-end data flow — page load populates table + stats, filter changes update table, POST success refreshes both
- `error-resilience`: Isolated error states per component (summary error does not break table), retry support, graceful offline handling

### Modified Capabilities

<!-- no existing specs to modify — integration builds on the two existing changes -->

## Impact

- **Frontend**: `lib/api.ts`, `lib/types.ts`, `hooks/useAnalytics.ts`, `hooks/useSummary.ts`, `app/page.tsx` — all touched
- **Backend**: CORS config in `main.ts` must be confirmed; no other backend changes required
- **Environment**: `NEXT_PUBLIC_API_BASE_URL` must be set in `.env.local`; `.env.local.example` documents it
- **Dependencies**: No new packages — uses native `fetch` only
