---
title: "gostudentubl"
description: "Runner absensi otomatis untuk mata kuliah berbasis Moodle dengan eksekusi terjadwal."
category: "project"
lang: "id"
translationKey: "project-gostudentubl"
image: "/images/banners/project-gostudentubl.png"
repo: "https://github.com/emandor/gostudentubl"
status: "completed"
featured: true
draft: false
tags: ["auto-imported"]
tech: ["go"]
---

## Ikhtisar

Runner absensi otomatis untuk mata kuliah berbasis Moodle dengan eksekusi terjadwal.

## Menjalankan Secara Lokal

1. Salin template environment:

   ```bash
   cp .env.example .env
   ```

2. Isi nilai-nilai yang diperlukan di `.env`.
3. Jalankan:

   ```bash
   make run
   ```

## Deployment Docker

Proyek ini berjalan sebagai service Docker berumur panjang (`attendance-agent`) yang mengeksekusi scheduled jobs secara internal.

### Deploy

```bash
make docker-deploy
```

Perintah setara:

```bash
docker compose up -d --build
```

### Operasional

| Aksi | Perintah |
| --- | --- |
| Tail logs | `make docker-logs` |
| Restart | `make docker-restart` |
| Stop | `make docker-down` |

### Memicu Manual Run di Dalam Container

Aplikasi mendengarkan `SIGUSR1` dan langsung mengeksekusi attendance run saat menerimanya.

```bash
make docker-signal-run
```

Perintah setara:

```bash
docker compose kill -s SIGUSR1 attendance-agent
```

## Integrasi WhatsApp Lintas Proyek


![Diagram jaringan Docker bersama menghubungkan stack gostudentubl dan WhatsApp](/images/inline/project-gostudentubl-1.svg)

Jika `wa-bot-notif` berjalan sebagai proyek Docker terpisah pada host yang sama, hubungkan kedua stack melalui jaringan eksternal bersama.

1. Buat jaringan bersama (satu kali saja):

   ```bash
   docker network create homelab_integration
   ```

2. Atur konfigurasi berikut di `.env`:

   ```env
   INTEGRATION_NETWORK=homelab_integration
   WA_ENDPOINT=http://wa-bot-notif-api:5000/send
   ```

   Sesuaikan `WA_ENDPOINT` jika `wa-bot-notif` menggunakan `PORT` non-default (misalnya `5001`).

3. Jalankan stack `wa-bot-notif` terlebih dahulu, kemudian stack ini.

> Jangan gunakan `localhost` untuk panggilan antar-container — selalu gunakan DNS service/container pada jaringan bersama.

## Catatan Operasional

- Timezone scheduler dikontrol oleh `TIMEZONE`.
- Log aplikasi ditulis ke stdout dan ke file `app.log` yang dirotasi di dalam workdir container (`/app`).
- Simpan secrets hanya di `.env` (sudah diabaikan oleh git).
- Jalankan hanya satu instance agent kecuali Anda menambahkan distributed locking — jika tidak, attendance job duplikat dapat terjadi.

## Pelacakan Quiz dan Assignment


![Pipeline pelacakan quiz dan assignment dari Moodle ke notifikasi WhatsApp](/images/inline/project-gostudentubl-2.svg)

Runner melacak metadata assignment/quiz yang lebih kaya dan mengirim notifikasi yang lebih cerdas.

### Fitur

- **Parsing daftar assignment**: tanggal jatuh tempo, status submission, dan nilai.
- **Parsing daftar quiz**: tanggal penutupan dan nilai.
- **Pipeline fetch halaman detail** untuk assignment dan quiz, dengan batas per run.
- **Pengingat deadline** pada jendela 24 jam dan 12 jam untuk item yang belum selesai.
- **Pipeline saran AI opsional** via OpenRouter untuk tugas yang masih tertunda.

### Environment Variable Terkait

| Variable | Default | Catatan |
| --- | --- | --- |
| `DETAIL_FETCH_ENABLED` | `true` | Mengaktifkan atau menonaktifkan fetch halaman detail. |
| `DETAIL_FETCH_LIMIT` | `10` | Batas maksimum fetch detail per run. |
| `OPENROUTER_ENDPOINT` | `https://openrouter.ai/api/v1/chat/completions` | URL chat completions OpenRouter. |
| `OPENROUTER_API_KEY` | — | Wajib saat `SUGGESTION_ENABLED=true`. |
| `OPENROUTER_MODEL` | `anthropic/claude-sonnet-4-20250514` | Model yang digunakan untuk saran. |
| `SUGGESTION_ENABLED` | `false` | Mengaktifkan saran AI. |
| `SUGGESTION_LIMIT` | `5` | Jumlah maksimum saran per run. |

## Mode Periode

Proyek ini mendukung filter periode dinamis, sehingga update konfigurasi manual bulanan menjadi opsional.

### Mode yang Tersedia

- **`PERIODE_MODE=auto`** (direkomendasikan): menerima bulan berjalan dan bulan berikutnya (`MMYY`) secara otomatis.
  - Contoh pada Februari 2026: `0226` dan `0326` diterima.
- **`PERIODE_MODE=manual`**: hanya menerima nilai yang tercantum di `ALLOWED_PERIODES` (dipisahkan koma).
- **`PERIODE_MODE=legacy`**: mempertahankan perilaku kesetaraan `CURRENT_PERIODE` yang ketat.

### Pengaturan Keamanan

- `MAX_COURSES_PER_RUN`: batas keras untuk mencegah over-selection yang tidak disengaja.
  - Setel ke `0` untuk menonaktifkan batas (default).
