---
title: "beepresent"
description: "\"README untuk ## Build present project"
category: "project"
lang: "id"
translationKey: "project-beepresent"
image: "/images/banners/project-beepresent.png"
repo: "https://github.com/arisros/beepresent"
status: "completed"
draft: false
tags: ["auto-imported"]
tech: ["mobile"]
---

## Ringkasan

Proyek ini adalah CLI dan API untuk berinteraksi dengan data mata kuliah — menampilkan daftar mata kuliah, mengambil detail, mengambil tugas dan kuis, serta mengirimkan catatan kehadiran ("present").

## API

| Endpoint | Deskripsi |
| --- | --- |
| `GET /courses` | Menampilkan semua mata kuliah |
| `GET /courses/{id}` | Mengambil detail mata kuliah |
| `GET /courses/{course_id}/assignments` | Menampilkan daftar tugas untuk sebuah mata kuliah |
| `GET /courses/{course_id}/quizzes` | Menampilkan daftar kuis untuk sebuah mata kuliah |
| `POST /courses/{course_id}/present/{present_id}` | Mengirim kehadiran |

## CLI

CLI mencerminkan permukaan API:

- `bl courses` — menampilkan daftar mata kuliah
- `bl courses {id}` — menampilkan detail mata kuliah
- `bl present` — mengirim kehadiran

## Penjadwalan

Pengiriman kehadiran sebaiknya berjalan pada jadwal tetap:

- **Senin – Jumat:** 19.00 – 20.00
- **Sabtu:** 09.00, 11.00, 14.00, 16.00

> Pertanyaan terbuka: apakah scheduler sebaiknya berada di dalam proyek ini, atau menjadi concern terpisah?

## Caching & Invalidasi

Data mata kuliah jarang berubah, jadi caching yang agresif tidak masalah.

- Entri cache kedaluwarsa setelah **satu minggu**
- Lakukan crawl ulang hanya ketika data cache sudah kedaluwarsa
- Hindari invalidasi pada setiap akses — itu bukan prioritas

## Implementasi

### Tech Stack

- TypeScript
- Bun.js runtime
- Cheerio (HTML parsing)

### Struktur Proyek

```
src/
├── services/
│   ├── getCourses
│   ├── getCourseDetail
│   ├── getPresentationList
│   └── postPresent
├── repository/
│   ├── courses
│   ├── assignments
│   └── quiz
├── utils/
│   └── log
└── config/
    └── creds
```
