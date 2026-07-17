# Architecture Decisions

## ADR-001: One Expo application and one Supabase project

Tria starts as a modular monolith. The mobile app, Supabase Postgres, and Edge
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
