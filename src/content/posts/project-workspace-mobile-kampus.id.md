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

Workspacebook Mobile Flutter adalah klien mobile yang dibangun dengan Flutter dan didukung oleh Supabase untuk layanan autentikasi dan backend. Sebelum menjalankan aplikasi, konfigurasikan terlebih dahulu environment variable yang diperlukan.

## 🔐 Konfigurasi Environment Variable

Buat file `.env` di root proyek Anda dan tambahkan variabel-variabel berikut:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_REDIRECT_URL=

```

### Referensi Variabel

| Variabel | Kegunaan | Di mana menemukannya |
| --- | --- | --- |
| `SUPABASE_URL` | URL dasar dari proyek Supabase Anda. | `Project Settings → API → Project URL` |
| `SUPABASE_ANON_KEY` | API key anonim publik yang digunakan untuk mengakses Supabase dari frontend. | `Project Settings → API → anon public` |
| `SUPABASE_REDIRECT_URL` | URL pengalihan yang digunakan setelah login atau OAuth sign-in (misalnya, Google Sign-In). | `Authentication → URL Configuration → Site URL` |

### Detail

- **`SUPABASE_URL`** — URL dasar dari proyek Supabase Anda.
  📍 Ditemukan di: `Project Settings → API → Project URL`

- **`SUPABASE_ANON_KEY`** — API key anonim publik yang digunakan frontend untuk berkomunikasi dengan Supabase.
  📍 Ditemukan di: `Project Settings → API → anon public`

- **`SUPABASE_REDIRECT_URL`** — URL pengalihan yang digunakan setelah login atau OAuth sign-in (seperti Google Sign-In).
  📍 Diatur di: `Authentication → URL Configuration → Site URL`

> 💡 Untuk pengembangan lokal, arahkan `SUPABASE_REDIRECT_URL` ke skema aplikasi lokal Anda atau callback `http://localhost` agar alur OAuth kembali ke aplikasi yang sedang berjalan.
