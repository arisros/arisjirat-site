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
3. Jalankan secara lokal:

   ```bash
   make run
   ```

## Deployment Docker Agent

Proyek ini dapat berjalan sebagai service Docker yang berumur panjang (`attendance-agent`) yang mengeksekusi scheduled jobs secara internal.

### Deploy

```bash
make docker-deploy
```

Perintah setara:

```bash
docker compose up -d --build
```

### Integrasi WhatsApp Lintas Proyek (Host yang Sama)

Jika `wa-bot-notif` berjalan sebagai proyek Docker terpisah pada mesin yang sama, hubungkan kedua stack melalui jaringan eksternal bersama.

1. Buat jaringan bersama sekali saja:

   ```bash
   docker network create homelab_integration
   ```

2. Atur hal berikut di `.env`:

   ```env
   INTEGRATION_NETWORK=homelab_integration
   WA_ENDPOINT=http://wa-bot-notif-api:5000/send
   ```

   Jika `wa-bot-notif` menggunakan `PORT` non-default (misalnya `5001`), sesuaikan di `WA_ENDPOINT`.

3. Jalankan stack `wa-bot-notif` terlebih dahulu, kemudian stack ini.

> Jangan gunakan `localhost` untuk panggilan antar-container — gunakan DNS service/container pada jaringan bersama.

### Operasional

| Aksi | Perintah |
| --- | --- |
| Tail logs | `make docker-logs` |
| Restart | `make docker-restart` |
| Stop | `make docker-down` |

### Memicu Manual Run di Dalam Container

Aplikasi mendengarkan `SIGUSR1` dan mengeksekusi attendance run langsung saat menerimanya.

```bash
make docker-signal-run
```

Perintah setara:

```bash
docker compose kill -s SIGUSR1 attendance-agent
```

## Catatan Operasional

- Timezone scheduler dikontrol oleh `TIMEZONE`.
- Log aplikasi ditulis ke stdout dan ke file `app.log` yang dirotasi di dalam workdir container (`/app`).
- Simpan secrets hanya di `.env` (sudah diabaikan oleh git).
- Jalankan hanya satu instance agent kecuali Anda menambahkan distributed locking — jika tidak, attendance job duplikat dapat terjadi.

## Pelacakan Quiz dan Assignment

Runner kini melacak metadata assignment/quiz yang lebih kaya dan mengirim notifikasi yang lebih cerdas.

### Fitur

- **Parsing daftar assignment**: tanggal jatuh tempo, status submission, nilai.
- **Parsing daftar quiz**: tanggal penutupan, nilai.
- **Pipeline fetch halaman detail** untuk assignment dan quiz (dibatasi per run).
- **Pengingat deadline** pada jendela 24 jam dan 12 jam untuk item yang belum selesai.
- **Pipeline saran AI opsional** via OpenRouter untuk tugas yang masih tertunda.

### Environment Variable Terkait

| Variable | Default | Catatan |
| --- | --- | --- |
| `DETAIL_FETCH_ENABLED` | `true` | Mengaktifkan/menonaktifkan fetch halaman detail. |
| `DETAIL_FETCH_LIMIT` | `10` | Batas maksimum fetch detail per run. |
| `OPENROUTER_ENDPOINT` | `https://openrouter.ai/api/v1/chat/completions` | URL chat completions OpenRouter. |
| `OPENROUTER_API_KEY` | — | Wajib saat `SUGGESTION_ENABLED=true`. |
| `OPENROUTER_MODEL` | `anthropic/claude-sonnet-4-20250514` | Model yang digunakan untuk saran. |
| `SUGGESTION_ENABLED` | `false` | Mengaktifkan saran AI. |
| `SUGGESTION_LIMIT` | `5` | Maksimum saran yang dihasilkan per run. |

## Mode Periode

Proyek ini mendukung filter periode dinamis, sehingga update konfigurasi manual bulanan menjadi opsional.

### Mode

- **`PERIODE_MODE=auto`** (direkomendasikan): menerima bulan berjalan dan bulan berikutnya (`MMYY`) secara otomatis.
  - Contoh pada Februari 2026: `0226` dan `0326` diterima.
- **`PERIODE_MODE=manual`**: hanya menerima nilai yang tercantum di `ALLOWED_PERIODES` (dipisahkan koma).
- **`PERIODE_MODE=legacy`**: mempertahankan perilaku kesetaraan `CURRENT_PERIODE` yang ketat.

### Pengaturan Keamanan

- `MAX_COURSES_PER_RUN`: batas keras untuk mencegah over-selection yang tidak disengaja.
  - `0` menonaktifkan batas tersebut (default).
