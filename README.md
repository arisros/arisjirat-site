# arisjirat.com

Personal site — studies, projects, research, tools, and setup.

Built with [Astro](https://astro.build), deployed on homelab Kubernetes.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content

All content lives in `src/content/posts/` as markdown files with a `category` field.

| Category | URL | Description |
|----------|-----|-------------|
| `study` | `/studies` | Academic coursework |
| `project` | `/projects` | Software projects |
| `research` | `/research` | Research & papers |
| `tool` | `/tools` | Hardware, IoT, dev tools |
| `setup` | `/setup` | Workspace & infrastructure |

### Adding content

Create a `.md` file in `src/content/posts/`:

```yaml
---
title: "My Article"
description: "Short description"
date: 2024-01-15
category: "project"
tags: ["go", "api"]
repo: "https://github.com/arisros/my-project"
image: "/images/cover.png"
---

Your markdown content here.
```

### Auto-importing from sibling repos

```bash
npm run sync
```

Scans sibling directories in `../`, imports `README.md` files as project posts with auto-detected git remote URLs. Won't overwrite existing custom articles.

## Deployment

### Architecture

```
Push to master
  → GitHub Actions (.github/workflows/deploy.yaml)
    → Build Astro static site
    → Docker image (Caddy + static files)
    → Push to ghcr.io/arisros/arisjirat-site:<sha>
    → Update K8s manifest image tag
    → K8s rolls out new pod on homelab
    → VPS Caddy routes arisjirat.com → K8s service
```

### Infrastructure

| Component | Technology | Location |
|-----------|-----------|----------|
| Static site | Astro SSG → `dist/` | Built in CI |
| Container | Caddy 2 Alpine serving static files | K8s pod |
| Orchestration | Kubernetes (k3d) | Homelab |
| Reverse proxy | Caddy | VPS |
| VPN tunnel | WireGuard | VPS ↔ Homelab |
| DNS/CDN | Cloudflare | Edge |
| CI/CD | GitHub Actions → GHCR | GitHub |

### Files

- `Dockerfile` — Multi-stage build: Node.js (build) → Caddy (serve)
- `Caddyfile` — In-container static file server config (gzip, security headers, caching)
- `k8s/deployment.yaml` — Kubernetes Deployment + Service
- `.github/workflows/deploy.yaml` — CI/CD pipeline (build → push → deploy)

### Manual deployment

```bash
# Build image locally
docker build -t arisjirat-site .

# Run locally
docker run -p 8080:80 arisjirat-site

# Apply to K8s
kubectl apply -f k8s/deployment.yaml
```
