# Tria Architecture

## Goal

Tria is a mobile application for adaptive endurance training. The codebase is
organized to keep product rules independent from React Native, Expo, Supabase,
and AI providers.

## Dependency direction

```text
app routes -> presentation -> application -> domain
composition -> presentation + application + infrastructure + domain
infrastructure -> application + domain
```

The composition root is the only place allowed to assemble concrete adapters.
Dependency Cruiser enforces the prohibited reverse directions.

## Ownership

| Area             | Owns                                                            |
| ---------------- | --------------------------------------------------------------- |
| `domain`         | Core language, validation, pure calculations, state transitions |
| `application`    | Use cases and ports that describe required capabilities         |
| `infrastructure` | Supabase, Gemini, weather, secure storage, device adapters      |
| `presentation`   | Screens, UI primitives, feature components, rendering state     |
| `composition`    | Dependency injection and provider assembly                      |
| `app`            | Thin Expo Router route wrappers only                            |

## First feature implementation order

For every real feature, create work in this exact order:

1. Domain vocabulary and pure rule with a unit test.
2. Application port and use case.
3. Infrastructure adapter and input mapper.
4. Composition registration.
5. Presentation hook and screen.
6. Loading, error, empty, and offline handling.
7. One end-to-end test for the user journey.

## Source of truth

Supabase Postgres becomes the server source of truth once the data layer is
introduced. The application may cache data locally for offline use, but cached
data is never the authority. Planned workouts and completed workouts are
separate records. Every external mutation must be idempotent.

## Security boundaries

- Client-side environment variables use only the `EXPO_PUBLIC_` prefix.
- Supabase service-role keys and Gemini keys exist only in server secrets.
- Raw routes and health data are sensitive and are never sent to the AI model by
  default.
- Every Supabase table must ship with row-level security and an explicit policy.

## Quality gate

Before merging a feature, run:

```powershell
npm.cmd run verify
npm.cmd run doctor
```

Then exercise its critical scenario on a physical Android device. A feature is
not complete until its success, empty, loading, failure, and retry states are
intentional.
