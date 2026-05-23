---
title: "beepresent"
description: "README for ## Build present project

API

- get list course
- get detail by course {id}
- get assignments {course_id}
- get quizes {course_id}
- post present {course_id} {present_id}

CLI from those

- bl courses - get list course
- bl courses {id} - get detail course
- present

Scheduler presen will be on this project??

- at 7pm to 8pm monday to friday
- saturday on 9am, 11am, 2pm, 4pm

because data will not always changes, I think we can update
perweek

I think this no priority 0
database invalidation for every access, we can invalidate per week

- set expired data a week
- when data expired than need to crawl

## Implemenation

### Tech Stack

- Typescript
- Bun.js Runtime
- Cheerio

### Project Structure

- src
  - services
    - get courses
    - get courses detail
    - get presention list
    - post present
  - repository
    - courses
    - assignments
    - quiz
  - utils
    - log
  - config
    - creds
"
category: "project"
tags: ["auto-imported"]
tech: ["mobile"]
status: "completed"
draft: false
repo: "https://github.com/arisros/beepresent"
image: "/images/banners/project-beepresent.png"
lang: "en"
translationKey: "project-beepresent"
---

## Overview

This project is a CLI and API for interacting with course data — listing courses, fetching details, retrieving assignments and quizzes, and submitting attendance ("present") records.

## API

| Endpoint | Description |
| --- | --- |
| `GET /courses` | List all courses |
| `GET /courses/{id}` | Get course details |
| `GET /courses/{course_id}/assignments` | List assignments for a course |
| `GET /courses/{course_id}/quizzes` | List quizzes for a course |
| `POST /courses/{course_id}/present/{present_id}` | Submit attendance |

## CLI

The CLI mirrors the API surface:

- `bl courses` — list courses
- `bl courses {id}` — show course details
- `bl present` — submit attendance

## Scheduling

Attendance submission should run on a fixed schedule:

- **Monday – Friday:** 7 PM – 8 PM
- **Saturday:** 9 AM, 11 AM, 2 PM, 4 PM

> Open question: should the scheduler live inside this project, or be a separate concern?

## Caching & Invalidation

Course data rarely changes, so aggressive caching is fine.

- Cache entries expire after **one week**
- Re-crawl only when the cached data is expired
- Avoid invalidating on every access — that's not a priority

## Implementation

### Tech Stack

- TypeScript
- Bun.js runtime
- Cheerio (HTML parsing)

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
