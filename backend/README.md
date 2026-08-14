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

The API will be live at `http://localhost:8000`, interactive docs at
`http://localhost:8000/docs`.

## API Endpoints (V1)

| Method | Path                     | Auth required | Description                          |
|--------|--------------------------|:--------------:|---------------------------------------|
| POST   | `/register`              | No             | Create a user account                 |
| POST   | `/login`                 | No             | Get a JWT (OAuth2 password form)      |
| GET    | `/me`                    | Yes            | Current user info                     |
| POST   | `/scan`                  | Yes            | Start a scan (runs in background)     |
| GET    | `/scans`                 | Yes            | List your scans                       |
| GET    | `/scan/{id}`             | Yes            | Scan detail + results                 |
| GET    | `/assets`                | Yes            | List discovered assets                |
| GET    | `/asset/{id}`            | Yes            | Asset detail + its services           |
| GET    | `/reports`               | Yes            | List completed scans as reports       |
| GET    | `/reports/{id}`          | Yes            | Report detail                         |
| GET    | `/reports/{id}/csv`      | Yes            | Download report as CSV                |
| GET    | `/reports/{id}/json`     | Yes            | Download report as JSON               |
| GET    | `/health`                | No             | Health check                          |

`/login` expects `application/x-www-form-urlencoded` with `username` and
`password` fields (standard OAuth2 password flow) - Axios on the frontend
should send it as `URLSearchParams`, not JSON.

## Scanner scope (read before your first real scan)

The scanner (`app/scanner/`) currently probes whatever `target` is passed to
`POST /scan` - a single IP, hostname, or CIDR range. For development, point
it at `127.0.0.1` or your own private LAN range (e.g. `192.168.1.0/24`).

**Do not point it at ranges you don't own or have explicit permission to
scan** - scanning networks without authorization can be illegal even when
done for a school project. Before expanding usage beyond localhost/your own
lab network, add an explicit allow-list check in `scan_service.py` so the
API rejects out-of-scope targets rather than trusting whatever the frontend
sends.

## Local dev without Docker (optional)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

You'll need a local Postgres instance and a `DATABASE_URL` pointing at it
if you skip Docker.

## Tests

```bash
cd backend
pytest
```

## Notes for Dija (frontend)

- CORS is open to `http://localhost:5173` and `http://localhost:3000` by
  default (see `.env` / `CORS_ORIGINS`) - covers Vite's and CRA's default
  ports.
- All protected routes expect `Authorization: Bearer <token>`.
- `POST /scan` returns immediately with `status: "pending"` then runs async;
  poll `GET /scan/{id}` until `status` is `"completed"` or `"failed"`.
