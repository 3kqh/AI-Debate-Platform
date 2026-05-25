# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Debate Platform** — a multiplayer debate platform where users compete in structured debates (British Parliamentary style), get real-time AI feedback, and earn ELO rankings. The repo contains both a React frontend and an Express.js backend, with documentation in Vietnamese.

**Docs are the source of truth** for requirements. Start at `Overview.md` for context, then consult `01_Debate_Rule.md` (debate format rules) and `05_Use_Cases.md` (MVP use cases) before implementing features.

---

## Repository Structure

```
docs/
├── frontend/          # React + Vite SPA
├── backend/           # Express + TypeScript API + Socket.IO server
├── Overview.md        # Start here — product overview, MVP scope, team
├── 01_Debate_Rule.md  # Debate format: motions, phases, speech times, CE/BGK
├── 04_TRD_Technical_Requirements.md  # API schema, architecture, data models
├── 05_Use_Cases.md    # 66 MVP use cases
├── 07_AI_Integration_Guide.md  # AI judge, speech analysis, toxicity
├── 08_Socket_Realtime_Guide.md  # Socket.IO events, timer, CE flow
├── 09_Team_Task_Breakdown.md   # Dev assignments
└── 12_API_Endpoints_MVP.md      # Endpoint reference
```

---

## Development Commands

### Backend (`backend/`)

```bash
npm install
npm run dev          # Development (tsx watch)
npm run build        # TypeScript compile → dist/
npm start            # Run production build
npm run lint
npm run format
```

### Frontend (`frontend/`)

```bash
npm install
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # TypeScript + Vite build
npm run lint
npm run format
```

### Required env files

**Backend** `.env`: `PORT`, `NODE_ENV`, `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `OPENAI_API_KEY`, `CLIENT_URL`

**Frontend** `.env`: `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api/v1`), `VITE_SOCKET_URL` (e.g. `http://localhost:3000`)

---

## Architecture

### Backend — Feature-Based Module Structure

Each feature lives under `src/features/<name>/` with its own routes, service, and schema:

- **auth** — JWT-based auth (access + refresh tokens stored in httpOnly cookies)
- **user** — profile, stats
- **room** — custom room CRUD
- **matchmaking** — ranked queue (ELO-based pairing)
- **debate** — debate session management
- **ranking** — leaderboard, ELO math
- **ai** — OpenAI GPT-4o calls for judge scoring, speech analysis, toxicity detection

**Socket.IO** runs on the same HTTP server. Handlers are separated by domain in `src/socket/`:
- `room.socket.ts` — join/leave room
- `debate.socket.ts` — phase changes, turn transitions
- `chat.socket.ts` — real-time chat with toxicity filtering
- `timer.service.ts` — countdown timer for speech turns

### Frontend — Pages + Services + Stores

- **Pages** (`src/pages/`) — route-level components, one dir per feature area
- **Services** (`src/services/`) — axios API calls, one file per feature
- **Stores** (`src/stores/`) — Zustand stores for auth state and debate state
- **Hooks** (`src/hooks/`) — `useSocket`, `useDebateSocket`, `useAuthInit`
- **Routes** (`src/routes/index.tsx`) — React Router v6 route definitions

State: Zustand for client state, React Query (TanStack) for server state, Socket.IO for real-time updates.

### API Conventions

- Base URL: `/api/v1`
- All routes follow REST conventions (see `12_API_Endpoints_MVP.md`)
- Request validation via `validate.ts` middleware (Zod schemas defined in feature schemas)
- Error responses use a standard wrapper via `src/utils/response.ts`
- JWT access token sent via `Authorization: Bearer <token>` header; refresh via httpOnly cookie

---

## Key Design Notes

- **Debate sessions** are stored in `DebateSession` (Mongoose model) — this is the core data entity
- **ELO system** is in the ranking feature; matchmaking uses a queue (`MatchQueue` model)
- **AI features** are gated behind `OPENAI_API_KEY` env var — graceful fallback when not set
- **MVP scope is locked** (v1.1, 66 use cases) — do not add features outside scope; suggestions go to `10_Idea_Build_Community.md`
- The backend uses ES Modules (`"type": "module"` in package.json); all imports require `.js` extensions
- No test framework is configured yet — add one if tests are needed
