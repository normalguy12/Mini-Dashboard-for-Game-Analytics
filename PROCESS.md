## 1. Tech Stack Choice

### What I used and why

| Layer | Choice | Reason |
|-------|--------|--------|
| **Backend Framework** | NestJS (TypeScript) | Structured and clean module/service/controller components. Built-in `ValidationPipe` + `class-validator` makes DTO validation trivial |
| **Frontend Framework** | Next.js 16 (App Router) | React with file-based routing, server/client component model, and first-class TypeScript support. I am most familiar with Next.js and React, so I choose this framework to build our Frontend |
| **Styling** | Tailwind CSS | Utility-first — no context switching between CSS files. Responsive layout via breakpoint prefixes (`sm:`, `lg:`) is simple and easy for this project |
| **Charts** | Recharts | Lightweight, React-native chart library. Easy to setup and use |
| **Validation** | class-validator + class-transformer | Pairs perfectly with NestJS `ValidationPipe`. Declarative decorators on DTOs — no manual if/else validation |
| **HTTP Client** | Native `fetch` (wrapped in `lib/api.ts`) | No extra dependency. `AbortController` for timeout. Keeps bundle lean |
| **Storage** | In-memory array + `onModuleInit` seed | Meets the requirement, zero config, instant restart. No Docker/DB setup friction |
| **Type Sharing** | Manual `lib/types.ts` in frontend | Single source of truth for `AnalyticsEntry`, `SummaryResponse`, `FilterParams` — keeps frontend and backend contract explicit |

### Alternatives considered

| What | Alternative |
|------|-------------|
| Backend | Express.js |
| Frontend | Vite, Angular,... |
| Styling | CSS Modules / Styled Components |
| Charts | Chart.js |
| HTTP Client | Axios |
| Storage | JSON file on local disk |

---

## 2. AI Tool Usage

### Tools used
- **Copilot Chat / Claude Sonnet 4.6/ OpenSpec-@FissionAI** — architecture planning, prompt-driven scaffolding via `/opsx:propose` and `/opsx:apply` commands

---

### 5–10 Real Prompts Used (with context)

#### Prompt 1 — Initial Setting
> *Context: Starting the project from scratch*
```
/opsx:propose 
Backend API (NestJS):
- REST API with at least 3 endpoints: GET /analytics, POST /analytics, GET /analytics/summary
- Use in-memory storage
- Basic validation and error handling
Frontend Dashboard (Next.js + React)
- Display analytics data in a table or card view
- Show summary statistics (total, average, etc.)
- Form to add new entry (submit to API)
- Basic filtering or search functionality
- Responsive layout (doesn't need to be fancy)

Following the folder structure below:
your-repo/
├── backend/ # NestJS/Express API
├── frontend/ # React app
├── README.md # Setup instructions
└── PROCESS.md # Your process documentation
```
**Result:** Generated `proposal.md`, `design.md`, `specs/`, and `tasks.md` under `openspec/changes/backend-analytics-api/` and `openspec/changes/frontend-analytics-dashboard/` — full spec before writing a single line of code.

---

#### Prompt 2 — Roles Setting
> *Context: I granted roles for 3 individual agent, each stands for a role in the team, including: Project Manager Agent, Backend Engineer Agent and Frontend Engineer Agent*
```
Establish suitable prompts for each individual agent of the team, including 3 role: Project Manager, Frontend Engineer and Backend Engineer. All of these agents are experts in their field (Senior Level with 7+ years of experience) and put 100% effort in this project, because they are in need of 1 million dollar paycheck to save their families from the kidnappers.
```
**Result:** Each agent knows their role well and optimize the whole process to avoid as many errors as possible`.

---

#### Prompt 3 — Project Analysis
> *Context: Provide Context and Requirements for the Project Manager Agent to help me analyze the project*
```
You are the Project Manager for this project. Your full instructions are in agents/project-manager.md. Read it and confirm your role, then read `openspec/changes/backend-analytics-api/` and `openspec/changes/frontend-analytics-dashboard/` to analyze the upcoming tasks for Backend and Frontend. Finally, deliver the suitable tasks for the team.
```
**Result:** Accurate Analysis and Task Breakdown, however, there is one point that it is getting overcomplicated when getting to set up the database. Due to the requirement, we don't need to setup a complex one, just need use-in memory storage or simple JSON file, so I have to refactor the final result analysis report and review again, then start to deliver task for backend and frontend agents.`

---

#### Prompt 4 — Frontend spec
> *Context: Planning the Next.js dashboard*
```
/opsx:propose Frontend Dashboard (Next.js):
- Display analytics data in a table or card view
- Show summary statistics (total, average, etc.)
- Form to add new entry (submit to API)
- Basic filtering or search functionality
- Responsive layout
```
**Result:** Generated 5 component specs (`SummaryStats`, `AnalyticsTable`, `FilterBar`, `AddEntryForm`, `ChartSection`) with scenario-level requirements.

---

