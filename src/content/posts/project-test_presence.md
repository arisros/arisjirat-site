---
title: "test_presence"
description: "Presence management app with:"
category: "project"
tags: ["auto-imported"]
tech: ["flutter", "dart"]
status: "completed"
draft: false
---

# test_presence

Presence management app with:

- **BE**: Go backend with SQLite database
- **FE**: React frontend with GPS check-in flow

## Features

- Employee attendance (presence) is validated by office geolocation and radius.
- Employees can submit holiday requests.
- Admin can view report and approve/reject holiday requests.
- Role-based login for employee/admin.
- Map preview shows office center, allowed radius, and current employee GPS position.

## Project Structure

- `BE/` - REST API (Go + SQLite)
- `FE/` - Web app (React + Vite)

## Run Backend

```bash
cd BE
go mod tidy
go run .
```

Backend runs at: `http://localhost:8080`

Default users:

- `andi` / `password123` (employee)
- `budi` / `password123` (employee)
- `citra` / `password123` (admin)

## Run Frontend

```bash
cd FE
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

If needed, set API endpoint (optional). By default FE uses `/api` and proxy:

```bash
VITE_API_BASE=http://localhost:8080/api
```

## API Endpoints

- `POST /api/login` (public)
- `GET /api/config` (auth)
- `GET /api/employees` (admin)
- `POST /api/presence` (auth)
- `POST /api/holiday-requests` (auth)
- `GET /api/holiday-requests` (auth; employee sees own requests)
- `PATCH /api/holiday-requests/{id}` (admin)
- `GET /api/admin/report` (admin)

## Docker (One-command startup)

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

Notes:

- Docker FE proxies `/api` to backend container internally, so browser CORS is avoided.
- Local Vite dev server also proxies `/api` to `http://localhost:8080`.
