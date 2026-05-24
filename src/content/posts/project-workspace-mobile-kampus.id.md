---
title: "Workspacebook Mobile Flutter"
description: "Buat file `.env` di root proyek Anda dan tambahkan variabel-variabel berikut:"
category: "study"
lang: "id"
translationKey: "project-workspace-mobile-kampus"
repo: "https://gitlab.com/kuliah-mobile1/workspace-mobile-kampus"
status: "completed"
draft: false
tags: ["flutter", "mobile", "dart"]
---

## Ikhtisar


![Arsitektur Workspacebook Mobile: Flutter klien dengan Supabase backend](/images/inline/project-workspace-mobile-kampus-1.svg)

Workspacebook Mobile Flutter adalah klien mobile yang dibangun dengan Flutter dan didukung oleh Supabase untuk autentikasi serta layanan backend. Sebelum menjalankan aplikasi, konfigurasikan terlebih dahulu environment variable yang diperlukan.

## 🔐 Konfigurasi Environment Variable


![Alur konfigurasi environment variable dari file .env ke aplikasi Flutter](/images/inline/project-workspace-mobile-kampus-2.svg)

Buat file `.env` di root proyek, lalu tambahkan variabel berikut:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_REDIRECT_URL=

```

### Referensi Variabel

| Variabel | Kegunaan | Di mana menemukannya |
| --- | --- | --- |
| `SUPABASE_URL` | URL dasar proyek Supabase Anda. | `Project Settings → API → Project URL` |
| `SUPABASE_ANON_KEY` | API key anonim publik untuk mengakses Supabase dari frontend. | `Project Settings → API → anon public` |
| `SUPABASE_REDIRECT_URL` | URL pengalihan setelah login atau OAuth sign-in (misalnya Google Sign-In). | `Authentication → URL Configuration → Site URL` |

### Catatan Pengembangan Lokal

> 💡 Untuk pengembangan lokal, arahkan `SUPABASE_REDIRECT_URL` ke skema aplikasi lokal Anda atau callback `http://localhost` agar alur OAuth kembali ke aplikasi yang sedang berjalan.