#### Prompt 5 — Custom hooks
> *Context: Wiring frontend data fetching*
```
Create useAnalytics(filters: FilterParams) hook that calls fetchAnalytics(filters),
returns { data, total, loading, error, refresh }, re-fetches when filters change,
and is React StrictMode safe (no double-fetch side effects).
```
**Result:** Hook using `useEffect` with primitive filter values in dependency array — prevented stale closure bugs.

---

#### Prompt 6 — Integration spec
> *Context: Connecting frontend to backend*
```
/opsx:propose Integration:
- Frontend calls backend API
- Handle loading/error states properly
- Data flows correctly between frontend and backend
```
**Result:** Identified 5 integration gaps not covered by individual specs — most importantly, isolated error states per component so a summary failure doesn't crash the table.

---

#### Prompt 7 — CORS fix
> *Context: Browser showing CORS error on POST /analytics*
```
Fix CORS in NestJS main.ts — POST /analytics preflight OPTIONS request is failing.
Current config: app.enableCors({ origin: 'http://localhost:3000' }).
Add methods, credentials, and allowedHeaders.
```
**Result:** Added `methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'`, `credentials: true`, `allowedHeaders: 'Content-Type,Authorization'`.

---

#### Prompt 8 — Error boundary component
> *Context: Needed isolated error handling per section*
```
Create a React ErrorBoundary class component that catches render errors,
shows a fallback UI with the error message and a "Try again" button,
and resets on button click.
```
**Result:** `ErrorBoundary.tsx` with `componentDidCatch`, `getDerivedStateFromError`, and a reset mechanism.

---

#### Prompt 9 — README generation
> *Context: Writing project documentation*
```
Write README.md with: prerequisites (Node version), how to run backend, how to run frontend,
API endpoints documentation with request/response examples for all 3 endpoints,
project structure tree, and tech stack table.
```
**Result:** Complete README in one pass — zero manual editing needed.

---

#### Prompt 10 — PM task review
> *Context: Before handing tasks to engineers*
```
Review both backend and frontend task lists against the original requirements.
Check for gaps, conflicts, ordering issues, and risks.
Give APPROVED / APPROVED WITH NOTES / NEEDS REVISION verdict.
Produce handover messages for each engineer session.
```
**Result:** PM caught a missing task — `GET /analytics/summary` route ordering was not explicitly flagged as a risk. Added task 5.2 note before implementation.

---

### What worked well with AI assistance
- **Spec-first development** — generating specs before code forced clarity on requirements early
- **Boilerplate elimination** — DTOs, interfaces, module wiring took seconds instead of minutes
- **Cross-cutting concern detection** — the integration spec pass caught bugs that neither the backend nor frontend spec had covered
- **Consistent naming** — AI maintained the same field names (`gameId`, `eventType`, `playerId`) across all layers without drift

### What didn't work / how we fixed it

| Problem | What AI got wrong | Fix |
|---------|------------------|-----|
| `SummaryStats` component | Generated with its own internal `useSummary` call — parent's `refresh()` never propagated | Manually converted to prop-driven component |
| Filter hook deps | Used object `filters` as `useEffect` dep — caused infinite re-fetch loop | Changed to primitive deps: `filters.gameId`, `filters.eventType` |
| Route conflict | AI didn't warn about `/summary` vs `/:id` ordering in first draft | Added explicit task + design note about route declaration order |
| Recharts types | Generated `<BarChart data={...}>` without proper TypeScript generics | Fixed types manually with `BarChart<SummaryData>` |

### Time saved estimate
> Without AI assistance, estimated time: **12–16 hours**  
> With AI assistance, actual time: **~4 hours**  
> **~70% time reduction** on boilerplate, spec writing, and documentation

---

## 3. Development Workflow

### Step-by-step process

```
1. PLANNING (30 min)
   └── Read requirements → define API contract → write agent prompts
   └── /opsx:propose for backend, frontend, integration → reviewed by PM agent

2. BACKEND SETUP (45 min)
   └── nest new backend → install deps → configure main.ts (CORS, port, ValidationPipe)
   └── Scaffold AnalyticsModule → implement service (seed + logic) → controller
   └── Manual test via curl

3. FRONTEND SETUP (60 min)
   └── npx create-next-app frontend → install Tailwind + Recharts
   └── Create lib/types.ts, lib/api.ts
   └── Build hooks: useAnalytics, useSummary
   └── Build components: SummaryStats, AnalyticsTable, FilterBar, AddEntryForm, ChartSection
   └── Wire page.tsx

4. INTEGRATION (45 min)
   └── /opsx:apply frontend-backend-integration
   └── Fix CORS, fix SummaryStats prop drilling, fix filter hook deps
   └── End-to-end manual verification checklist (tasks 8.1–8.8)

5. TESTING & POLISH (30 min)
   └── Unit tests for service methods
   └── Error state testing (kill backend, check UI)
   └── Responsive check at 375px and 1280px

6. DOCUMENTATION (20 min)
   └── Write README.md via AI prompt
   └── Write PROCESS.md (this file)
```

