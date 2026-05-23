---
title: "📐 Android Mobile Programming App (CLI-friendly)"
description: "A simple Android app built for educational purposes. Calculates area and perimeter of basic shapes such as square, rectangle, and triangle."
category: "study"
tags: ["android", "mobile", "kotlin"]
status: "completed"
draft: false
repo: "https://github.com/emandor/tugas_mp"
lang: "en"
translationKey: "project-tugas_mp"
---

# 📐 Android Mobile Programming App (CLI-friendly)

A simple Android app built for educational purposes. Calculates area and perimeter of basic shapes such as square, rectangle, and triangle.

This project is designed to be **built, run, and documented fully via command line (CLI)** — no Android Studio required.

---

## 🛠 Features

- ✍️ Simple UI in XML layouts
- ⚙️ CLI support: Build, Install, Run, and Capture screenshots using scripts
- 📸 Auto-screenshot source code with `carbon-now-cli`

---

## 🧾 Project Structure (Important Folders Only)

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

---

## 🖥 CLI Usage Guide

### ✅ Build APK

```bash
./gradlew assembleDebug
```

### ✅ Install APK to Emulator / Device

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### ✅ Run the App

```bash
adb shell monkey -p com.ubl.tugas_mp -c android.intent.category.LAUNCHER 1
```

### ✅ Uninstall the App

```bash
adb uninstall com.ubl.tugas_mp
```

---

## 📸 Take Screenshot of Code

### Install CLI tool

```bash
npm install -g carbon-now-cli
```

### Run the helper script

```bash
./generate_screenshots.sh
```

This will:

- Copy all `.java`, `.kt`, `.xml` files to `screenshots/`
- Generate syntax-highlighted PNG screenshots of `.kt`/`.java` files

---

## 📂 Output (after script)

```
screenshots/
├── com/ubl/tugas_mp/MainActivity.kt
├── com/ubl/tugas_mp/MainActivity.png
└── res/layout/activity_main.xml
```

---

## 👤 Author

**Aris Kurniawan**
2311510438 – Universitas Budi Luhur
Course: Mobile Programming

---

Let me know if you want to:

- Add **custom CLI commands** (like `make run`, `make screenshot`)
- Turn it into a Makefile or alias helper
- Generate `.zip` or `.tar.gz` for submission
