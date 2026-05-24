---
title: "📐 Aplikasi Android Mobile Programming (CLI-friendly)"
description: "Aplikasi Android sederhana yang dibuat untuk tujuan edukasi. Menghitung luas dan keliling bangun datar dasar seperti persegi, persegi panjang, dan segitiga."
category: "study"
lang: "id"
translationKey: "project-tugas_mp"
repo: "https://github.com/emandor/tugas_mp"
status: "completed"
draft: false
tags: ["android", "mobile", "kotlin"]
---

Aplikasi Android sederhana yang dibuat untuk tujuan edukasi. Aplikasi ini menghitung luas dan keliling bangun datar dasar — persegi, persegi panjang, dan segitiga.

> Proyek ini dirancang untuk **dibangun, dijalankan, dan didokumentasikan sepenuhnya dari command line** — tanpa perlu Android Studio.

## Fitur

- ✍️ UI sederhana yang didefinisikan dalam layout XML
- ⚙️ Workflow CLI untuk build, install, run, dan capture screenshot lewat script
- 📸 Auto-screenshot source code menggunakan [`carbon-now-cli`](https://www.npmjs.com/package/carbon-now-cli)

## Struktur Proyek

Hanya folder yang relevan dalam keseharian yang ditampilkan di bawah ini.

```
app/
├── src/
│ └── main/
│ ├── java/ # Source code (.kt / .java)
│ ├── res/ # Layouts, Drawables, etc.
│ └── AndroidManifest.xml
├── build.gradle # App-level Gradle file
gradle/
├── wrapper/ # Gradle wrapper
gradlew, gradlew\.bat # Wrapper scripts
build.gradle # Root-level Gradle
settings.gradle
```

## Workflow CLI


![Diagram alur workflow CLI: build, install, run, uninstall APK](/images/inline/project-tugas_mp-1.svg)

### Build APK

```bash
./gradlew assembleDebug
```

### Install ke emulator atau device

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Jalankan aplikasi

```bash
adb shell monkey -p com.ubl.tugas_mp -c android.intent.category.LAUNCHER 1
```

### Uninstall aplikasi

```bash
adb uninstall com.ubl.tugas_mp
```

## Mengambil Screenshot Kode


![Diagram pipeline screenshot kode: source files ke PNG via carbon-now-cli](/images/inline/project-tugas_mp-2.svg)

### 1. Install tool CLI

```bash
npm install -g carbon-now-cli
```

### 2. Jalankan helper script

```bash
./generate_screenshots.sh
```

Script tersebut akan:

- Menyalin semua file `.java`, `.kt`, dan `.xml` ke dalam `screenshots/`
- Menghasilkan screenshot PNG dengan syntax highlighting dari source `.kt` dan `.java`

### Struktur output

Setelah script selesai dijalankan, kamu akan menemukan:

```
screenshots/
├── com/ubl/tugas_mp/MainActivity.kt
├── com/ubl/tugas_mp/MainActivity.png
└── res/layout/activity_main.xml
```

## Penulis

| Field | Value |
| --- | --- |
| Nama | **Aris Kurniawan** |
| NIM | 2311510438 |
| Universitas | Universitas Budi Luhur |
| Mata Kuliah | Mobile Programming |

## Langkah Selanjutnya

Beberapa kemungkinan pengembangan untuk proyek ini:

- Menambahkan **custom CLI commands** seperti `make run` atau `make screenshot`
- Membungkus workflow ke dalam `Makefile` atau shell alias helper
- Menghasilkan arsip `.zip` atau `.tar.gz` yang siap dikumpulkan
