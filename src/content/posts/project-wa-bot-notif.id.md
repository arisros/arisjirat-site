---
title: "wa-bot-notif"
description: "Layanan notifikasi WhatsApp — Go + whatsmeow."
category: "project"
lang: "id"
translationKey: "project-wa-bot-notif"
repo: "https://github.com/emandor/fti-wa-bot"
status: "completed"
draft: false
tags: ["auto-imported"]
tech: ["go", "whatsapp", "bot"]
---

## Ikhtisar

Layanan notifikasi WhatsApp yang dibangun dengan **Go** dan [whatsmeow](https://github.com/tulir/whatsmeow). Menyediakan HTTP API ringkas untuk mengirim pesan, memeriksa kontak, dan menjalankan health check.

## API

| Method | Path | Auth | Deskripsi |
|--------|------|------|-----------|
| `POST` | `/send` | Bearer | Mengirim pesan WhatsApp |
| `GET` | `/contacts` | Bearer | Daftar kontak yang tersinkronisasi |
| `GET` | `/messages` | Bearer | Cache pesan terbaru (runtime memory) |
| `GET` | `/healthz` | — | Selalu mengembalikan `200 OK` |
| `GET` | `/readyz` | — | `200` saat WA terhubung, `503` jika tidak |

### POST /send


![Alur permintaan POST /send dari klien ke WhatsApp melalui layanan](/images/inline/project-wa-bot-notif-1.svg)

Request body:

```json
{ "message": "hello", "userId": "628xxx", "groupId": "120363...@g.us" }
```

Prioritas penentuan target: `userId` → `groupId` → fallback ke env `GROUP_JID`.

Response:

```json
{ "success": true, "sent_to": "<jid>", "timestamp": "<RFC3339>" }
```

## Konfigurasi

| Variabel | Default | Wajib | Deskripsi |
|----------|---------|-------|-----------|
| `AUTH_TOKEN` | — | ✅ | Bearer token untuk seluruh endpoint berautentikasi |
| `PORT` | `5000` | — | Port listen HTTP (1–65535) |
| `GROUP_JID` | — | — | Target pengiriman default saat request tidak menyertakan `userId`/`groupId` |
| `AUTH_DB_DSN` | `file:auth.db?_foreign_keys=on` | — | DSN SQLite untuk sesi WhatsApp |
| `LOGS_DB_DSN` | `file:logs.db?_foreign_keys=on` | — | DSN SQLite untuk audit log |
| `LOG_LEVEL` | `info` | — | Level Zerolog: `trace`, `debug`, `info`, `warn`, `error` |

> Salin `.env.example` menjadi `.env`, lalu isi `AUTH_TOKEN` dan `GROUP_JID` sebelum menjalankan untuk pertama kali.

## Menjalankan Secara Lokal

### Prasyarat

- Go 1.25+
- CGO toolchain
- SQLite dev headers
  - **macOS:** Xcode Command Line Tools
  - **Debian/Ubuntu:** `build-essential libsqlite3-dev`

### Menjalankan layanan

```bash
GOTOOLCHAIN=auto go run ./cmd/api
```

### Pemeriksaan saat pengembangan

```bash
GOTOOLCHAIN=auto go test ./...
GOTOOLCHAIN=auto go vet ./...
GOTOOLCHAIN=auto gofmt -l .
```

## Docker

```bash
cp .env.example .env
# isi AUTH_TOKEN

docker compose -f deploy/docker-compose.yml up --build -d
docker compose -f deploy/docker-compose.yml logs -f api
```

File SQLite dipersistensikan melalui Docker volume `wa_bot_notif_data`.

### Deployment shared-network

Pada deployment shared-network, layanan dapat diakses di `http://wa-bot-notif-api:5000` melalui network `homelab_integration`:

```bash
docker network create homelab_integration
```

Selanjutnya, atur `INTEGRATION_NETWORK=homelab_integration` di `.env`.

## Struktur Proyek


![Struktur komponen layanan wa-bot-notif dan dependensinya](/images/inline/project-wa-bot-notif-2.svg)

```
.
├── cmd/api/          — entry point
├── internal/
│   ├── config/       — env config loading + validation
│   ├── httpapi/      — HTTP handlers
│   ├── storage/      — SQLite audit log store
│   └── wa/           — WhatsApp connection manager
├── deploy/           — Docker Compose
├── docs/ai/          — AI agent guidance and planning docs
├── Dockerfile
└── go.mod
```

## Bacaan Lebih Lanjut

### Dokumentasi AI

- `AGENTS.md` — entrypoint agent
- `docs/ai/README.md` — indeks lengkap dokumentasi AI

### Deployment

- `docs/deploy.md` — runbook deployment lengkap (lokal, Docker, homelab, WireGuard)
