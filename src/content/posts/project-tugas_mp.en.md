---
title: "📐 Mobile Programming Android App (CLI-friendly)"
description: "A simple Android app built for educational purposes. Calculates the area and perimeter of basic 2D shapes like squares, rectangles, and triangles."
category: "study"
lang: "en"
translationKey: "project-tugas_mp"
repo: "https://github.com/emandor/tugas_mp"
status: "completed"
draft: false
tags: ["android", "mobile", "kotlin"]
---

A simple Android app built for educational purposes. It calculates the area and perimeter of basic 2D shapes — squares, rectangles, and triangles.

> This project is designed to be **built, run, and documented entirely from the command line** — no Android Studio required.

## Features

- ✍️ Simple UI defined in XML layouts
- ⚙️ CLI workflow for build, install, run, and screenshot capture via scripts
- 📸 Auto-screenshot source code using [`carbon-now-cli`](https://www.npmjs.com/package/carbon-now-cli)

## Project Structure

Only the folders relevant to day-to-day work are shown below.

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

## CLI Workflow


![Diagram alur workflow CLI: build, install, run, uninstall APK](/images/inline/project-tugas_mp-1.svg)

### Build APK

```bash
./gradlew assembleDebug
```

### Install to emulator or device

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Run the app

```bash
adb shell monkey -p com.ubl.tugas_mp -c android.intent.category.LAUNCHER 1
```

### Uninstall the app

```bash
adb uninstall com.ubl.tugas_mp
```

## Capturing Code Screenshots


![Diagram pipeline screenshot kode: source files ke PNG via carbon-now-cli](/images/inline/project-tugas_mp-2.svg)

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

### Output structure

Once the script finishes, you'll find:

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

A few possible directions for this project:

- Add **custom CLI commands** like `make run` or `make screenshot`
- Wrap the workflow into a `Makefile` or shell alias helpers
- Generate a `.zip` or `.tar.gz` archive ready for submission
