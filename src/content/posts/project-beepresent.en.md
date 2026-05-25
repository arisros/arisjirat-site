---
title: "beepresent"
description: "\"README for ## Build present project"
category: "project"
lang: "en"
translationKey: "project-beepresent"
image: "/images/banners/project-beepresent.png"
repo: "https://github.com/arisros/beepresent"
status: "completed"
draft: false
tags: ["auto-imported"]
tech: ["mobile"]
---

## Overview

This project is a CLI and API for interacting with course data — listing courses, fetching details, retrieving assignments and quizzes, and submitting attendance records ("present").

## API

| Endpoint | Description |
| --- | --- |
| `GET /courses` | List all courses |
| `GET /courses/{id}` | Fetch course details |
| `GET /courses/{course_id}/assignments` | List assignments for a course |
| `GET /courses/{course_id}/quizzes` | List quizzes for a course |
| `POST /courses/{course_id}/present/{present_id}` | Submit attendance |

## CLI


![Pemetaan endpoint API ke perintah CLI beepresent](/images/inline/project-beepresent-1.svg)

The CLI mirrors the API surface:

- `bl courses` — list courses
- `bl courses {id}` — show course details
- `bl present` — submit attendance

## Scheduling

Attendance submissions should run on a fixed schedule:

- **Monday – Friday:** 7:00 PM – 8:00 PM
- **Saturday:** 9:00 AM, 11:00 AM, 2:00 PM, 4:00 PM

> Open question: should the scheduler live inside this project, or be a separate *concern*?

## Caching & Invalidation


![Alur caching dan invalidasi data mata kuliah dengan TTL satu minggu](/images/inline/project-beepresent-2.svg)

Course data rarely changes, so aggressive caching isn't a problem.

- Cache entries expire after **one week**
- Re-crawling only happens when cached data has expired
- Invalidation on every access is avoided — it's not a priority

## Implementation

### Tech Stack

- TypeScript
- Bun.js runtime
- Cheerio for HTML *parsing*

### Project Structure

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
