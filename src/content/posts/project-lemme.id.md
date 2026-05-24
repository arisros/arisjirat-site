---
title: "Lemme"
description: "Lemme adalah aplikasi kuis berbantuan AI. Pengguna mengunggah tangkapan layar kuis, OCR mengekstrak teks pertanyaan, dan beberapa penyedia LLM menghasilkan kandidat jawaban beserta penalarannya..."
category: "project"
tags: ["auto-imported"]
tech: ["flutter", "ai", "ocr"]
status: "completed"
draft: false
image: "/images/banners/project-lemme.png"
lang: "id"
translationKey: "project-lemme"
---

Lemme adalah aplikasi kuis berbantuan AI. Pengguna mengunggah tangkapan layar kuis; OCR mengekstrak teks pertanyaan, lalu beberapa penyedia LLM menghasilkan kandidat jawaban beserta penalarannya.

## Stack

| Lapisan | Teknologi |
|---|---|
| Backend | Go 1.24, Fiber v2, MySQL, Redis, WebSocket, Google OAuth |
| Frontend | Solid.js, Vite, PandaCSS / Park UI, TypeScript |
| Reverse proxy / TLS | Caddy |
| Target deployment | Homelab Debian di `lemme.arisjirat.com` |

## Arsitektur


![Diagram arsitektur Lemme: Caddy di depan UI Nginx dan API Go Fiber](/images/inline/project-lemme-1.svg)

```text
Browser
  -> Caddy (80/443, TLS termination)
      -> UI container (Nginx, static Solid build)
      -> API container (Go Fiber)
           -> MySQL (quiz/user/session data)
           -> Redis (session + OCR cache + locks)
           -> OCR + LLM providers (OpenAI/Anthropic/Gemini)
```

Caddy berada di depan seluruh stack dan menangani terminasi TLS. Di belakangnya:

- **UI** — build Solid statis yang disajikan oleh Nginx.
- **API** — layanan Go Fiber yang berkomunikasi dengan MySQL, Redis, serta penyedia OCR/LLM eksternal.

## Pengembangan Lokal


![Alur pengembangan lokal Lemme dengan Docker Compose](/images/inline/project-lemme-2.svg)

Seluruh stack dijalankan dengan Docker Compose.

### 1. Konfigurasi environment

Salin template env root dan backend, lalu isi secret yang diperlukan:

```bash
cp .env.example .env
cp lemme_service/.env.production.example lemme_service/.env
```

### 2. Jalankan service

```bash
make dev
```

### 3. Jalankan migrasi (jika diperlukan)

```bash
make migrate
```

### 4. Verifikasi

| Endpoint | URL |
|---|---|
| UI | `http://localhost:3000` |
| API health | `http://localhost:9090/healthz` |

## Deployment Production

### 1. Siapkan host

Pada server Debian, jalankan script setup:

```bash
./scripts/setup-server.sh
```

### 2. Clone dan konfigurasi

Clone repository ke `/opt/lemme`, lalu buat file env berikut:

- `/opt/lemme/.env`
- `/opt/lemme/lemme_service/.env`

### 3. Deploy

```bash
./deploy.sh
```

### 4. DNS dan jaringan

Arahkan A record `lemme.arisjirat.com` ke IP publik host, lalu teruskan port `80` dan `443`.

### 5. TLS

Caddy menyediakan dan memperbarui sertifikat secara otomatis — tidak ada langkah manual.

## Environment Variables

Template tersedia di:

- `.env.example` — env compose root
- `lemme_service/.env.production.example` — env production backend

### Variabel inti

| Grup | Variabel |
|---|---|
| Database | `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` |
| Redis | `REDIS_PASSWORD` |
| Backend | `DB_DSN`, `REDIS_ADDR`, `SESSION_COOKIE_SECRET`, `JWT_SECRET` |
| OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL` |
| Build args frontend | `VITE_API_URL`, `VITE_WS_URL`, `VITE_FRONTEND_URL`, `VITE_FEEDBACK_GFORMS_URL` |

## Perintah Umum

```bash
make dev       # build + up
make up        # up without rebuild
make down      # stop all services
make build     # build all images
make migrate   # run DB migrations
make logs      # tail logs
make backup    # run backup script
```
