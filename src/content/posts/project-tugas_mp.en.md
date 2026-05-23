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

A simple Android app built for educational purposes. It calculates the area and perimeter of basic shapes — square, rectangle, and triangle.

> This project is designed to be **built, run, and documented entirely from the command line** — no Android Studio required.

## Features

- ✍️ Simple UI defined in XML layouts
- ⚙️ CLI workflow: build, install, run, and capture screenshots via scripts
- 📸 Auto-screenshot source code with [`carbon-now-cli`](https://www.npmjs.com/package/carbon-now-cli)

## Project Structure

Only the folders that matter day-to-day are shown below.

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

## CLI Usage Guide

### Build the APK

```bash
./gradlew assembleDebug
```

### Install on an Emulator or Device

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Launch the App

```bash
adb shell monkey -p com.ubl.tugas_mp -c android.intent.category.LAUNCHER 1
```

### Uninstall the App

```bash
adb uninstall com.ubl.tugas_mp
```

## Capturing Code Screenshots

### 1. Install the CLI tool

```bash
npm install -g carbon-now-cli
```

### 2. Run the helper script

```bash
./generate_screenshots.sh
```

The script will:

- Copy all `.java`, `.kt`, and `.xml` files into `screenshots/`
- Generate syntax-highlighted PNG screenshots from the `.kt` and `.java` sources

### Output Layout

After the script finishes, you'll find:

```
screenshots/
├── com/ubl/tugas_mp/MainActivity.kt
├── com/ubl/tugas_mp/MainActivity.png
└── res/layout/activity_main.xml
```

## Author

| Field | Value |
| --- | --- |
| Name | **Aris Kurniawan** |
| Student ID | 2311510438 |
| University | Universitas Budi Luhur |
| Course | Mobile Programming |

## Next Steps

Possible extensions for this project:

- Add **custom CLI commands** (e.g. `make run`, `make screenshot`)
- Wrap the workflow in a `Makefile` or shell alias helper
- Generate a `.zip` or `.tar.gz` archive ready for submission
