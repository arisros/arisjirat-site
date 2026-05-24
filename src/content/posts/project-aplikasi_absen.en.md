---
title: "Attendance App"
description: "This app was built by the Mobile Programming group using Flutter."
category: "project"
lang: "en"
translationKey: "project-aplikasi_absen"
image: "/images/banners/project-aplikasi_absen.png"
repo: "https://github.com/ngulekkode/aplikasi_absen"
status: "completed"
draft: false
tags: ["attendance", "mobile"]
---

## About the App

**Attendance App** is an employee and manager attendance application developed by the Mobile Programming course group using **Flutter**.

## Group Members

- Agus
- Rilo
- Wildan
- Okra

## Key Features


![Diagram peran Karyawan dan Manager beserta fitur masing-masing](/images/inline/project-aplikasi_absen-1.svg)

The app provides a simple attendance flow for two user roles.

| Role | Features |
| --- | --- |
| Employee | Login with Employee ID & password, Clock In, Clock Out |
| Manager | Dashboard for viewing employee attendance summaries |

### Employee Flow

- Log in using **Employee ID** and **password**.
- **Clock In** when starting the work shift.
- **Clock Out** when ending the work shift.

### Manager Flow


![Diagram alur kerja Karyawan dan Manager dalam aplikasi absen](/images/inline/project-aplikasi_absen-2.svg)

- Log in with a manager account.
- Access the **Dashboard** to view attendance summaries for all employees.

## Getting Started

This project is a starting point for a Flutter application. Follow the steps below to run it locally.

### Prerequisites

- **Flutter SDK** installed on the developer machine.
- An emulator or physical device connected and detected.

### Steps to Run

1. Clone this repository.
2. Navigate to the project directory, then run the following commands:

   ```bash
   flutter pub get
   flutter run
   ```

> **Note:** Make sure the Flutter SDK is installed and a device (emulator or physical device) is connected before running `flutter run`.
