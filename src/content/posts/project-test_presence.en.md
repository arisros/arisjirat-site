---
title: "test_presence"
description: "Presence management app with:"
category: "project"
tags: ["auto-imported"]
tech: ["flutter", "dart"]
status: "completed"
draft: false
lang: "en"
translationKey: "project-test_presence"
---

## Overview

A presence management application for tracking employee attendance with GPS-based check-ins and holiday request workflows.

- **Backend**: Go with SQLite database
- **Frontend**: React with GPS check-in flow

## Features

- Attendance validated against office geolocation and a configurable radius
- Holiday request submission for employees
- Admin dashboard for reports and holiday request approval/rejection
- Role-based authentication for employees and admins
- Map preview showing office center, allowed radius, and the employee's current GPS position

## Project Structure

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

The backend listens on `http://localhost:8080`.

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

> By default, the FE uses `/api` with a Vite proxy. To override the API endpoint, set:

```bash
VITE_API_BASE=http://localhost:8080/api
```

## API Endpoints

### Public

- `POST /api/login`

### Authenticated

- `GET /api/config`
- `POST /api/presence`
- `POST /api/holiday-requests`
- `GET /api/holiday-requests` — employees see only their own requests

### Admin Only

- `GET /api/employees`
- `PATCH /api/holiday-requests/{id}`
- `GET /api/admin/report`

## Docker Setup

Start the entire stack with a single command:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

### Notes

- The Docker FE proxies `/api` to the backend container internally, avoiding browser CORS issues.
- The local Vite dev server also proxies `/api` to `http://localhost:8080`.
