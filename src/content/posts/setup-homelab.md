---
title: "Homelab Infrastructure"
description: "Kubernetes homelab with Grafana, Prometheus, Vault, WireGuard VPN, and Caddy reverse proxy"
category: "setup"
tags: ["kubernetes", "k3d", "grafana", "prometheus", "wireguard", "caddy", "vault", "docker"]
featured: true
status: "completed"
---

My homelab runs a full SRE-grade observability stack on Kubernetes (k3d).

## Architecture

Internet → Cloudflare → VPS (Caddy reverse proxy) → WireGuard tunnel → Homelab K8s

## Stack

- **Orchestration**: Kubernetes via k3d
- **Monitoring**: Prometheus + Grafana + Alertmanager
- **Logging**: Loki + Grafana Alloy
- **Tracing**: Tempo (OpenTelemetry)
- **Secrets**: HashiCorp Vault
- **Reverse Proxy**: Caddy on VPS
- **VPN**: WireGuard tunnel
- **DNS/CDN**: Cloudflare (mixed proxy mode)
- **CI/CD**: GitHub Actions → GHCR → GitOps

## Monitoring

All services report to Grafana with 35+ dashboards, alerting via Telegram, and SLO-based burn-rate policies.