### Time breakdown

| Phase | Time |
|-------|------|
| Planning & spec | 30 min |
| Backend implementation | 45 min |
| Frontend implementation | 60 min |
| Integration & bug fixes | 45 min |
| Testing | 30 min |
| Documentation | 20 min |
| **Total** | **~3h 50min** |

---

## 4. Technical Decisions

### Key decisions

#### 1. Prop-driven components over self-fetching components
**Decision:** `SummaryStats`, `AnalyticsTable` receive data as props — they do not fetch internally.  
**Why:** Parent page controls when refreshes happen. After a POST, both table and summary refresh in one `handleSuccess()` call. Self-fetching components would require prop drilling a trigger signal anyway.

#### 2. Primitive values in `useEffect` dependency arrays
**Decision:** `useEffect(() => { ... }, [filters.gameId, filters.eventType])` instead of `[filters]`.  
**Why:** Object identity in React — a new `filters` object reference on every render would cause infinite re-fetch. Primitives are value-compared.

#### 3. Route declaration order in NestJS controller
**Decision:** `GET /analytics/summary` is declared before any route with a dynamic parameter.  
**Why:** NestJS resolves routes top-to-bottom. If `/:id` is declared first, `/summary` matches as `id = "summary"` and throws a 404 or wrong handler.

#### 4. Single `lib/api.ts` gateway
**Decision:** All API calls go through typed functions in `lib/api.ts`. No component calls `fetch()` directly.  
**Why:** Single place to change base URL, add auth headers, or swap to axios. Error normalisation (`ApiError`) happens once.

#### 5. In-memory store with `onModuleInit` seed
**Decision:** No database, no file persistence.  
**Why:** Meets requirements, zero infrastructure setup. Data resets on server restart — acceptable for a demo/test scenario.

---

### Trade-offs made to ship within time limit

| Trade-off | What we skipped | Impact |
|-----------|----------------|--------|
| No pagination | Table shows all entries | Fine for seed data (~10–20 rows), would need paging at scale |
| No auth | API is open | Acceptable for internal demo |
| No optimistic UI | Table waits for POST response before updating | Slight UX lag on slow connections |
| No e2e tests | Only unit + manual verification | Covered by QA checklist instead |
| No persistent storage | Data lost on restart | Fine per requirements spec |

---

### What we'd improve with more time

1. **Pagination** — `GET /analytics?page=1&limit=20` with total pages in response
2. **Date range picker** — Replace text input with a proper calendar UI for `startDate`/`endDate`
3. **Optimistic updates** — Add entry appears instantly in table, rolls back on API error
4. **E2E tests** — Playwright tests for the full user journey (load → filter → add → verify)
5. **Persistent storage** — SQLite via Prisma — same zero-config spirit but survives restarts
6. **WebSocket** — Real-time push from backend when new entries are added (live dashboard)
7. **Auth** — JWT-based auth even at demo level
8. **Export** — CSV download of filtered analytics data

---

## 5. Results & Limitations

### ✅ What works well

- **All 3 API endpoints** functional with correct status codes (`200`, `201`, `400`)
- **Filtering** by `gameId` and `eventType` works independently and combined
- **Summary stats** — `totalEntries`, `totalGames`, `avgScore`, `avgDuration`, `eventTypeBreakdown` all accurate
- **Add entry form** — client-side validation, POST to API, dual refresh (table + summary) on success
- **Loading states** — skeleton cards for summary, loading indicator for table
- **Error states** — isolated per component, retry buttons restore data
- **Responsive layout** — works on mobile (375px) and desktop (1280px)
- **CORS** — no browser console errors during normal operation
- **Seed data** — 12 realistic entries with varied games/events make the dashboard useful on first load
- **Charts** — event type bar chart and score timeline render from live data

---

### ⚠️ What doesn't work or is incomplete

| Item | Status | Notes |
|------|--------|-------|
| Date range filtering | ⚠️ Partial | Backend supports `startDate`/`endDate` but FilterBar UI has no date picker — text input only |
| Pagination | ❌ Not implemented | All entries returned at once |
| Unit test coverage | ⚠️ Partial | Service methods tested; controller and hooks not covered |
| Form `metadata` field | ❌ Not exposed | `metadata` is accepted by API but no UI field in `AddEntryForm` |

---

### 🐛 Known bugs / edge cases

| Bug | Severity | Description |
|-----|----------|-------------|
| `avgScore` returns `null` if no entries have a score | Low | Returns `null` instead of `0` or `"N/A"` — UI should handle gracefully |
| Filter reset doesn't clear URL params | Low | Cosmetic — no URL state management implemented |
| Recharts tooltip overlaps on mobile | Low | Small screen tooltip clips outside viewport on narrow devices |
| `onModuleInit` seed is not idempotent | Low | Restarting the server re-seeds, doubling entries if backed by persistent store in future |
