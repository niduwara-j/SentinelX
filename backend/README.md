# SentinelX Backend (Version 1)

FastAPI backend for SentinelX - Authentication, Network Scanner Engine, Asset
Inventory, and Reports, per the Version 1 roadmap.

## Structure

```
backend/
├── app/
│   ├── core/       # config, db session, security (JWT/hashing)
│   ├── models/     # SQLAlchemy tables: User, Asset, Service, Scan, ScanResult
│   ├── schemas/     # Pydantic request/response models
│   ├── routers/     # API route handlers (auth, scanner, assets, reports)
│   ├── services/     # business logic, called by routers
│   ├── scanner/     # ping sweep, TCP port scan, service detection engine
│   ├── utils/       # logging etc.
│   ├── tests/       # pytest tests
│   └── main.py       # FastAPI app entrypoint
├── alembic/          # DB migrations (use this after V1 ships, not create_all)
├── requirements.txt
└── Dockerfile
```

## Running it (from the repo root, not this folder)

```bash
cp .env.example .env
# edit .env if you want to change the JWT secret, etc.
docker compose up --build
```

The API will be live at `http://localhost:8001`, interactive docs at
`http://localhost:8001/docs`, and ReDoc at `http://localhost:8001/redoc`.

## API Endpoints (V1 — Under `/api/v1/`)

| Method | Path                           | Auth required | Description                            |
|--------|--------------------------------|:-------------:|----------------------------------------|
| POST   | `/api/v1/auth/register`        | No            | Create a user account                  |
| POST   | `/api/v1/auth/login`           | No            | Get a JWT (OAuth2 password form)       |
| GET    | `/api/v1/auth/me`              | Yes           | Current user profile                   |
| PATCH  | `/api/v1/auth/me`              | Yes           | Update profile (username/email)        |
| POST   | `/api/v1/auth/change-password` | Yes           | Update account password                |
| POST   | `/api/v1/auth/forgot-password` | No            | Request password reset link            |
| POST   | `/api/v1/auth/reset-password`  | No            | Execute password reset with token      |
| GET    | `/api/v1/auth/preferences`     | Yes           | Get user scan preferences              |
| PATCH  | `/api/v1/auth/preferences`     | Yes           | Update user scan preferences           |
| POST   | `/api/v1/scans`                | Yes           | Start a scan (runs in background)      |
| GET    | `/api/v1/scans`                | Yes           | List your scans                        |
| GET    | `/api/v1/scans/{id}`           | Yes           | Scan detail + results                  |
| GET    | `/api/v1/assets`               | Yes           | List discovered assets                 |
| GET    | `/api/v1/assets/{id}`          | Yes           | Asset detail + its services            |
| GET    | `/api/v1/reports`              | Yes           | List completed scans as reports        |
| GET    | `/api/v1/reports/{id}`         | Yes           | Report detail                          |
| GET    | `/api/v1/reports/{id}/csv`     | Yes           | Download report as CSV                 |
| GET    | `/api/v1/reports/{id}/json`    | Yes           | Download report as JSON                |
| GET    | `/health`                      | No            | Operational health check               |
| GET    | `/health/db`                   | No            | Database connectivity health check     |

`/api/v1/auth/login` expects `application/x-www-form-urlencoded` with `username` and
`password` fields (standard OAuth2 password flow) - Axios on the frontend
should send it as `URLSearchParams`, not JSON.

## Scanner scope (read before your first real scan)

The scanner (`app/scanner/`) currently probes whatever `target` is passed to
`POST /api/v1/scans` - a single IP, hostname, or CIDR range. For development, point
it at `127.0.0.1` or your own private LAN range (e.g. `192.168.1.0/24`).

**Do not point it at ranges you don't own or have explicit permission to
scan** - scanning networks without authorization can be illegal even when
done for a school project.

## Local dev without Docker (optional)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

You'll need a local Postgres instance (host port `54320` via Docker or local `5432`) and a `DATABASE_URL` pointing at it
if you skip Docker.

## Tests

```bash
cd backend
pytest
```

## Frontend Integration Notes

- CORS is open to `http://localhost:5173` and `http://127.0.0.1:5173` by default (see `.env` / `CORS_ORIGINS`).
- All protected routes expect `Authorization: Bearer <token>`.
- `POST /api/v1/scans` returns immediately with `status: "pending"` then runs async;
  poll `GET /api/v1/scans/{id}` until `status` is `"completed"` or `"failed"`.

