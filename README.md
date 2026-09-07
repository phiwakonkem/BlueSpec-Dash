Bluespec Command

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)

A command-centre dashboard for Bluespec Holdings call-centre agents to log vehicle
incident reports, get an instant AI-driven severity and routing prediction, and
track incident trends across the fleet in real time.

---

## The problem

Bluespec manages vehicle recovery, logistics, and incident response for
corporate fleets and insurance providers across South Africa. Agents taking an
incident report over the phone need to log it fast, understand how serious it
is, and know immediately whether it needs a tow truck, a desktop assessment,
or a standard panel-beater repair — without manually triaging every case or
waiting on a human specialist to review it first.

## Features

| Feature | Description |
|---|---|
| **Incident entry form** | Registration, policy ID, free-text description, towing flag, and estimated severity, validated before submission |
| **AI classification** | Reads the description and returns a severity score (1–5), a recommended routing decision, and the exact phrases that drove it |
| **Searchable, filterable log** | Live search by registration/policy and filter by severity, backed by TanStack Query caching |
| **Operations overview** | Bar and donut charts of incident volume by severity and towing distribution, updating live as incidents are logged |
| **Archive with full history** | Incidents are soft-deleted, never destroyed — a dedicated History view preserves a complete audit trail |

## Tech stack

- **React 19 + TypeScript** (Vite)
- **TailwindCSS v4** — CSS-first theme via `@theme`, no `tailwind.config.js`
- **TanStack Query** — shared server-state cache across every view
- **Recharts** — severity and towing distribution charts
- **Express + TypeScript** — REST API
- **Prisma + PostgreSQL** (hosted on Neon)
- **Local rule-based NLP** — deterministic, explainable AI classification, no external API dependency

## Getting started

**Backend**

cd Backend
npm install

Create `Backend/.env`:

DATABASE_URL="neon-connection-string"

npx prisma generate
npx prisma migrate dev
npm run dev

Runs at `http://localhost:4000`.

**Frontend** (separate terminal)

cd Frontend
npm install
npm run dev

Runs at `http://localhost:5173`.

## Project structure

Backend/src/
├── aiClassifier.ts # Local severity/routing classification engine
└── index.ts # Express routes, wires Prisma + aiClassifier together

Frontend/src/
├── api.ts # All backend calls + shared TypeScript types
├── App.tsx # View switcher: Log & Review / Overview / History
└── components/
├── IncidentForm.tsx # Entry form + "Run AI analysis" panel
├── IncidentsTable.tsx # Searchable/filterable active log
├── IncidentsCharts.tsx # Severity + towing charts
├── IncidentsHistory.tsx # Archived incidents, read-only
├── MetricsStrip.tsx # Live readout counters
├── Sidebar.tsx # View navigation
└── SeverityBadge.tsx # Shared severity pill


## Design decisions

- **Classification is a local rules engine, not a hosted LLM call** —
  chosen for zero network dependency during a live demo, zero cost, and
  full explainability: every prediction returns the exact phrases
  (`matchedSignals`) that produced it, which matters when a human reviewer
  needs to understand *why* an incident was routed a certain way. The engine
  is isolated in one function (`classifyIncident`), so it could be swapped
  for a hosted model later without touching the API contract.
- **Soft delete, never hard delete** — incident records are audit-sensitive.
  Archiving stamps a `deletedAt` timestamp instead of removing the row, so
  nothing logged through the system is ever unrecoverable.
- **One shared TanStack Query cache drives every view** — the table, charts,
  metrics strip, and history all read the same `['incidents']` query, so a
  single `invalidateQueries` call after creating or archiving an incident
  keeps the entire dashboard in sync with one line of code.
- **AI analysis is a separate step from saving** — an agent runs the
  classification, reviews the recommendation, and only then submits, rather
  than the backend silently deciding the routing on save. This mirrors how
  a real agent would actually work: read, get a second opinion, decide.

## Author

**Phiwakonke Mthethwa**
Practical technical assessment for Bluespec Holdings.
