# 🎮 Game Analytics Dashboard

A mini full-stack dashboard for game analytics with real-time data, CRUD operations, and summary statistics.

---

## 📋 Prerequisites

I used:
Node: v22.19.0
NPM: 8.17.0

> Check your versions:
> ```bash
> node -v
> npm -v
> ```

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/normalguy12/Mini-Dashboard-for-Game-Analytics.git
cd Mini-Dashboard-for-Game-Analytics
```

---

### 2. Run the Backend (NestJS — Port 3001)

```bash
cd backend
npm install
npm run start:dev
```

> Backend will be available at: **http://localhost:3001**  
> Hot-reload is enabled via `start:dev`

---

### 3. Run the Frontend (Next.js — Port 3000)

```bash
cd frontend
npm install
npm run dev
```

> Frontend will be available at: **http://localhost:3000**

#### Environment Variables

Create a `.env.local` file inside the `frontend/` folder:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```
---

## 📡 API Endpoints

Base URL: `http://localhost:3001`

---

### `GET /analytics`

Fetch all analytics entries. Supports optional query filters.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `gameId` | string | ❌ | Filter by game ID |
| `eventType` | string | ❌ | Filter by event type (e.g. `level_complete`) |
| `startDate` | ISO string | ❌ | Filter entries on or after this date |
| `endDate` | ISO string | ❌ | Filter entries on or before this date |

**Example Request**
```bash
curl "http://localhost:3001/analytics?gameId=game-1&eventType=level_complete"
```

**Example Response** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid-here",
      "gameId": "game-1",
      "eventType": "level_complete",
      "playerId": "player-42",
      "score": 1500,
      "duration": 120,
      "metadata": {},
      "timestamp": "2026-03-05T08:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

### `POST /analytics`

Create a new analytics entry.

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gameId` | string | ✅ | ID of the game |
| `eventType` | string | ✅ | Type of event (e.g. `session_start`) |
| `playerId` | string | ✅ | ID of the player |
| `score` | number | ❌ | Score achieved |
| `duration` | number | ❌ | Duration in seconds |
| `metadata` | object | ❌ | Any extra key-value data |

**Example Request**
```bash
curl -X POST http://localhost:3001/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "game-1",
    "eventType": "level_complete",
    "playerId": "player-99",
    "score": 2000,
    "duration": 95
  }'
```

**Example Response** `201 Created`
```json
{
  "id": "generated-uuid",
  "gameId": "game-1",
  "eventType": "level_complete",
  "playerId": "player-99",
  "score": 2000,
  "duration": 95,
  "metadata": {},
  "timestamp": "2026-03-05T10:30:00.000Z"
}
```

**Validation Errors** `400 Bad Request`
```json
{
  "statusCode": 400,
  "message": ["gameId should not be empty", "eventType should not be empty"],
  "error": "Bad Request"
}
```

---

### `GET /analytics/summary`

Return aggregated statistics across all entries.

**Example Request**
```bash
curl http://localhost:3001/analytics/summary
```

**Example Response** `200 OK`
```json
{
  "totalEntries": 10,
  "totalGames": 3,
  "avgScore": 1420.5,
  "avgDuration": 87.3,
  "eventTypeBreakdown": {
    "level_complete": 4,
    "session_start": 3,
    "purchase": 2,
    "session_end": 1
  }
}
```

---

## 🗂 Project Structure

```
your-repo/
├── backend/                  # NestJS API
│   └── src/
│       ├── analytics/
│       │   ├── analytics.controller.ts
│       │   ├── analytics.service.ts
│       │   ├── analytics.module.ts
│       │   ├── dto/
│       │   │   ├── create-analytics.dto.ts
│       │   │   └── filter-analytics.dto.ts
│       │   └── interfaces/
│       │       └── analytics-entry.interface.ts
│       └── main.ts
├── frontend/                 # Next.js App
│   └── app/
│       ├── page.tsx
│       ├── components/
│       │   ├── SummaryStats.tsx
│       │   ├── AnalyticsTable.tsx
│       │   ├── FilterBar.tsx
│       │   ├── AddEntryForm.tsx
│       │   └── ChartSection.tsx
│       ├── hooks/
│       │   ├── useAnalytics.ts
│       │   └── useSummary.ts
│       └── lib/
│           ├── api.ts
│           └── types.ts
├── agents/                   # AI Agent prompt files
├── openspec/                 # Feature specs & tasks
├── README.md
└── PROCESS.md
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS, TypeScript, class-validator |
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Charts | Recharts |
| Storage | In-memory (no database required) |

---

## ⚡ Quick Start (both servers)

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run start:dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

Then open **http://localhost:3000** in your browser.
