# Development

## Prerequisites

- Node.js 22 or newer
- pnpm 11.9.0
- Android Studio and an Android device or emulator
- An Expo account for device development

## Setup

```powershell
pnpm install
pnpm run setup:local
pnpm run start
```

`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` stay empty until
the Day 3 data-layer task. Do not add server-only secrets to `.env`.

## Commands

```powershell
pnpm run setup:local
pnpm run start
pnpm run android
pnpm run android:staging
pnpm run android:production
pnpm run web
pnpm run config:development
pnpm run config:staging
pnpm run config:production
pnpm run format
pnpm run lint:fix
pnpm run verify
pnpm run doctor
```

## Environments

Use `development` for local experiments, `staging` for near-production testing,
and `production` for the real app. Environment-specific scripts load `.env` and
then `.env.<environment>` if present. The script-selected environment wins over
file contents.

Expo app identity is environment-specific:

| Environment   | Name            | Scheme         | Native id              |
| ------------- | --------------- | -------------- | ---------------------- |
| `development` | `Tria. Dev`     | `tria-dev`     | `com.tria.app.dev`     |
| `staging`     | `Tria. Staging` | `tria-staging` | `com.tria.app.staging` |
| `production`  | `Tria.`         | `tria`         | `com.tria.app`         |

Run `pnpm run config:<environment>` before creating a build to verify the
resolved Expo config.

## Error Monitoring

Sentry is wired through the composition layer. Development stays quiet even when
a DSN is present. Staging and production send events only when
`EXPO_PUBLIC_ENABLE_ERROR_MONITORING=true` and `EXPO_PUBLIC_SENTRY_DSN` is set.

Source-map upload requires `SENTRY_ORG`, `SENTRY_PROJECT`, and
`SENTRY_AUTH_TOKEN` in the build environment. These are build secrets and must
not be committed.

Use `pnpm run bootstrap` for a non-interactive local readiness check. It installs
from the lockfile, creates `.env` when missing, and runs CI-level checks. It does
not start the Expo server.

## Commit discipline

Each commit should be independently reviewable and keep `pnpm run verify`
passing. Database changes are migration files only. Do not edit a production
database manually.

`pnpm install` configures `.githooks/pre-commit` to run `pnpm run precommit`
before each commit. It does not start Expo. It blocks commits when formatting,
TypeScript, ESLint, architecture rules, environment validation, or tests fail.
Run `pnpm run format`, `pnpm run lint:fix`, and then `pnpm run verify` to repair
common failures.

Use `pnpm run hook:precommit` to manually execute the same cross-platform hook
entrypoint that Git uses.
