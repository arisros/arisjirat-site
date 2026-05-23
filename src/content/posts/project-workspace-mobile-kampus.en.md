---
title: "Workspacebook Mobile Flutter"
description: "Create a `.env` file at the root of your project and add the following variables:"
category: "study"
tags: ["flutter", "mobile", "dart"]
status: "completed"
draft: false
repo: "https://gitlab.com/kuliah-mobile1/workspace-mobile-kampus"
lang: "en"
translationKey: "project-workspace-mobile-kampus"
---

## Overview

Workspacebook Mobile Flutter is a mobile client built with Flutter and powered by Supabase for authentication and backend services. Before running the app, configure the required environment variables.

## 🔐 Environment Variables Configuration

Create a `.env` file at the root of your project and add the following variables:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_REDIRECT_URL=

```

### Variable Reference

| Variable | Purpose | Where to find it |
| --- | --- | --- |
| `SUPABASE_URL` | Base URL of your Supabase project. | `Project Settings → API → Project URL` |
| `SUPABASE_ANON_KEY` | Public anonymous API key used to access Supabase from the frontend. | `Project Settings → API → anon public` |
| `SUPABASE_REDIRECT_URL` | Redirect URL used after login or OAuth sign-in (e.g., Google Sign-In). | `Authentication → URL Configuration → Site URL` |

### Details

- **`SUPABASE_URL`** — the base URL of your Supabase project.
  📍 Found in: `Project Settings → API → Project URL`

- **`SUPABASE_ANON_KEY`** — the public anonymous API key used by the frontend to talk to Supabase.
  📍 Found in: `Project Settings → API → anon public`

- **`SUPABASE_REDIRECT_URL`** — the redirect URL used after login or OAuth sign-in (such as Google Sign-In).
  📍 Set in: `Authentication → URL Configuration → Site URL`

> 💡 For local development, point `SUPABASE_REDIRECT_URL` at your local app scheme or `http://localhost` callback so OAuth flows return to the running app.
