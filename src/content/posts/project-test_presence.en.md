---
title: "test_presence"
description: "Attendance management app with:"
category: "project"
lang: "en"
translationKey: "project-test_presence"
status: "completed"
draft: false
tags: ["auto-imported"]
tech: ["flutter", "dart"]
---

## Overview

Attendance management app for tracking employee presence with GPS-based check-in and a leave request flow.

- **Backend**: Go with SQLite database
- **Frontend**: React with GPS check-in flow

## Features

- Attendance validation based on office geolocation and a configurable radius
- Leave request submission for employees
- Admin dashboard for reports and for approving or rejecting leave requests
- Role-based authentication for employees and admins
- Map preview showing the office center point, allowed radius, and the employee's current GPS position

## Project Structure


![Struktur proyek test_presence: backend Go/SQLite dan frontend React/Vite](/images/inline/project-test_presence-1.svg)

| Directory | Description |
|-----------|-------------|
| `BE/` | REST API (Go + SQLite) |
| `FE/` | Web app (React + Vite) |

## Running the Backend

```bash
cd BE
go mod tidy
go run .
```

The backend runs at `http://localhost:8080`.

### Default Users

| Username | Password | Role |
|----------|-------------|----------|
| `andi` | `password123` | Employee |
| `budi` | `password123` | Employee |
| `citra` | `password123` | Admin |

## Running the Frontend

```bash
cd FE
npm install
npm run dev
```

The frontend is available at `http://localhost:5173`.

> By default, the FE uses `/api` through the Vite proxy. To change the API endpoint, set:

```bash
VITE_API_BASE=http://localhost:8080/api
```

## API Endpoints


![Alur check-in GPS: validasi lokasi karyawan terhadap radius kantor](/images/inline/project-test_presence-2.svg)

### Public

- `POST /api/login`

### Authenticated

- `GET /api/config`
- `POST /api/presence`
- `POST /api/holiday-requests`
- `GET /api/holiday-requests` — employees only see their own requests

### Admin Only

- `GET /api/employees`
- `PATCH /api/holiday-requests/{id}`
- `GET /api/admin/report`

## Docker Setup

Run the entire stack with a single command:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

### Notes

- The Dockerized FE proxies `/api` to the backend container internally, avoiding CORS issues in the browser.
- The local Vite dev server also proxies `/api` to `http://localhost:8080`.
