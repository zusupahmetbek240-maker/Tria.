# Tria. Agent Guide

## Purpose

Build the Tria. Expo application as a reliable product for adaptive endurance training. Make
focused changes that preserve the architecture documented in `docs/ARCHITECTURE.md`.

## Architecture

Use four dependency layers plus a composition root:

1. `src/domain`: pure entities, validation, state transitions, and calculations.
   It has no React, Expo, Supabase, storage, or network dependencies.
2. `src/application`: use cases and ports. It depends only on the domain and
   interfaces it owns.
3. `src/infrastructure`: adapters for Supabase, device APIs, local persistence,
   weather, notifications, and AI. It implements application ports.
4. `src/presentation`: screens, components, hooks, and UI built from typed theme tokens.
   It invokes application logic but never calls an external system directly.
5. `src/composition`: the only boundary allowed to assemble concrete adapters.

Expo Router files in `app/` are thin route wrappers. Dependency Cruiser enforces
the prohibited dependency directions.

## Code Rules

- TypeScript is strict. `any` is prohibited; use `unknown` plus a runtime guard
  for untrusted input.
- Keep domain logic pure and independently testable.
- Return `Result` objects for expected failures. Do not swallow errors.
- Avoid TODOs, placeholders, dead code, speculative abstractions, and broad
  generic utilities.
- Add a domain module only when an approved MVP user story requires it.
- Never store privileged keys in the mobile app. Gemini and Supabase service-role
  credentials belong only in server-side secrets.
- Do not add a direct Supabase, `fetch`, storage, or device API call to UI code.
- Do not introduce a styling library unless the current design system cannot solve a
  concrete MVP need with React Native `StyleSheet` and theme tokens.

## Feature Workflow

For every feature, add work in this order:

1. Domain rule and unit test.
2. Application port and use case.
3. Infrastructure adapter.
4. Composition registration.
5. Presentation hook and UI.
6. Empty, loading, error, offline, and retry states.
7. One critical end-to-end scenario.

## Verification

After code changes, run:

```powershell
pnpm run verify
pnpm run doctor
```
