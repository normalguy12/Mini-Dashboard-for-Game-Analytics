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
> *Context: Building the Game Analytics dashboard*
```
/opsx:apply frontend-analytics-dashboard - follow the spec from OpenSpec, combine with the tasks deliver by Project Manager below to get the best result

*** Here I paste the task reports from Project Manager Agent ***
```
**Result:** Frontend Agent both follow instruction from Project Manager and proposal for the feature that I used OpenSpec to help prompting before => Every component is built perfectly. Except one small thing that I need to fix is the bar chart at first get some errors in displaying.

---

#### Prompt 5 — Backend Spec
> *Context: Building the backend for Game Analytics dashboard*
```
/opsx:apply backend-analytics-api - follow the spec from OpenSpec, combine with the tasks deliver by Project Manager below to get the best result

*** Here I paste the task reports from Project Manager Agent ***
```
**Result:** Same as Frontend, Backend Agent both follow instruction from Project Manager and proposal for the feature that I used OpenSpec to help prompting before => Every module is built exactly as I expected and I carefully double check them to make sure for the integration.

---

#### Prompt 6 — Integration spec
> *Context: Connecting frontend to backend*
```
/opsx:propose Integration:
- Frontend calls backend API
- Handle loading/error states properly
- Data flows correctly between frontend and backend
```
After that, transfer to Project Manager Agent, modify prompt 4 for Frontend Agent to integrate, combine `openspec/frontend-backend-integration` and Project Manager Agent's tasks deliver
```
/opsx:apply frontend-backend-integration
```
**Result:** This helped to identify integration gaps not covered by individual specs — most importantly, isolated error states per component so a summary failure doesn't crash the table.

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

### What worked well with AI assistance
- **Spec-first development** — generating specs before code forced clarity on requirements early
- **Boilerplate elimination** — DTOs, interfaces, module wiring took seconds instead of minutes
- **Cross-cutting concern detection** — the integration spec pass caught bugs that neither the backend nor frontend spec had covered
- **Consistent naming** — AI maintained the same field names (`gameId`, `eventType`, `playerId`) across all layers without drift

### What didn't work / how I fixed it

| Problem | What AI got wrong | Fix |
|---------|------------------|-----|
| `SummaryStats` component | Generated with its own internal `useSummary` call — parent's `refresh()` never propagated | Manually converted to prop-driven component |
| Filter hook deps | Used object `filters` as `useEffect` dep — caused infinite re-fetch loop | Changed to primitive deps: `filters.gameId`, `filters.eventType` |
| Route conflict | AI didn't warn about `/summary` vs `/:id` ordering in first draft | Added explicit task + design note about route declaration order |
| Recharts types | Generated `<BarChart data={...}>` without proper TypeScript generics | Fixed types manually with `BarChart<SummaryData>` |

### Time saved estimate
> Without AI assistance, estimated time: **12–16 hours**  
> With AI assistance, actual time: **~3 hours**  
> **~70% time reduction** on boilerplate, spec writing, and documentation

---

## 3. Development Workflow

### Step-by-step process

```
1. PLANNING (30 min)
   └── Read requirements → define API contract → write agent prompts
   └── /opsx:propose for backend, frontend, integration → reviewed by PM agent

2. BACKEND SETUP (10 min)
   └── nest new backend → install deps → configure main.ts (CORS, port, ValidationPipe)
   └── Scaffold AnalyticsModule → implement service (seed + logic) → controller
   └── Manual test via curl

3. FRONTEND SETUP (15 min)
   └── npx create-next-app frontend → install Tailwind + Recharts
   └── Create lib/types.ts, lib/api.ts
   └── Build hooks: useAnalytics, useSummary
   └── Build components: SummaryStats, AnalyticsTable, FilterBar, AddEntryForm, ChartSection
   └── Wire page.tsx

4. INTEGRATION (30 min)
   └── /opsx:apply frontend-backend-integration
   └── Fix CORS, fix SummaryStats prop drilling, fix filter hook deps
   └── End-to-end manual verification checklist (tasks 8.1–8.8)

5. TESTING & POLISH (45 min)
   └── Unit tests for service methods
   └── Error state testing (kill backend, check UI)
   └── Responsive check at 375px and 1280px

6. DOCUMENTATION (50 min)
   └── Write README.md via AI prompt
   └── Write PROCESS.md (this file)
```

### Time breakdown

| Phase | Time |
|-------|------|
| Planning & spec | 30 min |
| Backend implementation | 10 min |
| Frontend implementation | 15 min |
| Integration & bug fixes | 30 min |
| Testing | 45 min |
| Documentation | 50 min |
| **Total** | **~3h** |

---

## 4. Technical Decisions

### Key decisions

#### 1. Route declaration order in NestJS controller
**Decision:** `GET /analytics/summary` is declared before any route with a dynamic parameter.  
**Why:** NestJS resolves routes top-to-bottom. If `/:id` is declared first, `/summary` matches as `id = "summary"` and throws a 404 or wrong handler.

#### 2. Single `lib/api.ts` gateway
**Decision:** All API calls go through typed functions in `lib/api.ts`. No component calls `fetch()` directly.  
**Why:** Single place to change base URL, add auth headers, or swap to axios. Error normalisation (`ApiError`) happens once.

#### 3. In-memory store with `onModuleInit` seed
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
