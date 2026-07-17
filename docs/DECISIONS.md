# Architecture Decisions

## ADR-001: One Expo application and one Supabase project

Tria. starts as a modular monolith. The mobile app, Supabase Postgres, and Edge
Functions are sufficient for MVP. Separate services are introduced only when a
measured constraint requires one.

## ADR-002: Server data is authoritative

The client can cache data and queue a retry, but it does not own the canonical
training history. Every server mutation must be authorized and idempotent.

## ADR-003: The AI proposes, the user confirms

The AI can create a structured draft for a training-plan change. It cannot
write to the database directly or apply a plan change without confirmation.

## ADR-004: GPS and health imports are post-MVP

MVP records completed workouts manually. This supports every sport, including
pool swimming, avoids unreliable background behavior, and keeps the data model
ready for `gps` and `health_import` sources later.

## ADR-005: pnpm is the only package manager

The project keeps `pnpm-lock.yaml` as the single dependency lockfile. npm lockfiles
are not committed. `npm install` is blocked so Expo and React Native dependency
resolution stays reproducible.

The current Expo 57 toolchain reports `GHSA-w5hq-g745-h8pq` through the
`expo -> @expo/config-plugins -> xcode -> uuid` chain. The forced audit fix would
downgrade Expo and break the project, so this advisory is tracked as an explicit
pnpm audit exception until Expo ships a compatible upstream fix.

## ADR-006: Environments have separate app identity

Development, staging, and production use different Expo names, URL schemes,
slugs, and native identifiers. This allows local and staging builds to coexist
with the production app and reduces the chance of testing against the wrong app
target. Runtime public environment values are still loaded through `EXPO_PUBLIC_`
variables, while provider secrets stay server-side.

## ADR-007: Sentry is opt-in outside development

Sentry is installed through `@sentry/react-native` and initialized in the
composition layer. Development never reports events. Staging and production only
report when public runtime configuration explicitly enables monitoring and
provides a DSN. Source-map upload credentials are treated as build secrets and
are not stored in app environment files.
