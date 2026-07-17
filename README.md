# Tria.

Adaptive training planning for endurance athletes.

Tria. is an Expo TypeScript mobile app foundation for **The AI Triathlon
Copilot**. The MVP targets triathletes and athletes training in selected
discipline combinations across swim, bike, and run. The product direction is an
adaptive training planner that can account for plan changes, readiness, weather,
completed workouts, and equipment context.

This repository is currently a **Day 1 foundation**. Architecture, routing,
environment handling, quality checks, CI, pre-commit checks, and observability
plumbing are in place. Product features are intentionally not implemented yet.

## Quick Start

Use pnpm only. Do not run `npm install`.

```powershell
pnpm install
pnpm run setup:local
pnpm run start
```

`pnpm run start` is long-running because it starts the Expo dev server.

For Android development:

```powershell
pnpm run android
```

`pnpm run android` requires an Android emulator or physical Android device.

## Requirements

- Node.js 22 or newer.
- pnpm 11.9.0.
- Android Studio plus an emulator or Android device for Android testing.
- Expo-compatible local development environment.

The project pins the package manager in `package.json`:

```json
"packageManager": "pnpm@11.9.0"
```

## Project Scope

Current MVP foundation supports:

- Expo SDK 57 with TypeScript.
- Expo Router file-based routing.
- Three environments: development, staging, production.
- Strict TypeScript and ESLint rules.
- Prettier and EditorConfig formatting.
- Dependency Cruiser architecture checks.
- Jest test foundation.
- Sentry integration, disabled by default and quiet in development.
- GitHub Actions CI.
- Git pre-commit checks.

Not implemented yet:

- Real onboarding flow.
- Auth screens and email login.
- Supabase data layer.
- AI gateway/backend calls.
- Weather adapter.
- Training plan domain features.
- Store, marketplace, GPS imports, health imports, or deep backend workflows.

## Folder Structure

```text
app/                         Expo Router route wrappers only
app/(onboarding)/             Onboarding route group skeleton
app/(tabs)/                   Main tab route group skeleton
docs/                         Architecture, decisions, development notes
scripts/                      Local setup, env validation, preflight, hooks
src/config/                   Typed runtime environment reader
src/composition/              App provider wiring and observability setup
src/domain/                   Pure product rules and domain primitives
src/application/              Use cases and ports
src/infrastructure/           External adapters: Supabase, AI, weather, device APIs
src/presentation/             Screens, feature UI, hooks, theme tokens
supabase/                     Future migrations and edge functions
```

`app/` files must stay thin. Routes select presentation screens; they do not own
business logic or external system calls.

## Architecture Rules

Dependency direction:

```text
app routes -> presentation -> application -> domain
composition -> presentation + application + infrastructure + domain
infrastructure -> application + domain
```

Layer ownership:

| Layer                | Owns                                                       |
| -------------------- | ---------------------------------------------------------- |
| `src/domain`         | Pure entities, validation, calculations, state transitions |
| `src/application`    | Use cases and ports owned by the product                   |
| `src/infrastructure` | Supabase, AI, weather, device, persistence adapters        |
| `src/presentation`   | Screens, components, hooks, rendering states, theme tokens |
| `src/composition`    | Concrete adapter/provider assembly                         |
| `app`                | Thin Expo Router wrappers                                  |

Hard rules:

- No `any`.
- Domain code imports no React, Expo, Supabase, storage, device, or network APIs.
- UI does not call Supabase, `fetch`, storage, or device APIs directly.
- Expected failures use `Result`.
- Every data-driven screen must handle loading, empty, error, offline, and retry states.
- Client env variables must use `EXPO_PUBLIC_`.
- Server-only secrets never go in the mobile app.

Dependency Cruiser enforces the main architecture boundaries through:

```powershell
pnpm run arch
```

## Feature Workflow

Build every real feature in this order:

