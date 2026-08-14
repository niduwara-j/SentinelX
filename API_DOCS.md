# SentinelX Version 1.0 — API Specification (Hardened Foundation)

Base URL: `http://localhost:8000/api/v1`  
Interactive OpenAPI Docs: `http://localhost:8000/docs`  
ReDoc Documentation: `http://localhost:8000/redoc`

All authenticated endpoints require the standard Bearer header:
```http
Authorization: Bearer <access_token>
```

All responses include request correlation tracing header:
```http
X-Request-ID: <uuid4>
```

---

## 1. Centralized Error Envelope

All API errors return a standard JSON response:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Scan not found",
    "details": null
  },
  "request_id": "8f83b27b-0ea4-4f81-ba55-9d3a77028b0f"
}
```

### Standard Error Codes:
- `VALIDATION_ERROR` (HTTP 422 / 400): Malformed input payload or parameter.
- `UNAUTHORIZED` (HTTP 401): Missing, invalid, or expired authentication token.
- `FORBIDDEN` (HTTP 403): User lacks permission for the action.
- `RESOURCE_NOT_FOUND` (HTTP 404): Resource does not exist OR belongs to another user.
- `DUPLICATE_RESOURCE` (HTTP 400): Username or email already registered.
- `RATE_LIMIT_EXCEEDED` (HTTP 429): Rate limit exceeded. Check `Retry-After` header.
- `SCAN_TARGET_INVALID` (HTTP 400): Target syntax is invalid or contains prohibited characters.
- `SCAN_LIMIT_EXCEEDED` (HTTP 400): User already has an active scan running.
- `INTERNAL_SERVER_ERROR` (HTTP 500): Sanitized internal server error.

---

## 2. Operational Health Endpoints

- `GET /health` -> `{ "status": "healthy", "service": "SentinelX", "version": "1.0.0", "timestamp": "..." }`
- `GET /health/db` -> `{ "status": "healthy", "database": "postgresql", "connected": true, "timestamp": "..." }`

---

## 3. Authentication Endpoints

### 3.1 Register User
- **Method & Route**: `POST /api/v1/auth/register`
- **Rate Limit**: 10 requests / hour / IP
- **Request Body**:
```json
{
  "username": "analyst_dija",
  "email": "dija@sentinelx.com",
  "password": "SecurePassword123!"
}
```
- **Response `201 Created`**:
```json
{
  "id": 1,
  "username": "analyst_dija",
  "email": "dija@sentinelx.com",
  "is_active": true
}
```

### 3.2 Login
- **Method & Route**: `POST /api/v1/auth/login`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Rate Limit**: 10 requests / minute / IP
- **Request Body**: `username=analyst_dija&password=SecurePassword123!`
- **Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "token_type": "bearer"
}
```

### 3.3 Get Current User Profile
- **Method & Route**: `GET /api/v1/auth/me`
- **Auth Required**: Yes
- **Response `200 OK`**:
```json
{
  "id": 1,
  "username": "analyst_dija",
  "email": "dija@sentinelx.io",
  "is_active": true,
  "created_at": "2026-08-14T10:00:00Z",
  "updated_at": "2026-08-14T10:00:00Z"
}
```

### 3.4 Update User Profile
- **Method & Route**: `PATCH /api/v1/auth/me`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "username": "lead_analyst_dija",
  "email": "dija.lead@sentinelx.io"
}
```
- **Response `200 OK`**: Updated user profile.

### 3.5 Change Password (Authenticated)
- **Method & Route**: `POST /api/v1/auth/change-password`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "current_password": "CurrentPassword123!",
  "new_password": "BrandNewSecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "message": "Password changed successfully."
}
```

### 3.6 Get Platform Preferences
- **Method & Route**: `GET /api/v1/auth/preferences`
- **Auth Required**: Yes
- **Response `200 OK`**:
```json
{
  "theme": "dark",
  "default_scan_type": "quick",
  "updated_at": "2026-08-14T10:00:00Z"
}
```

### 3.7 Update Platform Preferences
- **Method & Route**: `PATCH /api/v1/auth/preferences`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "theme": "dark",
  "default_scan_type": "full"
}
```
- **Response `200 OK`**: Updated user preferences.

### 3.8 Request Password Reset (Forgot Password)
- **Method & Route**: `POST /api/v1/auth/forgot-password`
- **Rate Limit**: 5 requests / 5 minutes / IP
- **Enumeration Defense**: Always returns generic response regardless of whether email exists.
- **Request Body**:
```json
{
  "email": "analyst@sentinelx.com"
}
```
- **Response `200 OK`**:
```json
{
  "message": "If an account exists for this email, a password reset link has been sent."
}
```

### 3.9 Execute Password Reset
- **Method & Route**: `POST /api/v1/auth/reset-password`
- **Rate Limit**: 10 requests / 5 minutes / IP
- **Security**: Single-use token validated against SHA-256 hash in database; expires in 15 minutes; automatically invalidates all previous sessions.
- **Request Body**:
```json
{
  "token": "dGhpcy1pcy1hLXNlY3VyZS1yYW5kb20tdG9rZW4=",
  "new_password": "MyNewSecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "message": "Password has been successfully reset. You may now log in with your new password."
}
```



---

## 4. Network Discovery Scanner Endpoints

### 4.1 Launch Scan
- **Method & Route**: `POST /api/v1/scans`
- **Rate Limit**: 20 requests / hour / user
- **Resource Constraints**: Max 1 concurrent scan per user; Max `/24` subnet (256 hosts); 300s timeout.
- **Request Body**:
```json
{
  "target": "192.168.1.0/24",
  "scan_type": "quick"
}
```
*(Options for `scan_type`: `"quick"` or `"full"`)*
- **Response `201 Created`**:
```json
{
  "id": 1,
  "target": "192.168.1.0/24",
  "scan_type": "quick",
  "status": "pending",
  "error_message": null,
  "started_at": "2026-08-14T11:20:00Z",
  "finished_at": null
}
```

### 4.2 List Scans
- **Method & Route**: `GET /api/v1/scans?skip=0&limit=50`
- **Auth Required**: Yes (returns only scans created by authenticated user)

### 4.3 Get Scan Details & Findings
- **Method & Route**: `GET /api/v1/scans/{scan_id}`
- **Auth Required**: Yes (returns 404 if scan belongs to another user)

---

## 5. Asset Inventory Endpoints

### 5.1 List Assets
- **Method & Route**: `GET /api/v1/assets?search=192.168&status=up&skip=0&limit=50`
- **Auth Required**: Yes (returns only hosts discovered by authenticated user)

### 5.2 Get Asset Detail
- **Method & Route**: `GET /api/v1/assets/{asset_id}`
- **Auth Required**: Yes (returns 404 if asset belongs to another user)

---

## 6. Reports & Export Endpoints

### 6.1 List Completed Reports
- **Method & Route**: `GET /api/v1/reports?skip=0&limit=50`

### 6.2 Get Single Report
- **Method & Route**: `GET /api/v1/reports/{scan_id}`

### 6.3 Export Report as CSV
- **Method & Route**: `GET /api/v1/reports/{scan_id}/csv`
- **Response**: `text/csv` attachment stream

### 6.4 Export Report as JSON
- **Method & Route**: `GET /api/v1/reports/{scan_id}/json`
- **Response**: `application/json` payload
