---
title: "Infrastruktur Homelab"
description: "Homelab Kubernetes dengan Grafana, Prometheus, Vault, WireGuard VPN, dan reverse proxy Caddy"
category: "setup"
lang: "id"
translationKey: "setup-homelab"
status: "completed"
featured: true
tags: ["kubernetes", "k3d", "grafana", "prometheus", "wireguard", "caddy", "vault", "docker"]
---

Homelab saya menjalankan stack observability tingkat SRE secara lengkap di atas Kubernetes (k3d), dengan paparan publik yang diperantarai melalui VPS via WireGuard.

## Arsitektur


![Diagram jalur request dari client melalui Cloudflare, VPS, WireGuard ke cluster k3d](/images/inline/setup-homelab-1.svg)

Jalur request dirancang agar homelab tetap terisolasi dari internet publik. Cloudflare melakukan terminasi TLS di edge, sebuah VPS menangani reverse proxy, dan tunnel WireGuard membawa trafik sisa perjalanan masuk ke dalam cluster:

```
Internet → Cloudflare → VPS (Caddy reverse proxy) → WireGuard tunnel → Homelab K8s
```

## Stack

| Lapisan | Tool |
| --- | --- |
| Orkestrasi | Kubernetes via k3d |
| Monitoring | Prometheus + Grafana + Alertmanager |
| Logging | Loki + Grafana Alloy |
| Tracing | Tempo (OpenTelemetry) |
| Secrets | HashiCorp Vault |
| Reverse proxy | Caddy di VPS |
| VPN | WireGuard tunnel |
| DNS / CDN | Cloudflare (mode proxy campuran) |
| CI/CD | GitHub Actions → GHCR → GitOps |

## Monitoring


![Diagram aliran tiga sinyal observability (metrics, logs, traces) menuju Grafana dan Alertmanager](/images/inline/setup-homelab-2.svg)

Seluruh service mengirim telemetri ke Grafana, yang menjadi muka tunggal untuk ketiga sinyal observability:

- **Dashboard** — 35+ panel yang mencakup kondisi cluster, aplikasi, dan infrastruktur.
- **Alerting** — dirutekan melalui Alertmanager ke Telegram.
- **SLO** — kebijakan burn-rate yang menentukan keputusan paging, bukan threshold mentah.
