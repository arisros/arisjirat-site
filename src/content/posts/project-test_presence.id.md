---
title: "test_presence"
description: "Aplikasi manajemen presensi dengan:"
category: "project"
lang: "id"
translationKey: "project-test_presence"
status: "completed"
draft: false
tags: ["auto-imported"]
tech: ["flutter", "dart"]
---

## Ringkasan

Aplikasi manajemen presensi untuk melacak kehadiran karyawan dengan check-in berbasis GPS dan alur permintaan cuti.

- **Backend**: Go dengan database SQLite
- **Frontend**: React dengan alur check-in GPS

## Fitur

- Validasi kehadiran berdasarkan geolokasi kantor dan radius yang dapat dikonfigurasi
- Pengajuan permintaan cuti untuk karyawan
- Dashboard admin untuk laporan serta persetujuan atau penolakan permintaan cuti
- Autentikasi berbasis peran untuk karyawan dan admin
- Pratinjau peta yang menampilkan titik pusat kantor, radius yang diizinkan, dan posisi GPS karyawan saat ini

## Struktur Proyek


![Struktur proyek test_presence: backend Go/SQLite dan frontend React/Vite](/images/inline/project-test_presence-1.svg)

| Direktori | Deskripsi |
|-----------|-------------|
| `BE/` | REST API (Go + SQLite) |
| `FE/` | Aplikasi web (React + Vite) |

## Menjalankan Backend

```bash
cd BE
go mod tidy
go run .
```

Backend berjalan di `http://localhost:8080`.

### Pengguna Default

| Username | Password | Peran |
|----------|-------------|----------|
| `andi` | `password123` | Karyawan |
| `budi` | `password123` | Karyawan |
| `citra` | `password123` | Admin |

## Menjalankan Frontend

```bash
cd FE
npm install
npm run dev
```

Frontend tersedia di `http://localhost:5173`.

> Secara default, FE menggunakan `/api` melalui proxy Vite. Untuk mengganti endpoint API, atur:

```bash
VITE_API_BASE=http://localhost:8080/api
```

## Endpoint API


![Alur check-in GPS: validasi lokasi karyawan terhadap radius kantor](/images/inline/project-test_presence-2.svg)

### Publik

- `POST /api/login`

### Terautentikasi

- `GET /api/config`
- `POST /api/presence`
- `POST /api/holiday-requests`
- `GET /api/holiday-requests` — karyawan hanya melihat permintaan miliknya sendiri

### Khusus Admin

- `GET /api/employees`
- `PATCH /api/holiday-requests/{id}`
- `GET /api/admin/report`

## Setup Docker

Jalankan seluruh stack dengan satu perintah:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

### Catatan

- FE versi Docker memproksi `/api` ke container backend secara internal, sehingga menghindari masalah CORS di browser.
- Server dev Vite lokal juga memproksi `/api` ke `http://localhost:8080`.
