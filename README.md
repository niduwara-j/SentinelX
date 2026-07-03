# SentinelX

Enterprise-inspired Security Operations Center (SOC) and Security Information and Event Management (SIEM) platform built with FastAPI, React, and PostgreSQL.

## Features
- Network Discovery
- Asset Inventory
- Vulnerability Assessment (coming soon)
- SIEM (coming soon)

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Vite
- Chart.js

### Backend
- Python + FastAPI
- PostgreSQL
- Docker

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev

cd backend
pip install -r requirements.txt
uvicorn main:app --reload


6. Press **Ctrl + S** to save

---

### Step 2: Edit .gitignore (The File, Not Terminal)

1. **In VS Code**, find the file called **`.gitignore`**
2. **Click on it** to open it
3. **Delete everything** in that file
4. **Copy and paste** this:

```gitignore
# Dependencies
node_modules/
__pycache__/
*.py[codz]

# Environment files
.env
*.env

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/

# Build files
dist/
build/

# Virtual environments
.venv
env/
venv/

# Test coverage
.coverage
.pytest_cache/

# Logs
*.log

# Database
*.db
*.sqlite