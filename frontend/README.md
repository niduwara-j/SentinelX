# SentinelX Frontend (Version 1)

React + TypeScript + Tailwind frontend, wired to the SentinelX FastAPI
backend.

## Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Runs at `http://localhost:5173`. Make sure the backend (see `/backend`) is
running at the URL in `.env` (`VITE_API_BASE_URL`) - default `http://localhost:8000`.

## Structure

Matches the agreed frontend structure doc: `components/ pages/ layouts/
services/ hooks/ context/ types/ routes/ styles/ utils/`.

- `services/` - one file per backend resource (`authService`, `scanService`,
  `assetService`, `reportService`), all going through the shared `api.ts`
  Axios instance which attaches the JWT and handles 401s.
- `context/AuthContext` - holds the logged-in user, token lives in
  `localStorage` under `sentinelx_token`.
- `hooks/` - `useAuth`, `useAssets`, `useScanner` (handles start + polling),
  `useReports`.
- Sidebar already reserves (disabled) nav slots for Vulnerabilities /
  Events / Alerts / Incidents / Threat Intel / Administration per the
  roadmap, so later versions don't need to touch the layout.

## Known V1 gaps / where to extend

- **Dashboard charts** aggregate port/service data by calling
  `GET /asset/{id}` for up to 50 assets client-side (no aggregate endpoint
  exists yet). If Niduwara adds a `GET /assets/stats`-style endpoint later,
  swap the `useEffect` in `pages/Dashboard.tsx` for a single call.
- **Assets** are global (not scoped per-user) to match the backend's
  `GET /assets` behavior - matches V1 spec, revisit if multi-tenant asset
  ownership becomes a requirement.
- Login talks to `/login` as `application/x-www-form-urlencoded`
  (OAuth2 password flow) - not JSON. If that endpoint's shape ever
  changes, update `authService.login`.

## Theme

Dark enterprise theme per the brief - background `#0F172A`, sidebar
`#111827`, cards `#1E293B`, purple primary `#7C3AED`, blue secondary
`#2563EB`. UI text uses Inter; IPs/ports/tokens/hashes render in
JetBrains Mono (`font-mono` / `.data-mono`) so technical data reads
distinctly from UI chrome - deliberate choice, not an accident, keep it
consistent in new components.