1. Domain vocabulary and pure rule with a unit test.
2. Application port and use case.
3. Infrastructure adapter and input mapper.
4. Composition registration.
5. Presentation hook and screen.
6. Loading, empty, error, offline, and retry states.
7. One critical end-to-end user scenario.

Avoid speculative abstractions. Add a module only when it serves an MVP story.

## Routing

Expo Router is configured through:

- `package.json`: `main: "expo-router/entry"`
- `app.config.ts`: `expo-router` plugin and typed routes enabled
- `app/_layout.tsx`: root provider and stack shell
- `app/(onboarding)/`: onboarding route group
- `app/(tabs)/`: main tab route group

Current placeholder routes:

- `/`
- `/home`
- `/ai-chat`
- `/profile`
- `/settings`

The route skeleton exists so future screens have a clean place to land. It is
not a finished product flow.

## Environments

Tria. has three explicit environments:

| Environment   | Purpose                                 | App identity                                            |
| ------------- | --------------------------------------- | ------------------------------------------------------- |
| `development` | Local experiments and daily development | `Tria. Dev`, `tria-dev`, `com.tria.app.dev`             |
| `staging`     | Near-production testing                 | `Tria. Staging`, `tria-staging`, `com.tria.app.staging` |
| `production`  | Real user-facing app                    | `Tria.`, `tria`, `com.tria.app`                         |

Environment-specific scripts load `.env` first and then `.env.<environment>` if
that file exists. The selected script sets `EXPO_PUBLIC_APP_ENV` last, so a
staging or production command cannot accidentally run as development.

Start commands:

```powershell
pnpm run start:development
pnpm run start:staging
pnpm run start:production
```

Android commands:

```powershell
pnpm run android:development
pnpm run android:staging
pnpm run android:production
```

These start Expo and are long-running. Android commands require a device or
emulator.

Verify resolved Expo config:

```powershell
pnpm run config:development
pnpm run config:staging
pnpm run config:production
```

## Environment Variables

Committed examples:

- `.env.example`
- `.env.development.example`
- `.env.staging.example`
- `.env.production.example`

Local env files are ignored by Git:

- `.env`
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.sentry-build-plugin`

Create local defaults:

```powershell
pnpm run setup:local
```

Current public mobile variables:

| Variable                                | Required          | Notes                                                   |
| --------------------------------------- | ----------------- | ------------------------------------------------------- |
| `EXPO_PUBLIC_APP_ENV`                   | Yes               | `development`, `staging`, or `production`               |
| `EXPO_PUBLIC_ENABLE_ERROR_MONITORING`   | Yes               | `true` or `false`                                       |
| `EXPO_PUBLIC_SENTRY_DSN`                | Yes, may be empty | Required when monitoring is enabled outside development |
| `EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Yes               | Number from `0` to `1`                                  |
| `EXPO_PUBLIC_SUPABASE_URL`              | Yes, may be empty | Future public Supabase URL                              |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`         | Yes, may be empty | Future public Supabase anon key                         |
| `EXPO_PUBLIC_AI_GATEWAY_URL`            | Yes, may be empty | Future server AI gateway URL                            |
| `EXPO_PUBLIC_WEATHER_API_BASE_URL`      | Yes, may be empty | Future weather gateway/base URL                         |

Never put provider secrets in Expo env files. Gemini/OpenAI keys, weather API
keys, Supabase service-role keys, Sentry auth tokens, and private keys belong in
server-side secret storage only.

Validate env files:

```powershell
pnpm run env:check
```

## Sentry

Sentry uses `@sentry/react-native` and is wired in `src/composition`.

Runtime behavior:

- Development never reports events.
- Staging and production report only when
  `EXPO_PUBLIC_ENABLE_ERROR_MONITORING=true`.
- A DSN is required when monitoring is enabled outside development.
- `sendDefaultPii` is disabled.
- Trace sampling is controlled by `EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`.

Build-time source-map upload uses build secrets, not public Expo variables:

- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`
- optional `SENTRY_URL`

Do not commit those values.

