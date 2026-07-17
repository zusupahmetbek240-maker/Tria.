# Development

## Prerequisites

- Node.js 22 or newer
- Android Studio and an Android device or emulator
- An Expo account for device development

## Setup

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run start
```

`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` stay empty until
the Day 3 data-layer task. Do not add server-only secrets to `.env`.

## Commands

```powershell
npm.cmd run start
npm.cmd run android
npm.cmd run verify
npm.cmd run doctor
```

## Commit discipline

Each commit should be independently reviewable and keep `npm.cmd run verify`
passing. Database changes are migration files only. Do not edit a production
database manually.
