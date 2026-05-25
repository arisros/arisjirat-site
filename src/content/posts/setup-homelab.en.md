---
title: "Homelab Infrastructure"
description: "Kubernetes homelab with Grafana, Prometheus, Vault, WireGuard VPN, and Caddy reverse proxy"
category: "setup"
lang: "en"
translationKey: "setup-homelab"
status: "completed"
featured: true
tags: ["kubernetes", "k3d", "grafana", "prometheus", "wireguard", "caddy", "vault", "docker"]
---

My homelab runs a full SRE-grade observability stack on top of Kubernetes (k3d), with public exposure brokered through a VPS via WireGuard.

## Architecture


![Diagram jalur request dari client melalui Cloudflare, VPS, WireGuard ke cluster k3d](/images/inline/setup-homelab-1.svg)

The request path is designed to keep the homelab isolated from the public internet. Cloudflare terminates TLS at the edge, a VPS handles the reverse proxy, and a WireGuard tunnel carries traffic the rest of the way into the cluster:

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
| Reverse proxy | Caddy on a VPS |
| VPN | WireGuard tunnel |
| DNS / CDN | Cloudflare (mixed proxy mode) |
| CI/CD | GitHub Actions → GHCR → GitOps |

## Monitoring


![Diagram aliran tiga sinyal observability (metrics, logs, traces) menuju Grafana dan Alertmanager](/images/inline/setup-homelab-2.svg)

Every service ships telemetry to Grafana, which acts as the single pane of glass across all three observability signals:

- **Dashboards** — 35+ panels covering cluster, application, and infrastructure health.
- **Alerting** — routed through Alertmanager to Telegram.
- **SLOs** — burn-rate policies drive paging decisions rather than raw thresholds.
