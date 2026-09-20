# SentinelX — Enterprise Security Operations & Network Reconnaissance Platform

[![Version](https://img.shields.io/badge/version-1.0.0-purple.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker)](https://www.docker.com)

**SentinelX** is a modern, cloud-native Security Operations Center (SOC) platform engineered to automate network reconnaissance, host discovery, port scanning, and asset telemetry under an intuitive, high-performance web interface.

---

## 🌐 Standardized Local Ports & Service URLs

SentinelX runs across three core services with standardized localhost port assignments:

| Service | Host Port | Access URL | Purpose |
| :--- | :---: | :--- | :--- |
| **SentinelX Frontend** | **`5173`** | [**`http://localhost:5173`**](http://localhost:5173) | Main React/Vite SOC Dashboard & Scanner Web App |
| **SentinelX Backend API** | **`8001`** | [**`http://localhost:8001/api/v1`**](http://localhost:8001/api/v1) | FastAPI REST API Gateway |
| **Interactive OpenAPI Docs** | **`8001`** | [**`http://localhost:8001/docs`**](http://localhost:8001/docs) | Swagger UI for interactive endpoint testing |
| **ReDoc Documentation** | **`8001`** | [**`http://localhost:8001/redoc`**](http://localhost:8001/redoc) | Alternative structured API documentation |
| **PostgreSQL Database** | **`54320`** | `localhost:54320` *(Maps to container `5432`)* | Relational database (pgAdmin, DBeaver) |

---

## 🚀 Quick Start (Docker Compose)

The easiest way to run the complete SentinelX platform is using Docker Compose:

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Git.

### 2. Clone and Setup
```bash
git clone https://github.com/your-username/sentinelx-v1.git
cd sentinelx-v1
cp .env.example .env
```

### 3. Build & Run Containers
```bash
docker compose up --build -d
```

### 4. Access the Application
- Open [**`http://localhost:5173`**](http://localhost:5173) in your browser.
- Register an analyst account and begin network discovery scans.

---

## 💻 Manual Local Development (Without Docker)

### 1. Database (PostgreSQL)
Ensure PostgreSQL is running locally on port `54320` (or `5432`). Set your `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql+psycopg2://sentinelx:sentinelx@localhost:54320/sentinelx
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```
The API is available at `http://localhost:8001` (Docs at `http://localhost:8001/docs`).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The web app is available at `http://localhost:5173`.

---

## 🛡️ Core Features (Version 1)

* **Concurrent Network Scanner**: Multi-threaded TCP and ICMP socket engine supporting IPv4 addresses, hostnames, and CIDR subnet blocks (`/24`).
* **Strict Per-User Data Isolation**: Server-side query scoping ensuring all scan telemetry, discovered assets, and reports belong strictly to the authenticated analyst.
* **Hardened Authentication**: JWT sessions with bcrypt hashing, atomic single-use password reset tokens (SHA-256), and session revocation on password changes.
* **Enterprise Dark SOC Theme**: Authentic, glare-free cybersecurity design system (`#0F172A` navy, `#1E293B` cards, `#7C3AED` purple accent).
* **Compliance Reports**: Instant CSV and JSON findings export.
* **100% Automated Test Coverage**: 45 comprehensive automated tests covering security, rate limiting, and network validation.

---

## 📁 Repository Structure

```
sentinelx-v1/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, DB session, JWT security, middleware
│   │   ├── models/        # SQLAlchemy ORM models (User, Asset, Service, Scan, etc.)
│   │   ├── routers/       # Versioned API routes (/api/v1/auth, scans, assets, reports)
│   │   ├── scanner/       # Ping sweep, TCP scan, service detection engine
│   │   ├── schemas/       # Pydantic v2 validation contracts
│   │   └── services/      # Business logic & ownership enforcement
│   ├── tests/             # Automated pytest suite (45 tests)
│   ├── Dockerfile         # Backend container definition (Exposes 8001)
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # Common UI components, layout, dashboard, scanner
│   │   ├── context/       # Auth and Theme providers
│   │   ├── pages/         # Dashboard, Scan, Assets, Reports, Settings, Auth
│   │   ├── services/      # Typed API client services
│   │   └── styles/        # Tailwind & global theme tokens
│   ├── Dockerfile         # Nginx production container (Exposes 5173)
│   ├── package.json       # Node.js dependencies
│   └── vite.config.ts     # Vite configuration (Port 5173)
├── docker-compose.yml     # Multi-container orchestration (5173, 8001, 54320)
├── API_DOCS.md            # Comprehensive REST API specifications
├── .env.example           # Environment template
└── README.md              # Repository overview & setup guide
```

---

## 🧪 Running Automated Tests

Run the complete backend test suite:
```bash
# Using Docker:
docker exec -e PYTHONPATH=/app sentinelx_backend pytest -v

# Locally:
cd backend
pytest -v
```

---

## 📄 License
This project is licensed under the MIT License.
