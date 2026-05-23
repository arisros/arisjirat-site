---
title: "gostudentubl"
description: "Automated attendance runner for Moodle-based courses with scheduled execution."
category: "project"
tags: ["auto-imported"]
tech: ["go"]
featured: true
status: "completed"
draft: false
repo: "https://github.com/emandor/gostudentubl"
image: "/images/banners/project-gostudentubl.png"
lang: "en"
translationKey: "project-gostudentubl"
---

## Overview

Automated attendance runner for Moodle-based courses with scheduled execution.

## Local Run

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Fill in the required values in `.env`.
3. Run locally:

   ```bash
   make run
   ```

## Docker Agent Deployment

This project can run as a long-lived Docker service (`attendance-agent`) that executes scheduled jobs internally.

### Deploy

```bash
make docker-deploy
```

Equivalent command:

```bash
docker compose up -d --build
```

### Cross-Project WhatsApp Integration (Same Host)

If `wa-bot-notif` runs as a separate Docker project on the same machine, connect both stacks via a shared external network.

1. Create the shared network once:

   ```bash
   docker network create homelab_integration
   ```

2. Set the following in `.env`:

   ```env
   INTEGRATION_NETWORK=homelab_integration
   WA_ENDPOINT=http://wa-bot-notif-api:5000/send
   ```

   If `wa-bot-notif` uses a non-default `PORT` (for example `5001`), match it in `WA_ENDPOINT`.

3. Start the `wa-bot-notif` stack first, then this stack.

> Do not use `localhost` for cross-container calls — use service/container DNS on the shared network.

### Operate

| Action | Command |
| --- | --- |
| Tail logs | `make docker-logs` |
| Restart | `make docker-restart` |
| Stop | `make docker-down` |

### Trigger a Manual Run Inside the Container

The app listens for `SIGUSR1` and executes a direct attendance run on receipt.

```bash
make docker-signal-run
```

Equivalent command:

```bash
docker compose kill -s SIGUSR1 attendance-agent
```

## Operational Notes

- Scheduler timezone is controlled by `TIMEZONE`.
- App logs are written to stdout and to a rotating `app.log` inside the container workdir (`/app`).
- Keep secrets only in `.env` (already ignored by git).
- Run a single agent instance unless you add distributed locking — otherwise duplicate attendance jobs can occur.

## Quiz and Assignment Tracking

The runner now tracks richer assignment/quiz metadata and sends smarter notifications.

### Features

- **Assignment list parsing**: due date, submission status, grade.
- **Quiz list parsing**: close date, grade.
- **Detail page fetch pipeline** for assignments and quizzes (limited per run).
- **Deadline reminders** at 24h and 12h windows for unfinished items.
- **Optional AI suggestion pipeline** via OpenRouter for pending tasks.

### Relevant Environment Variables

| Variable | Default | Notes |
| --- | --- | --- |
| `DETAIL_FETCH_ENABLED` | `true` | Toggles detail page fetching. |
| `DETAIL_FETCH_LIMIT` | `10` | Caps detail fetches per run. |
| `OPENROUTER_ENDPOINT` | `https://openrouter.ai/api/v1/chat/completions` | OpenRouter chat completions URL. |
| `OPENROUTER_API_KEY` | — | Required when `SUGGESTION_ENABLED=true`. |
| `OPENROUTER_MODEL` | `anthropic/claude-sonnet-4-20250514` | Model used for suggestions. |
| `SUGGESTION_ENABLED` | `false` | Enables AI suggestions. |
| `SUGGESTION_LIMIT` | `5` | Max suggestions generated per run. |

## Periode Mode

This project supports dynamic period filtering, so monthly manual config updates are optional.

### Modes

- **`PERIODE_MODE=auto`** (recommended): accepts the current month and the next month (`MMYY`) automatically.
  - Example in Feb 2026: `0226` and `0326` are accepted.
- **`PERIODE_MODE=manual`**: accepts only values listed in `ALLOWED_PERIODES` (comma separated).
- **`PERIODE_MODE=legacy`**: keeps strict `CURRENT_PERIODE` equality behavior.

### Safety Setting

- `MAX_COURSES_PER_RUN`: hard cap to prevent accidental over-selection.
  - `0` disables the cap (default).
