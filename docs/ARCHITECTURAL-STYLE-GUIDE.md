# Architectural Style Guide

## Principles

- Keep the domain pure: no React, Expo, Supabase, device, or network imports.
- Keep route files thin: a route selects a presentation screen and nothing else.
- Put external systems behind infrastructure adapters. UI never calls Supabase,
  `fetch`, storage, or device APIs directly.
- Use the `Result` type for expected failures. Throw only unexpected failures at
  a system boundary where they can be reported.
- Prefer a short, concrete module over a reusable abstraction with no second use.
- `any` is prohibited. Validate untrusted input as `unknown` at the boundary.

## Layer Responsibilities

| Layer            | Responsibility                                                  |
| ---------------- | --------------------------------------------------------------- |
| `domain`         | Vocabulary, invariants, pure calculations, state transitions    |
| `application`    | Use cases and ports owned by the product                        |
| `infrastructure` | Supabase, weather, AI, secure storage, and device adapters      |
| `presentation`   | React Native UI, feature hooks, rendering states, design system |
| `composition`    | Wires concrete adapters into the application                    |

## UI Rules

- Use typed tokens from `src/presentation/theme`; do not repeat raw colors or
  spacing values throughout screens.
- Every data-driven screen explicitly handles loading, empty, error, retry, and
  offline states.
- Components receive view models and callbacks. They do not know where data came
  from.

## Review Checklist

- Does the dependency direction still point inward?
- Is the business rule unit tested without React Native?
- Is every mutation idempotent and authorized on the server?
- Are personal routes and health data kept out of AI prompts by default?
- Does the code solve a real MVP story without speculative layers?
