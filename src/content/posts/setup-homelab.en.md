---
title: "Homelab Infrastructure"
description: "Kubernetes homelab with Grafana, Prometheus, Vault, WireGuard VPN, and Caddy reverse proxy"
category: "setup"
tags: ["kubernetes", "k3d", "grafana", "prometheus", "wireguard", "caddy", "vault", "docker"]
featured: true
status: "completed"
lang: "en"
translationKey: "setup-homelab"
---

My homelab runs a full SRE-grade observability stack on Kubernetes (k3d), with public exposure brokered through a VPS over WireGuard.

## Architecture

The request path keeps the homelab off the public internet — Cloudflare terminates TLS at the edge, a VPS handles reverse proxying, and a WireGuard tunnel carries traffic the rest of the way into the cluster:

```
Internet → Cloudflare → VPS (Caddy reverse proxy) → WireGuard tunnel → Homelab K8s
```

## Stack

| Layer | Tool |
| --- | --- |
| Orchestration | Kubernetes via k3d |
| Monitoring | Prometheus + Grafana + Alertmanager |
| Logging | Loki + Grafana Alloy |
| Tracing | Tempo (OpenTelemetry) |
| Secrets | HashiCorp Vault |
| Reverse proxy | Caddy on VPS |
| VPN | WireGuard tunnel |
| DNS / CDN | Cloudflare (mixed proxy mode) |
| CI/CD | GitHub Actions → GHCR → GitOps |

## Monitoring

All services ship telemetry into Grafana, which fronts the three signals:

- **Dashboards**: 35+ panels covering cluster, app, and infrastructure health.
- **Alerting**: routed through Alertmanager to Telegram.
- **SLOs**: burn-rate policies drive paging decisions instead of raw thresholds.