## Scripts

| Command                   | Purpose                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| `pnpm install`            | Install dependencies and configure Git hooks                            |
| `pnpm run setup:local`    | Create `.env` from `.env.example` when missing                          |
| `pnpm run start`          | Start Expo dev server for default env; long-running                     |
| `pnpm run android`        | Start Expo for Android; requires device/emulator                        |
| `pnpm run web`            | Start Expo web dev server; long-running                                 |
| `pnpm run format`         | Apply Prettier formatting                                               |
| `pnpm run format:check`   | Check formatting                                                        |
| `pnpm run lint`           | Run ESLint with zero warnings                                           |
| `pnpm run lint:fix`       | Run ESLint auto-fix                                                     |
| `pnpm run typecheck`      | Run TypeScript without emitting files                                   |
| `pnpm run arch`           | Run Dependency Cruiser architecture checks                              |
| `pnpm run test`           | Run Jest                                                                |
| `pnpm run verify`         | Main quality gate: preflight, env, format, types, lint, arch, tests     |
| `pnpm run doctor`         | Run Expo Doctor                                                         |
| `pnpm run ci`             | Local mirror of GitHub Actions: `verify` plus `doctor`                  |
| `pnpm run precommit`      | Command executed by the pre-commit hook                                 |
| `pnpm run hook:precommit` | Cross-platform manual test of the hook entrypoint                       |
| `pnpm run bootstrap`      | Frozen install, setup local env, and run CI checks; does not start Expo |
| `pnpm run release:check`  | Frozen install, CI, and production dependency audit                     |

## Quality Gate

Run before pushing:

```powershell
pnpm run ci
```

`pnpm run ci` runs:

```powershell
pnpm run verify
pnpm run doctor
```

`pnpm run verify` runs:

```text
preflight -> env:check -> format:check -> typecheck -> lint -> arch -> test
```

## Git Hooks

`pnpm install` configures:

```text
core.hooksPath=.githooks
```

The pre-commit hook runs:

```powershell
pnpm run precommit
```

To manually test the hook entrypoint:

```powershell
pnpm run hook:precommit
```

## CI

GitHub Actions workflow:

```text
.github/workflows/verify.yml
```

It runs on every push, pull request, and manual dispatch.

CI uses:

- Node.js 24.
- pnpm 11.9.0.
- `pnpm install --frozen-lockfile`.
- `pnpm run setup:local`.
- `pnpm run ci`.

If CI fails, reproduce locally with:

```powershell
pnpm run ci
```

## Package Management

`pnpm-lock.yaml` is the only committed lockfile.

Blocked lockfiles:

- `package-lock.json`
- `yarn.lock`
- `bun.lock`
- `bun.lockb`

`npm install` is blocked by `scripts/ensure-pnpm.cjs`.

## Testing

Jest is configured with `jest-expo`.

Current tests:

- `src/domain/shared/result.test.ts`

The test suite is intentionally small because product features have not started.
New domain behavior should arrive with unit tests.

## Current Technical Edge Cases

- `pnpm audit --prod --audit-level moderate` reports one known Expo tooling
  advisory, `GHSA-w5hq-g745-h8pq`, ignored in `pnpm-workspace.yaml` because the
  suggested forced fix downgrades Expo and breaks the project.
- `pnpm peers check` reports an Expo internal peer warning around
  `react-native-worklets`. Expo Doctor passes and remains the authoritative Expo
  compatibility check.
- Sentry source-map upload warns locally until `SENTRY_ORG` and
  `SENTRY_PROJECT` are available in the build environment. This is expected.
- Android launch requires an emulator or physical device and is not part of
  automated CI.
- `pnpm run start`, `pnpm run android`, and environment start commands are
  long-running server commands.

## Useful Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Architectural style guide](docs/ARCHITECTURAL-STYLE-GUIDE.md)
- [Architecture decisions](docs/DECISIONS.md)
- [Development workflow](docs/DEVELOPMENT.md)
