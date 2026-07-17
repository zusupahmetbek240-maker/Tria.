# Supabase Workspace

This directory contains reproducible backend artifacts only:

- `migrations/` for schema and row-level-security changes;
- `functions/` for privileged operations such as AI orchestration;
- generated types after the database schema exists.

Do not place mobile API keys, production exports, or manually edited production
schema snapshots here. Every database change must be a migration.
