---
title: "Lemme"
description: "Lemme is an AI-assisted quiz application. Users upload quiz screenshots, OCR extracts question text, and multiple LLM providers generate answer and reasoning..."
category: "project"
tags: ["auto-imported"]
tech: ["flutter", "ai", "ocr"]
status: "completed"
draft: false
image: "/images/banners/project-lemme.png"
lang: "en"
translationKey: "project-lemme"
---

# Lemme

Lemme is an AI-assisted quiz application. Users upload quiz screenshots, OCR extracts question text, and multiple LLM providers generate answer and reasoning candidates.

## Stack

- Backend: Go 1.24, Fiber v2, MySQL, Redis, WebSocket, Google OAuth
- Frontend: Solid.js, Vite, PandaCSS/Park UI, TypeScript
- Reverse proxy/TLS: Caddy
- Deployment target: Debian homelab on `lemme.arisjirat.com`

## Architecture

```text
Browser
  -> Caddy (80/443, TLS termination)
      -> UI container (Nginx, static Solid build)
      -> API container (Go Fiber)
           -> MySQL (quiz/user/session data)
           -> Redis (session + OCR cache + locks)
           -> OCR + LLM providers (OpenAI/Anthropic/Gemini)
```

## Local Development with Docker Compose

1. Copy root env template:

   ```bash
   cp .env.example .env
   ```

2. Copy backend env template and set required secrets:

   ```bash
   cp lemme_service/.env.production.example lemme_service/.env
   ```

3. Start all services:

   ```bash
   make dev
   ```

4. Run migrations manually (if needed):

   ```bash
   make migrate
   ```

5. Open app and health endpoint:

   - UI: `http://localhost:3000`
   - API health: `http://localhost:9090/healthz`

## Production Deployment

1. On Debian host, run setup script:

   ```bash
   ./scripts/setup-server.sh
   ```

2. Clone repository to `/opt/lemme`, configure:

   - `/opt/lemme/.env`
   - `/opt/lemme/lemme_service/.env`

3. Deploy:

   ```bash
   ./deploy.sh
   ```

4. Ensure DNS A record points `lemme.arisjirat.com` to the host public IP and ports `80/443` are forwarded.

5. Caddy provisions and renews certificates automatically.

## Environment Variables

- Root compose env: `.env.example`
- Backend prod env: `lemme_service/.env.production.example`

Core variables:

- Database: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- Redis: `REDIS_PASSWORD`
- Backend: `DB_DSN`, `REDIS_ADDR`, `SESSION_COOKIE_SECRET`, `JWT_SECRET`
- OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`
- Frontend build args: `VITE_API_URL`, `VITE_WS_URL`, `VITE_FRONTEND_URL`, `VITE_FEEDBACK_GFORMS_URL`

## Common Commands

```bash
make dev       # build + up
make up        # up without rebuild
make down      # stop all services
make build     # build all images
make migrate   # run DB migrations
make logs      # tail logs
make backup    # run backup script
```
